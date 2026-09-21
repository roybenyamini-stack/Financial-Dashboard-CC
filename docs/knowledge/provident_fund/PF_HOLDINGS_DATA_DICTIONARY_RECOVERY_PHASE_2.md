# Holdings data-dictionary recovery — Phase 2

Research date: 2026-07-21\
Status: **B — no public copy of the official Holdings data dictionary was
recovered after the documented public-source search below.**  This is a recovery
report, not a semantic interpretation of any field.

## Result

The official Holdings dictionary is positively identified, but its workbook and
the corresponding Holdings XSDs could not be downloaded or recovered from a
public archive/mirror examined in this pass.

The work did produce two verified official filenames:

| Artifact | Version/date evidence | Status |
|---|---|---|
| `MivneAchid_Holdings_Excel.xlsx` | Embedded in CMA Holdings-interface circulars available in 2018 and 2020 | Official target identified; download redirected from legacy `mof.gov.il` to `www.gov.il` and returned Cloudflare 403 |
| `MivneAchid_DataTransfer_Holdings_0320.xlsx` | Embedded link in the CMA's March 2020 Holdings publication, preserved by Funder | Official historical target identified; public fetch timed out/redirected to the same protected CMA landing path |
| `MivneAchid_Holdings_KupotGemel_XSD_Schema.xsd` | Embedded in official 2018 and 2020 CMA circulars | Official target identified; no public copy recovered |
| `MivneAchid_Holdings_HevrotBituah_XSD_Schema.xsd`, `...KarnotPensiaHadashot...`, `...KarnotPensiaVatikot...` | Same official circular links | Official targets identified; no public copy recovered |

No file was recovered.  Consequently, there is no basis to extract or preserve
the requested code tables, no basis to quote the `TIKUN-190` data-dictionary
entry, and no basis for a version comparison of its definition.

## What is verified about the intended primary artifact

The CMA's uniform-structure circular defines *Holdings Interface* (ממשק
אחזקות) as the data a body must provide to show the current status of a
customer's pension products and savings as of a cutoff date.  It says the
attached Excel contains the fields and their values, product relevance, and
implementation urgency; the product-specific XML/XSD files are attached
validation artifacts.  Thus the Excel—not a field name, XML sample, vendor
documentation, or tax commentary—is the correct canonical source.

The archival Funder rendering of the March-2020 CMA publication exposes the
legacy official hyperlink target as:

```text
https://mof.gov.il/hon/Documents/
%D7%94%D7%A1%D7%93%D7%A8%D7%94-%D7%95%D7%97%D7%A7%D7%99%D7%A7%D7%94/
mosdiym/memos/MivneAchid_DataTransfer_Holdings_0320.xlsx
```

The official 2018 and 2020 CMA PDFs embed the legacy target filenames stated in
the result table.  These are verified link targets, not recovered artifacts.

## Search record

| Search path | What was checked | Result |
|---|---|---|
| CMA / gov.il current publication | CMA circular 2020-9-12 and CMA regulation-527 PDF | PDFs recovered and their embedded attachment links extracted.  The workbook row/code tables are not reproduced in either PDF. |
| CMA / mof.gov.il legacy files | Direct HTTPS requests to the embedded workbook/XSD URLs, including the `_0320` historical filename | `mof.gov.il` returns a 301 to the current CMA landing page; the resulting `www.gov.il` request returns Cloudflare 403.  The HTML challenge was discarded, not mistaken for a workbook. |
| Historical official circulars | 2018 CMA update PDF mirrored by the Chamber of Commerce; March-2020 CMA circular rendered by Funder | Confirmed the legacy workbook/XSD names and that the structure was versioned.  No attached workbook was mirrored with the PDF/article. |
| Wayback Machine | Exact `https` and `http` timemap requests for both known workbook names and the provident-fund XSD | Returned empty capture arrays for the queried exact URLs.  A wildcard CDX request was attempted but timed out without a response. |
| Common Crawl | Exact-name queries against 2018-51, 2019-35, 2019-51, 2020-10, 2020-34, 2020-50, 2021-04, and 2021-49 indexes; both `mof.gov.il` and `www.mof.gov.il` tested where applicable | Each query returned “No Captures found.” |
| General public web indexes | Exact filename and exact field/code identifiers: `TIKUN-190`, `REKIV-ITRA-LETKUFA`, `SUG-ITRA-LETKUFA`, and `KOD-TECHULAT-SHICHVA`; Hebrew/English Holdings/XSD queries | No workbook/XSD mirror or data-dictionary row found.  Results were only the governing circulars or unrelated tax commentary. |
| GitHub | Public code search attempted (authentication now required); public repository search for Israeli-pension / clearinghouse terms; `hasadna/open_pension` repository tree inspected | No Holdings Excel/XSD or matching field/code identifiers found.  The repository contains unrelated product-market sample XMLs and frontend holdings code, not the clearinghouse dictionary. |
| GitLab | Public project searches for `MivneAchid` and Hebrew clearinghouse terms | No candidate projects. |
| In-app browser | Browser-runtime availability checked under the available Browser skill | No browser endpoint was available, so it could not provide an authenticated/interactive alternative. |
| Public industry/regulatory mirrors | Funder and Chamber of Commerce CMA-document mirrors; CMA system-rule PDFs surfaced by public search | Found circular text and link targets only; no package, ZIP, spreadsheet, or XSD attachment. |

## Version comparison

The available evidence confirms that the Holdings specification was updated
between circulars, and identifies a specifically dated March-2020 workbook
filename.  It does **not** expose the contents of either workbook.  Therefore:

* whether `TIKUN-190` appears in each version is **UNKNOWN**;
* whether its label, XSD type, product applicability, cardinality, or codes
  changed is **UNKNOWN**; and
* no claim of stability is made.

## Requested code tables

No official Holdings workbook was obtained.  Accordingly, no official code table
can be extracted or preserved for `REKIV-ITRA-LETKUFA`, `SUG-ITRA-LETKUFA`,
`KOD-TECHULAT-SHICHVA`, `MAMAD`, `SUG-KUPA`, `TIKUN-190`, or any other field.
Creating a partial table from observed XML or vendor knowledge would violate the
evidence hierarchy and is deliberately out of scope.

## What would close the evidence gap

One of the following primary artifacts is required:

1. a recovered copy of either named official workbook, with file hash and
   provenance;
2. the exact official provident-fund Holdings XSD corresponding to the XML
   interface version; or
3. a CMA or pension-clearinghouse implementation package that reproduces the
   relevant data-dictionary rows and declares its source/version.

On recovery, first preserve the original binary under a source-controlled
evidence location, calculate SHA-256, record the source URL/capture timestamp,
then transcribe the entire `TIKUN-190` row and each code-table tab verbatim into
a separate canonical-source extraction.  Do not infer the missing rows now.

## Sources

| Source | Authority | Claim supported |
|---|---:|---|
| [CMA Circular 2020-9-12](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-506/he/regulation_h_2020-9-12.pdf) | 1 — regulator | Holdings Interface structure, attached Excel/XSD model, and official legacy link targets. |
| [CMA Circular 2020-9-3 / regulation-527](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-527/he/regulation_h_2020-9-3.pdf) | 1 — regulator | Independent official publication containing the Holdings Excel/XSD attachment model and filenames. |
| [CMA 2018-9-32 mirror](https://www.chamber.org.il/media/159975/h_2018-9-32.pdf) | 2 — public mirror of regulator document | Historical PDF copy whose embedded links identify the original official workbook and XSD filenames. |
| [Funder CMA-publication rendering](https://www.funder.co.il/article/100347) | 6 — industry mirror | March-2020 official publication text and the historical official target `MivneAchid_DataTransfer_Holdings_0320.xlsx`. |
| [Funder historical uniform-structure publication](https://www.funder.co.il/article/47911) | 6 — industry mirror | Historical Holdings Interface purpose and the fact that the Excel governs product-specific field definitions. |
| [Internet Archive](https://web.archive.org/) | 6 — archive | Exact timemap searches yielded no captures; this is negative retrieval evidence only. |
| [Common Crawl Index](https://index.commoncrawl.org/) | 6 — archive index | Exact-name index searches yielded no captures; this is negative retrieval evidence only. |

## Evidence classification

* **VERIFIED:** names and locations of the primary artifacts; role of the
  official Excel/XSD; outcomes of the recorded retrieval attempts.
* **UNKNOWN:** all dictionary content, including the meaning or values of
  `TIKUN-190` and every requested code table.
* **Not used:** inference from XML observations, consumer “Amendment 190”
  explanations, or any non-official tax/product source.
