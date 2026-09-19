# Provident Fund Knowledge Registry

*Version 0.1*

---

## Purpose

This document is the canonical knowledge registry for the Provident Fund domain inside Roy Reality.

It documents only stable knowledge. It records:

- what Goose currently knows
- how Goose knows it
- how confident Goose is
- what is still unknown

This document is **not** implementation documentation, research notes, or design discussion.

This is Version 0.1. It is expected to evolve. Nothing in this document should be treated as immutable.

---

## Guiding Principles

### Reality before Representation

Roy Reality models the financial reality of the money.

XML, annual reports, tax certificates and provider portals are different representations of that same reality.

No representation is assumed to be complete.

### XML First

Generic Clearinghouse XML is the preferred operational source.

Provider documents are primarily used to:

- understand XML semantics
- validate XML interpretation
- complement information that cannot yet be reconstructed from XML

The long-term objective is to reconstruct as much financial reality as possible from generic Clearinghouse XML.

### Evidence before Knowledge

Research is not Knowledge.

Hypotheses are not Knowledge.

Only evidence-backed understanding is promoted into this registry.

---

## Confidence Levels

| Level | Meaning |
|---|---|
| **Observed** | Seen in evidence, but not yet corroborated or generalized. |
| **Evidence Supported** | Supported by evidence that has been reviewed. |
| **Operationally Supported** | Supported by evidence and relied upon in operation. |
| **Verified** | Confirmed against authoritative evidence. |

---

## XML Completeness

XML Completeness should be recorded whenever sufficient evidence exists. Until then, the field may remain "Not yet recorded". When recorded, it is one of:

| Status | Meaning |
|---|---|
| **Confirmed in XML** | The knowledge is present in generic Clearinghouse XML. |
| **Partially Supported** | The XML carries part of the knowledge, but not all of it. |
| **Not Yet Identified** | The knowledge has not yet been located in XML; absence is not established. |
| **Confirmed Missing** | The knowledge has been checked and is confirmed to be absent from XML. |

---

## Discovery Template

```
PF-KR-XXX

Title

What we know

Evidence

Scope

Confidence

XML Completeness

Unknowns

Roy Reality Usage
```

---

## Knowledge Entries

### PF-KR-001

**Title:** Money Layers describe the money itself

**What we know:**
Money Layers describe the money itself. They do not describe providers, products or software structures.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-002

**Title:** Transfers (Nyud) are historical events

**What we know:**
Transfers (Nyud) are historical events. Transfers do not create new Money Layers.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-003

**Title:** Provider documents may represent the same reality differently

**What we know:**
Different provider documents may represent the same financial reality in different ways. Provider-specific representations must never be generalized without additional evidence.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Observed

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-004

**Title:** Contribution activity is independent of account existence

**What we know:**
Contribution activity is independent of account existence. An account may continue existing and accumulating returns while receiving no new contributions.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*
