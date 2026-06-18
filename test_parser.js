// --- המנוע הגנרי ---
function parseSeniorityDate(t) {
    const cleanText = t.replace(/\s+/g, ' ');
    
    // אלו המילים הנקיות והתקינות, בלי שיבושים
    const possibleLabels = [
        "ותק הכספים לעניין מס הכנסה",
        "וותק הכספים לעניין מס הכנסה"
    ];

    const regexParts = [];
    for (const label of possibleLabels) {
        // מכינים את הביטוי הרגולרי בצורה שלא תלויה בכיווניות
        const normal = label.split(' ').join('\\s+');
        const reversed = label.split('').reverse().join('').split(' ').join('\\s+');
        regexParts.push(normal, reversed);
    }

    const combinedPattern = regexParts.join('|');
    const pattern = new RegExp("(?:" + combinedPattern + ").{0,250}?(\\d{1,2}[./]\\d{1,2}[./]\\d{4})");
    const m = cleanText.match(pattern);

    if (!m) return null;
    return m[1];
}

// --- אזור הבדיקה (כאן נבדוק את הדוחות שלך) ---
const testData = "כאן מופיע טקסט מהדוח, למשל: ותק הכספים לעניין מס הכנסה 14/05/1993 והנה המשך הטקסט.";

console.log("--- מתחיל בדיקה ---");
const result = parseSeniorityDate(testData);

if (result) {
    console.log("✅ הצלחה! נמצא תאריך:", result);
} else {
    console.log("❌ לא נמצא תאריך. אולי הטקסט בבדיקה לא תואם?");
}