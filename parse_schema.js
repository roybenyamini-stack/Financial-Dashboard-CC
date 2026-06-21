'use strict';

// Schema definition for Israeli annual savings-fund (קרן השתלמות / קופת גמל) PDF reports.
// The engine (schema_engine.js) reads this config — it knows nothing about provider names.

const ANNUAL_REPORT_SCHEMA = {
  // Patterns that mark the boundary between two account blocks in a multi-account PDF.
  blockBoundaryPatterns: [
    /מספר\s*חשבון/,
    /מספר\s*פוליסה/,
    /מס[''']\s*חשבון/,
    /מס[''']\s*פוליסה/,
  ],
  maxBlockChars: 4000,

  fields: {
    balance: {
      type: 'firstNumberAbove',
      threshold: 100,
      labels: [
        /יתרת\s*כספים\s*למשיכה([\s\S]{0,100})/i,
        /יתרת\s*כספים([\s\S]{0,100})/i,
        /יתרה\s*לתום\s*תקופת\s*הדיווח([\s\S]{0,100})/i,
        /יתרה\s*כוללת([\s\S]{0,100})/i,
      ],
    },

    reportYear: {
      type: 'captureGroup1AsYear',
      labels: [
        /31[./]12[./](\d{4})/,
        /(?:שנת\s*הדיווח|לשנת)\s*:?\s*(\d{4})/,
      ],
    },

    // Uses a two-pass strategy: account-anchored search first, global label fallback.
    // The engine's 'seniorityDate' extractor handles both passes.
    seniorityDate: {
      type: 'seniorityDate',
      accountAnchor: {
        windowChars: 400,
        keywords: /(?:ותק|וותק|קתו|קתוו)/,
      },
      globalLabels: [
        'ותק הכספים לעניין מס הכנסה',
        'וותק הכספים לעניין מס הכנסה',
      ],
      windowAfter: 250,
    },
  },

  aiExtraction: {
    outputKey: 'tiers',
    model: 'claude-haiku-4-5-20251001',
    maxTokens: 1000,
    temperature: 0,
  },
};

module.exports = { ANNUAL_REPORT_SCHEMA };
