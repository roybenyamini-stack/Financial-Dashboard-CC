# System Architecture

## PDF Parsing Pipeline

### Overview

`/api/parse-pdf` accepts a base64-encoded PDF and an account number, extracts the Israeli capital gains tax tier data (Keren Hishtalmut annual report), and returns a structured JSON payload to the frontend.

**Route:** `POST /api/parse-pdf`  
**Request body:** `{ pdf: string (base64), assetNum: string }`  
**Response:** `{ exemptPrincipal, exemptProfit, taxablePrincipal, taxableProfit, taxableProfit15, taxableProfit20, taxableProfit25, exemptAssets, pdfTotalBalance, reportYear }`

### Parsing Flow

```
PDF (base64)
    │
    ▼
pdf-parse (text extraction)
    │
    ▼
scopeTextToAccount()  ← narrows 49-page PDF to ~10KB account block
    │
    ▼
detectFirm()          ← regex match on "מיטב" / "אלטשולר"
    │                    returns null → 422 immediately (no fallback)
    ├── 'meitav'    → parseMeitav(scopedText)        [regex-based, no AI]
    └── 'altshuler' → parseAltshuler(scopedText, assetNum)  [Claude Haiku]
    │
    ▼
_aggregateTierRows()  ← shared aggregation of 1–4 tax-rate rows
    │
    ▼
res.json(result)
```

### Firm Detection

`detectFirm(text)` searches the **full** PDF text (before scoping) for firm keywords:

| Keyword   | Firm       | Parser          |
|-----------|------------|-----------------|
| `מיטב`    | Meitav     | `parseMeitav`   |
| `אלטשולר` | Altshuler  | `parseAltshuler`|
| _(none)_  | Unknown    | 422 error       |

There is **no default firm**. An unrecognized PDF is rejected immediately.

### Tax Tier Logic

The number of tax tiers (0%, 15%, 20%, 25%) is determined by the account's deposit seniority under Israeli capital gains tax law — it is **not firm-specific**. Both parsers dynamically extract however many rows are present in the document (1–4 rows).

---

## Data Validation Strategy

### Strict Mode

The system operates in **Strict Mode**: data accuracy is prioritized over availability. If a PDF deviates from the expected structure, the system rejects the file and returns an error rather than returning partial or corrupt data to the frontend.

This decision was made because:
- Returning a `pdfTotalBalance` of 0 silently would cause the dashboard to display ₪0 fund value, which is misleading and potentially dangerous for financial decision-making.
- Returning an empty `rows` array silently would suppress all tax tier data and show no tax liability — a false negative.
- The frontend has no way to distinguish "data is genuinely zero" from "parsing failed" unless the server signals failure explicitly.

### Validation Gates

Both `parseMeitav` and `parseAltshuler` throw an `Error` (not return partial data) if any of the following conditions are true **after** extraction:

| Condition | Error thrown |
|-----------|--------------|
| Zero tax tier rows extracted | `"<Firm> strict: no tax tier rows found"` |
| `pdfTotalBalance` is 0, NaN, or non-finite | `"<Firm> strict: total balance not found"` |
| `reportYear` is 0 or missing | `"<Firm> strict: report year not found"` |
| AI returns unparseable JSON | `"<Firm> strict: AI returned invalid JSON"` |

### HTTP Status Codes

| Scenario | Status |
|----------|--------|
| Missing `pdf` or `assetNum` field | 400 |
| PDF text extraction failed (scanned image) | 422 |
| Firm not recognized in PDF | 422 |
| Strict mode validation failed (missing fields) | 422 |
| AI/network error during parsing | 422 |

All 422 responses include a descriptive `{ error: "..." }` body. The frontend should surface this message to the user rather than silently failing.

### Adding a New Firm

To support a new investment firm:
1. Add a keyword branch in `detectFirm()`.
2. Implement an isolated `parseXxx(scopedText, assetNum)` function.
3. The function **must** throw on any missing essential field (rows, balance, year) — no silent defaults.
4. Add a branch in the route handler's router.
5. Document the firm's PDF structure here.
