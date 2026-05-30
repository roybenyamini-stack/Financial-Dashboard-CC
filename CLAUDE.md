# Project AI & Coding Rules

- Terminology: Always use the word 'מסלול' (Track) instead of 'סוג' (Type) for investments and pensions.
- UI Consistency: Never use CSS `!important` unless strictly necessary. Empty/null selects should have a yellow background (`_nullBg`).
- Data Layer: The AI extracts raw data. Do not hallucinate. The UI JS handles sanitization and defaults.
- Category strictness: 'קופת גמל להשקעה' is the exact string. Never use 'גמל להשקעה'.

## Project Documentation (SSOT)

For specific module logic, semantic colors, and constraints, you MUST read the respective markdown files in the `docs/` directory BEFORE modifying code (e.g., read `docs/events_module.md` when working on Event Management, `docs/sliders_module.md` when working on Sliders & Macro-Variables, `docs/pension_logic.md` when working on calculations, asset rendering, or graph logic).

## Master Grid UI - CSS & Layout Rules

- **Fixed Layout:** Use `table-layout: fixed; width: 100%;` for the master grid. Never let the browser calculate column widths. All `<th>` elements must have explicit percentage widths summing to exactly 100%.
- **Prevent Wrapping:** All data cells (`<td>`) must use `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` to prevent layout breaking.
- **Bidi Fix:** Group headers that contain mixed Hebrew/numbers inside a `colspan` must wrap their content in `<div dir="rtl" style="display:flex;...">` to prevent RTL parenthesis flipping.
- **Modal Z-Index:** When opening an edit modal over the master grid, use a `setTimeout` of 100ms to force the modal's z-index (e.g., 10600) above the grid, ensuring it renders on top.
- **Provider Cleanup:** The `_mgridCleanProvider` function must strip junk words: `"מור"`, `"אלפא"`, `"בדים"`, `"מבטחים"`, `"השתלמות"`, `"גמל"`, `"פנסיה"`.
- **Asset Type Priority:** The `isBituachMenahalim` flag takes absolute priority when determining the asset type string — check it before any other condition.
