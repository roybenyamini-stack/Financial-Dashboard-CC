# Events Module Specifications

## 1. UI & Layout
- Modal Field Order: Name -> Type (Income/Expense/Investment/Reminder) -> Certainty (Fixed/Simulation) -> Date (Year/Month) -> Amount.
- Certainty Radio Buttons: Use native browser styles (no custom `accent-color`).

## 2. Semantic Color Palette (Data Entry Table & Timeline)
- Income Fixed (הכנסה קבועה): Dark Green (`#2e7d32`)
- Income Temporary (הכנסה זמנית): Medium-Light Green (`#059669`)
- Expense Fixed (הוצאה קבועה): Burgundy (`#7f1d1d`)
- Expense Temporary (הוצאה זמנית): Dark Orange (`#ea580c`)
- Reminder (תזכורת - Always Gray regardless of certainty): Slate Gray (`#94a3b8`)
- Certainty Text "קבוע": Dark Gray (`#475569`)
- Certainty Text "זמני": Light Gray (`#94a3b8`)

## 3. Business Logic & Constraints
- Past Dates: Users cannot enter an event year prior to the current calendar year (`new Date().getFullYear()`).
- Clear Simulations: The "Clear Simulation Events" action MUST only filter out temporary events and explicitly keep fixed events. It must use the custom confirm modal (`ffs-custom-confirm`), not the browser's native confirm.
- Sorting: Events are strictly sorted chronologically (Year, then Month) at the time of saving to `SIM_USER_EVENTS`.
