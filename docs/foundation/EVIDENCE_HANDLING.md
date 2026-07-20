# Goose Evidence Handling — Phase 1 Policy

**Status:** Implemented — pending Codex verification. The Vault skeleton, `README.md`, and `goose-evidence.code-workspace` (Phase 1 Deliverables §4 items 1–3 of the plan) exist on disk. The §3 practical test protocol — confirming whether the Codex VS Code extension actually reads the second workspace root — has not been run, because the GitHub Copilot/Codex agent is not currently configured in this VS Code environment. Until that test runs, §4's Codex direct-access path is unverified — not rejected — and the §5 fallback (Claude Code reads the Vault directly; Codex receives only derived facts) is the current operational workaround for any real evidence work, not the intended long-term architecture. Not yet registered as a numbered Foundation artifact in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3, and not yet referenced from `GOOSE_BOOT.md`. Both remain deferred to Phase 2, once the discovery workflow this document supports has actually run and shown what the permanent version needs to say (see `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md`-style "Open Items" discipline — this document states its own incompleteness rather than implying it's final).

**Author:** Claude Code
**Product Owner:** Roy

---

## 1. The boundary is ownership, not privacy

Every piece of evidence Goose uses splits into exactly one of two tiers. The test:

> **Would this exact file be valid evidence for a different user of Goose Financial?**

- **Yes → Canonical Source.** Public, authoritative, domain-independent-of-Roy. Lives inside this git repository, committed normally, cited by path.
- **No → Private Evidence.** Specific to Roy. Lives in the external Vault (§3), never git-tracked, never cited from a committed document by filename.

Privacy is a *consequence* of this split, not its driver: Private Evidence is kept out of git because it belongs to Roy, not Goose — even in a hypothetical case where a particular private document carried no sensitive content, it would still not belong in the repo's canonical-source tree.

**Worked examples:**
- A *blank* Form 106 template (the government's official form) → Canonical Source. Roy's *filled* Form 106 → Private Evidence.
- Legislation, regulations, XSD schemas, official specifications → Canonical Source.
- A Deloitte or pension-advisor report — even one that mostly discusses general tax law — is written about Roy's specific numbers and circumstances; a different user's version of the same report would differ → Private Evidence.
- Salary slips, clearinghouse XML exports, annual reports, screenshots, migration letters → Private Evidence.

This formalizes a boundary `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3 already ratifies (Goose General/Financial vs. Roy Reality Lab) rather than inventing a new one.

---

## 2. Why not just gitignore it

This repository already lived through the failure mode a gitignored in-repo `evidence/` folder would reproduce: real Mislaka XML exports, real PDF-derived output, a live API key, and hardcoded account numbers were previously committed to this **public** repo and had to be purged with `git filter-repo` (`docs/foundation/GIT_PRIVACY_REMEDIATION_INCIDENT.md`). Gitignore only protects a path from the moment the rule exists — it does nothing for a file already committed before the rule was written, which is exactly what happened. Private Evidence is therefore kept **structurally** outside the repository (a sibling filesystem folder, no `.git` of its own), not gitignored-inside-repo. There is no rule to get wrong, because there is nothing inside the working tree to protect.

---

## 3. The Vault — where Private Evidence lives

A sibling folder to this repository:

```
<parent folder>/
  Financial_Dashboard_CC/          ← this git repo
  Goose_Evidence_Vault/            ← the Vault — sibling folder, no .git, never committed
    primary_reality/
      salary_slips/
      forms_106/
      clearinghouse_xml/
      annual_reports/
    professional_interpretation/
      deloitte/
      pension_advisor/
    supporting/
      screenshots/
      migration_letters/
    README.md                      ← orients a session already looking at the Vault
  goose-evidence.code-workspace     ← multi-root VS Code workspace file, outside both folders
```

The Vault's own `README.md` carries a short orientation; this document is the actual policy and takes precedence if the two ever disagree.

---

## 4. Access — VS Code multi-root workspace

Two sessions need to read the Vault:

- **Claude Code (local CLI):** already has ordinary filesystem access to the sibling folder — no special mechanism needed in Phase 1.
- **Codex (VS Code extension):** reads the Vault via `goose-evidence.code-workspace`, a multi-root VS Code workspace listing both `Financial_Dashboard_CC/` and `Goose_Evidence_Vault/` as workspace folders. Adding a folder to a VS Code workspace does **not** add it to any git repository — each root's Source Control view is independent and tied to whether that folder has its own `.git`. The Vault has none, so it can never become part of this repo's history through the workspace mechanism.

Whether the installed Codex extension actually honors both workspace roots (versus scoping itself to the primary folder, or being blocked by VS Code's Workspace Trust prompt, or an internal allow-list) is a product-behavior fact this document cannot state with certainty — it must be verified empirically before any real evidence is placed in the Vault. See the Phase 1 plan's practical test protocol (`~/.claude/plans/goose-engineering-snazzy-riddle.md` §3) for the exact steps. If that test shows Codex cannot read the Vault directly, the fallback is: a Claude Code session reads the raw file and hands Codex only the derived, already-reviewed facts — Codex never touches raw Private Evidence in that case.

No env-var indirection layer exists yet (e.g. a `GOOSE_EVIDENCE_VAULT` variable) — not needed for the VS Code access path; deferred to Phase 2 if a non-VS-Code access path is ever required.

---

## 5. Precision rule — no default rounding

When a research session writes derived facts from Private Evidence into a committed document (a Knowledge Object, an evidence-index entry, or any other tracked file), it must preserve the precision needed for verification and calculation. **Redaction or rounding is applied only where specifically justified in that instance** (e.g. to remove an account number or a name) — never as a blanket default transformation. Every case that does mask or round a figure should state why, in place, rather than following an assumed convention. (This corrects an earlier draft of this plan, which proposed a universal "round to nearest 10" rule — rejected as too broad by the Product Owner.)

---

## 6. What this document deliberately does not do (Phase 1 scope)

No Evidence ID scheme, no Vault Manifest, no checksums, no request/resume log, no Evidence Index template, no changes to `GOOSE_BOOT.md` or `GOOSE_DOCUMENTATION_GOVERNANCE.md`, no automatic folder-creation logic, no Canonical Source repository restructuring. These are proposed only after the discovery workflow this document supports has actually run and shown they're needed — see the Phase 1 plan for the full deferred list.

If Boot integration is designed later, it may only **detect and report** a missing or unresolvable Vault — it must never create folders or choose a path on its own; any folder creation or path selection remains an explicit, Roy-approved action, exactly as the Vault skeleton in §3 was created explicitly rather than by an automated step.
