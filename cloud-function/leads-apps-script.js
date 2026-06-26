// ─── LEADS SHEET — GOOGLE APPS SCRIPT ─────────────────────────────────────────
// This is a SEPARATE deployment from the enrollment sheet.
//
// Setup:
//  1. Create a brand-new Google Sheet (e.g. "Udaan Leads")
//  2. In that sheet → Extensions → Apps Script
//  3. Paste this entire file into Code.gs → Save
//  4. Deploy → New Deployment → Type: Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  5. Copy the deployment URL and set it in Firebase:
//     firebase functions:secrets:set LEADS_SHEETS_WEBHOOK_URL
//     (paste the URL when prompted, then redeploy functions)
// ──────────────────────────────────────────────────────────────────────────────

var SHEET_NAME = "Leads";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet with headers on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      var headers = ["Date & Time (IST)", "Name", "Phone", "Email", "Exam", "Rank", "City", "Lead ID"];
      sheet.appendRow(headers);

      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1a3a6b");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);

      // Set sensible column widths
      sheet.setColumnWidth(1, 160); // Date & Time
      sheet.setColumnWidth(2, 150); // Name
      sheet.setColumnWidth(3, 130); // Phone
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 100); // Exam
      sheet.setColumnWidth(6, 100); // Rank
      sheet.setColumnWidth(7, 120); // City
      sheet.setColumnWidth(8, 220); // Lead ID
    }

    // DEDUP: skip if this leadId already exists (handles Cloud Function retries)
    var leadId = data.leadId || "";
    if (leadId) {
      var allData = sheet.getDataRange().getValues();
      for (var r = 1; r < allData.length; r++) {
        if (String(allData[r][7]).trim() === leadId.trim()) {
          return ContentService
            .createTextOutput(JSON.stringify({ status: "skipped", reason: "duplicate leadId: " + leadId }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Append the new lead row
    sheet.appendRow([
      data.createdAt || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.name  || "",
      data.phone || "",
      data.email || "",
      data.exam  || "",
      data.rank  || "",
      data.city  || "",
      leadId,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Quick test — run this manually from the Apps Script editor to verify the sheet setup
function testSetup() {
  var testPayload = {
    postData: {
      contents: JSON.stringify({
        leadId:    "test-lead-001",
        name:      "Test Student",
        phone:     "9876543210",
        email:     "test@example.com",
        exam:      "NEET",
        rank:      "12345",
        city:      "Delhi",
        createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      })
    }
  };
  var result = doPost(testPayload);
  Logger.log(result.getContent());
}
