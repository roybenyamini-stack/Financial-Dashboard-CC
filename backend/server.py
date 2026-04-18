import os
import math
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import anthropic
from dotenv import load_dotenv

def _load_env_file():
    """Load .env with absolute path + manual fallback + strip invisible chars."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    load_dotenv(dotenv_path=env_path, override=True)
    # Manual fallback — survives VS Code env injection edge cases
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, _, v = line.partition('=')
                    k = k.strip()
                    v = v.strip().strip('"').strip("'").strip()
                    if k and v:
                        os.environ[k] = v
    # Strip hidden chars from API key
    raw = os.environ.get('ANTHROPIC_API_KEY', '')
    clean = raw.strip().strip('"').strip("'")
    if clean != raw:
        os.environ['ANTHROPIC_API_KEY'] = clean
    print(f"DEBUG: Key starts with {clean[:7]} and its total length is {len(clean)} characters.")

    # Strip all noise from Org ID — no brackets, no quotes, no spaces
    raw_org = os.environ.get('ANTHROPIC_ORG_ID', '')
    clean_org = raw_org.strip().replace('[','').replace(']','').replace('"','').replace("'",'').strip()
    if clean_org:
        os.environ['ANTHROPIC_ORG_ID'] = clean_org
    print(f"DEBUG: Launching with Org ID {clean_org[:8]}... (full: {clean_org})")

_load_env_file()
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# period → (yf_period, yf_interval, intraday)
PERIOD_CFG = {
    '1d':  ('1d',  '5m',   True),
    '5d':  ('5d',  '15m',  True),
    '1m':  ('1mo', None,   False),
    '3m':  ('3mo', None,   False),
    '6m':  ('6mo', None,   False),
    '1y':  ('1y',  None,   False),
    '3y':  ('3y',  None,   False),
}

def _norm_fx(raw):
    """Accept any USD/ILS rate in the range 2.0–5.0 as-is."""
    if raw and not math.isnan(raw) and 2.0 <= raw <= 5.0:
        return round(raw, 4)
    return None

def _hist_price_and_chg(sym, is_fx=False):
    """
    Unified, weekend-safe price fetch using 5d history.
    Returns (price, change_pct).  For FX tickers, normalises the rate.
    """
    try:
        hist   = yf.Ticker(sym).history(period='5d')
        closes = hist['Close'].dropna()
        if closes.empty:
            return None, None

        raw_price = float(closes.iloc[-1])
        raw_prev  = float(closes.iloc[-2]) if len(closes) >= 2 else None

        if is_fx:
            price = _norm_fx(raw_price)
            prev  = _norm_fx(raw_prev) if raw_prev else None
        else:
            price = round(raw_price, 2)
            prev  = round(raw_prev, 2) if raw_prev else None

        chg = round((price / prev - 1) * 100, 2) if (price and prev) else 0.0
        return price, chg
    except Exception as e:
        app.logger.error(f"_hist_price_and_chg({sym}): {e}")
        return None, None

def _index_data(sym, is_fx=False):
    price, chg = _hist_price_and_chg(sym, is_fx=is_fx)
    return {"price": price, "change_pct": chg}

def _safe_price(t):
    """Return last non-NaN close from 5d history (used by /api/stock)."""
    try:
        hist   = t.history(period='5d')
        closes = hist['Close'].dropna()
        return float(closes.iloc[-1]) if not closes.empty else None
    except Exception:
        return None

def _get_fx_rate():
    """Return the current USD/ILS rate. USDILS=X is more reliable than ILS=X."""
    price, _ = _hist_price_and_chg('USDILS=X', is_fx=True)
    return price if price else 3.70

def _to_history(hist, intraday=False, price_divisor=1):
    rows = []
    for d, v in zip(hist.index, hist['Close']):
        if math.isnan(float(v)):
            continue
        label = d.strftime('%H:%M') if intraday else str(d.date())
        rows.append({"date": label, "close": round(float(v) / price_divisor, 2)})
    return rows

@app.route('/api/market')
def market():
    ta125 = _index_data('^TA125.TA')
    sp500 = _index_data('^GSPC')
    fx    = _index_data('USDILS=X', is_fx=True)
    print(f"DEBUG: TA-125 Price: {ta125['price']}, S&P 500: {sp500['price']}, USD/ILS: {fx['price']}")
    return jsonify({"ta125": ta125, "sp500": sp500, "fx": fx})

@app.route('/api/stock')
def stock():
    ticker_sym = request.args.get('ticker', '').strip().upper()
    period_raw = request.args.get('period', '1m')
    bench_sym  = request.args.get('bench', 'SPY').strip().upper()

    app.logger.info(f"/api/stock ticker={ticker_sym} period={period_raw} bench={bench_sym}")

    cfg = PERIOD_CFG.get(period_raw, ('1mo', None, False))
    yf_period, yf_interval, intraday = cfg

    t = yf.Ticker(ticker_sym)
    fetch_kwargs = {'period': yf_period}
    if yf_interval:
        fetch_kwargs['interval'] = yf_interval

    hist = t.history(**fetch_kwargs)

    # Weekend fallback: if 1d returns empty try 5d
    if hist.empty and period_raw == '1d':
        app.logger.info(f"1d empty for {ticker_sym}, retrying with 5d/15m")
        hist = t.history(period='5d', interval='15m')
        intraday = True

    if hist.empty:
        app.logger.warning(f"No history for {ticker_sym} with period={yf_period}")
        return jsonify({"error": f"No data found for {ticker_sym}"}), 404

    info       = t.info or {}
    name       = info.get('longName') or info.get('shortName') or ticker_sym
    currency   = info.get('currency', 'USD')

    # Israeli stocks on TASE are priced in Agorot (ILa = 1/100 NIS)
    agorot = (currency == 'ILa')
    divisor = 100 if agorot else 1
    if agorot:
        currency = 'ILS'

    price      = _safe_price(t)
    if price is None:
        closes = hist['Close'].dropna()
        price  = float(closes.iloc[-1]) if not closes.empty else 0.0
    price = round(price / divisor, 2)

    prev_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
    if prev_close:
        prev_close = float(prev_close) / divisor
    change_pct = round((price / prev_close - 1) * 100, 2) if prev_close else 0.0

    fx_rate = _get_fx_rate()

    # Benchmark
    benchmark = []
    if bench_sym and bench_sym != ticker_sym:
        try:
            b_hist = yf.Ticker(bench_sym).history(**fetch_kwargs)
            if not b_hist.empty:
                benchmark = _to_history(b_hist, intraday)
        except Exception:
            pass

    # News
    news = []
    try:
        for article in (t.news or [])[:5]:
            content   = article.get('content', {})
            title     = content.get('title') or article.get('title', '')
            click     = content.get('clickThroughUrl') or content.get('canonicalUrl') or {}
            url       = (click.get('url', '') if isinstance(click, dict) else click) or ''
            prov      = content.get('provider', {})
            publisher = (prov.get('displayName', '') if isinstance(prov, dict) else '') or ''
            if title:
                news.append({"title": title, "url": url, "publisher": publisher})
    except Exception:
        pass

    # Sniper (52W levels) — adjust for Agorot
    sniper = {}
    try:
        lo, hi = info.get('fiftyTwoWeekLow'), info.get('fiftyTwoWeekHigh')
        if lo and hi:
            lo_adj = round(float(lo) / divisor * 1.03, 2)
            hi_adj = round(float(hi) / divisor * 0.97, 2)
            sniper = {"target_buy": lo_adj, "target_sell": hi_adj,
                      "note": "52W Low+3% / High-3%"}
    except Exception:
        pass

    return jsonify({
        "name":       name,
        "price":      price,
        "currency":   currency,
        "change_pct": change_pct,
        "fx_rate":    fx_rate,
        "history":    _to_history(hist, intraday, price_divisor=divisor),
        "benchmark":  benchmark,
        "news":       news,
        "sniper":     sniper
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    body = request.get_json(force=True) or {}
    print(f"Chat request received. Keys in body: {list(body.keys())}")

    api_key = os.getenv('ANTHROPIC_API_KEY') or ''
    if not api_key or api_key == 'your_key_here' or not api_key.startswith('sk-'):
        print(f"ERROR chat: Invalid key [{api_key[:8] if api_key else 'empty'}...]")
        return jsonify({"error": {"type": "auth_error", "message": "Missing API Key — update backend/.env"}}), 500

    # Support two payload formats:
    # 1. Anthropic-native: {system, messages, max_tokens, model}  (sent by frontend)
    # 2. Simple:           {prompt/message/content, ticker}       (legacy)
    messages   = body.get('messages')
    system_msg = body.get('system', "אתה אנליסט שוק ההון מומחה. ענה תמיד בעברית, בצורה תמציתית וברורה.")
    max_tokens = int(body.get('max_tokens', 800))

    if not messages:
        # Legacy format
        prompt = body.get('prompt') or body.get('message') or body.get('content') or ''
        ticker = body.get('ticker') or ''
        if not prompt:
            print("ERROR chat: No question received in body")
            return jsonify({"error": {"type": "invalid_request", "message": "No question received"}}), 400
        user_msg = f"מניה: {ticker}\n\n{prompt}" if ticker else prompt
        messages = [{"role": "user", "content": user_msg}]

    api_key_clean = (os.getenv('ANTHROPIC_API_KEY') or '').strip()
    print(f"Chat: {len(messages)} message(s), max_tokens={max_tokens}")
    print(f"DEBUG: Using API Key prefix: {api_key_clean[:10]}")

    # Clean client — no Org ID header, to isolate the connection
    client = anthropic.Anthropic(api_key=api_key_clean)

    model_id = "claude-sonnet-4-6"
    print(f"DEBUG: Calling model {model_id}")
    try:
        message = client.messages.create(
            model=model_id,
            max_tokens=max_tokens,
            system=system_msg,
            messages=messages
        )
        print(f"DEBUG: Success with {model_id}")
        return jsonify({"content": [{"type": "text", "text": message.content[0].text}]})
    except Exception as e:
        err_str = str(e)
        print(f"ERROR chat: {type(e).__name__}: {err_str}")
        return jsonify({"error": {"type": type(e).__name__, "message": err_str}}), 500

@app.route('/api/probe')
def probe():
    """Debug endpoint: test API key and model access."""
    api_key = (os.getenv('ANTHROPIC_API_KEY') or '').strip()
    if not api_key.startswith('sk-'):
        return jsonify({"status": "error", "reason": "Invalid or missing API key"})
    client  = anthropic.Anthropic(api_key=api_key)
    results = {}
    for m in ["claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-3-opus-20240229"]:
        try:
            client.messages.create(model=m, max_tokens=10,
                messages=[{"role": "user", "content": "hi"}])
            results[m] = "OK"
        except Exception as e:
            results[m] = f"FAIL: {type(e).__name__}"
    print(f"DEBUG probe results: {results}")
    return jsonify({"key_prefix": api_key[:8], "models": results})

if __name__ == '__main__':
    app.run(port=5051, debug=True)
