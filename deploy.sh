#!/bin/bash
set -e

REPO_DIR="/Users/roybenyamini/Documents/01 מרכז פיננסי/Financial_Dashboard_CC"
URL="https://github.com/roybenyamini-stack/Financial-Dashboard-CC"

# עבור לתיקיית הפרויקט
cd "$REPO_DIR"

# העלה ל-GitHub
git add .
git commit -m "Update dashboard - $(date '+%d/%m/%Y %H:%M')"
git push origin main

# פתח את הדף ב-GitHub
open "$URL"

echo "✅ הועלה בהצלחה!"
