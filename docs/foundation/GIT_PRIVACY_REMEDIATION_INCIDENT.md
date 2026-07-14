# Git Privacy Remediation Incident

*Roy Reality Lab — Evidence-Graded Incident Record*

*Version 1.0 — 2026-07-15*

**Author:** Claude Code (session-driven investigation and remediation)
**Product Owner:** Roy

---

## 1. Classification

This document records repository *truth* discovered through investigation — what was actually exposed, what was actually done about it, and what remains — not product policy or a domain rule. It follows the same evidentiary discipline as `GOOSE_EXPEDITION_1_ASSESSMENT.md` and is classified the same way: a Roy Reality Lab artifact, not a Goose Financial domain document. It is historical record once closed; it is not to be edited in place to reflect later, unrelated findings — a new document should be created for those, per the project's documentation lifecycle (`GOOSE_DOCUMENTATION_GOVERNANCE.md` §5).

This incident interrupted a Goose Knowledge milestone on Gemel/Amendment 190 when the repository itself — not the domain being documented — was found to require Reality-before-Code treatment.

---

## 2. What was exposed

Discovered 2026-07-14: `github.com/roybenyamini-stack/Financial-Dashboard-CC` is a **public** repository whose git history (not only its current tree) contained:

- **Real Mislaka pension-clearinghouse XML exports** — 17 files, real account/policy numbers, real balances, real provider codes, under `57775074_513173393_KGM_202605182323_5/` and a duplicate historical copy under `XML Files/`.
- **Real financial identifiers and AI-extraction outputs** — test-run outputs from ad-hoc parser scripts run against real personal PDF annual reports (Altshuler Shaham, Meitav), plus a raw PDF-text dump (`test_output.txt`), plus several one-off debug/audit scripts that hardcoded real account numbers and real local PDF filenames/paths.
- **Local personal PDF references** — several scripts hardcoded the literal path to real PDF annual reports in `/Users/roybenyamini/Downloads/`, revealing document names and years even where account numbers weren't also present.
- **A historical Anthropic API key** — `.env` and `backend/.env`, containing `ANTHROPIC_API_KEY` and `ANTHROPIC_ORG_ID`, committed `2026-06-16` and removed from tracking the same day, but recoverable from history until this remediation.
- **A pervasively-embedded live identifier** — a real Study Fund account number ("Identifier A" in the session record) used as a functional object key throughout `app.js`/`index.html`'s older fund-tracking subsystem (`FUNDS`, `selectFund()`), present since the repository's first commit (`f118751`, 2026-03-15) and confirmed structurally load-bearing (a localStorage-persisted, restore/import-matched key), not decorative.
- **A worked-example pair** ("Identifiers B/C") — a real account-tokenization example in `docs/provident_funds_logic.md`'s Sniper Mode documentation and one commit message, corroborated as real by independently matching content inside the real XML evidence above.
- **A related family of example values in `ai_prompts.js`** — all four illustrative `assetNum` examples in this file's few-shot prompt templates, plus a policy-number example in its BLACKLIST OVERRIDE rule text, were confirmed real or strongly correlated with the evidence above (not synthetic, despite being labeled as "examples").

---

## 3. What was remediated

- **Anthropic key rotated.** Old key revoked by Roy manually; a new key was created and validated after a server restart — confirmed via a successful Altshuler PDF analysis and a successful Anthropic-backed AI-advisor request.
- **Approved sensitive paths removed from reachable git history.** A `git filter-repo --sensitive-data-removal` pass (installed `git-filter-repo` 2.47.0) removed 15 explicit paths across every ref in the repository (not scoped to `main` only): the real KGM XML directory and its historical `XML Files/` duplicate, `.env`/`backend/.env`, three real provider test-output JSONs, `test_output.txt`, and six orphaned dev/debug scripts with hardcoded real paths or account numbers (`debug-raw-data.js`, `audit-meitav-two-accounts.js`, `inspect-meitav-text.js`, `test-parsers.js`, `test-altshuler-parser.js`, `test-meitav-parser.js`). `ai_prompts.js`'s old (unsanitized) history was included in this same purge, recreated fresh — see below.
  - First Changed Commit: `c845cba6fff9c64789b940e52bdb1497b95688de` (2026-05-14).
  - 110 of 316 commits rewritten; `refs/tags/v177.36` (2026-05-12) predates all sensitive content and retained its original hash unchanged, confirmed by evidence rather than assumed.
- **Sensitive worked examples and commit-message text sanitized in a second, constrained pass.** Identifiers B/C and their original hyphenated form were replaced, with one internally consistent synthetic transformation example, in both historical file blobs (`--replace-text`) and commit messages (`--replace-message`) across all reachable history. Identifier A was replaced *only* in the two commit messages that used it as a label (`[REDACTED_ACCOUNT_IDENTIFIER]`) — **not** in any file blob; see §4 for why.
- **`ai_prompts.js` recreated with synthetic examples.** All five real-or-correlated values found in this file (four `assetNum` examples plus the "user's ID + suffix" example used twice) were replaced with clearly synthetic, structurally-equivalent placeholders. The file's instructional content is otherwise unchanged.
- **Preventive `.gitignore` protections added** for real XML exports, real extraction/test outputs, the specific removed debug-script filenames, server-code backups, and local PDF evidence — see the working clone's `.gitignore` for the exact patterns.
- **Obsolete, fully-merged branches removed from the remediation mirror** — `feature/tax-waterfall` and `rescue-branch` (each confirmed, via `git merge-base`, to have zero commits not already in `main`) were deleted rather than carried forward through the rewrite.

---

## 4. Accepted residual risk

**Identifier A remains present in historical and current runtime blobs (`app.js`, `index.html`).** This is an explicitly accepted residual risk, not an accidental omission. Evidence gathered this session showed it functions as a nested key inside a `localStorage`-persisted payload (`dashboard_assets_v1`) and is matched by exact string in both the restore path and the Excel-import merge path. Replacing it now, without a reviewed migration, risked silently disconnecting Roy's real, already-accumulated historical data for that fund — a violation of "existing functionality is sacred." It is deferred to **Canonical Runtime Identifier Migration** (§5).

**The same investigation surfaced that this is very likely not an isolated case.** A second real identifier ("1428298", one of `ai_prompts.js`'s sanitized example values) was independently found embedded in the *same* `FUNDS`/`PENS_*`-mapping subsystem in `app.js`/`index.html`, in the same structural role, present since the first commit — discovered only because it happened to also appear in `ai_prompts.js`'s examples. The `FUNDS` object and its Excel-column-to-key mapping tables contain numerous other fund/account-shaped keys (e.g. distinct numbers tied to Altshuler, Mor, Meitav, Harel entries visible in `index.html`'s fund table) that were not individually traced this session, since doing so was outside this incident's approved scope. **The true scope of real identifiers embedded as live keys in this subsystem is almost certainly larger than the one or two instances this incident happened to trace by coincidence** — this is recorded here explicitly rather than left for a future reader to discover, per the project's own practice of stating gaps rather than implying completeness.

**The repository remains public temporarily.** Roy's explicit decision, made to preserve the working GitHub Pages deployment and avoid combining repository-visibility or deployment changes with the history rewrite. Roy explicitly accepts that the already-exposed personal data may remain publicly reachable until the cleaned history is force-pushed, and that Identifier A (and the broader family described above) remains reachable in the pushed history indefinitely, pending the migration below.

---

## 5. Deferred required follow-ups

1. **Canonical Runtime Identifier Migration** (required before external users are allowed to store real data — see §6). Scope, per §4's findings: not just Identifier A, but a full audit of every real-looking key in `FUNDS` and its `PENS_*` mapping tables in `app.js`/`index.html`, a designed `localStorage` migration/alias mechanism, and a decision on whether any of these should become synthetic once real user data no longer depends on them structurally.
2. **Remove or restrict `GET /api/debug-api`'s key-prefix exposure** (`server.js`, returns the first 8 characters of `ANTHROPIC_API_KEY` in its JSON response on both success and error paths) — tracked separately, not touched during this incident (see memory `project_debug_api_key_exposure.md`).
3. **Security, Privacy & Deployment Architecture** — a durable document establishing how this project handles secrets, personal evidence, and deployment going forward, so this class of incident doesn't recur silently.
4. **Claude Command Approval Guide** — named by Roy as a deferred follow-up; not scoped in detail during this incident.
5. **Synthetic parser fixtures and regression tests** — the real provider test-output JSONs removed in §3 provided no active regression coverage (nothing read them back programmatically); a future task should build genuine synthetic fixtures and wire the Altshuler/Meitav parser scripts into real automated tests, closing a gap already flagged independently in `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md`.

---

## 6. Security gate

**External users must not be invited to store real data in this application until both the Canonical Runtime Identifier Migration and the Security, Privacy & Deployment Architecture review (§5) are complete.** Until then, this project remains a single-user (Roy) real-data environment with a known, accepted, and documented residual exposure — not a multi-user-safe system.

---

*This document is the canonical record of the 2026-07-14/15 Git Privacy Remediation Incident. For the underlying Goose documentation governance model, see `GOOSE_DOCUMENTATION_GOVERNANCE.md`. For the deferred debug-api finding, see the project memory referenced in §5.*
