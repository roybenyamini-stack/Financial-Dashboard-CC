# Sliders & Macro-Variables Module Specifications

## 1. The "Flexible Boss" Logic
- The "System Settings" (הגדרות מערכת) screen is the "Boss" – it stores the permanent default values in the database for each user.
- The Sliders under the graph serve as a "Sandbox" for What-If scenarios. 
- On initial load, sliders inherit values from System Settings. 
- Moving a slider updates the graph in real-time but does NOT overwrite System Settings unless a "Save as Default" action is triggered.

## 2. Core Macro Sliders (Variables)
- Annual Inflation (אינפלציה): Default 2.5%, Range 0%-6%.
- Pension Yield (תשואת הון פנסיוני): Default 3%, Range 0%-6%.
- Investment Yield (תשואת שוק ההון): Default 4%, Range 1%-10%.
- Real Estate Appreciation (עליית ערך נדל"ן): Default 2.5%, Range 0%-8%.
- Annual Salary Growth (עליית שכר שנתית): To be linked with the "Current Flow" settings.

## 3. Career Milestones (Salary Stations) - Future Implementation
- Logic: Treated as "Fixed" (קבוע) events. They are NOT removed when clearing simulation events.
- UI: Represented as Squares (ריבועים) on the timeline to distinguish them from Diamond (יהלום) events.
- Interaction: Clicking a square on the timeline opens a dedicated "Salary Station" edit modal.
