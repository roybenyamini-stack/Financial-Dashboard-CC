# Project AI & Coding Rules

- Terminology: Always use the word 'מסלול' (Track) instead of 'סוג' (Type) for investments and pensions.
- UI Consistency: Never use CSS `!important` unless strictly necessary. Empty/null selects should have a yellow background (`_nullBg`).
- Data Layer: The AI extracts raw data. Do not hallucinate. The UI JS handles sanitization and defaults.
- Category strictness: 'קופת גמל להשקעה' is the exact string. Never use 'גמל להשקעה'.
