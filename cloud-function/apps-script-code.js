// ─── PASTE THIS INTO YOUR GOOGLE APPS SCRIPT EDITOR ───────────────────────────
// This script handles COURSE ENROLLMENT rows only.
// For leads, see leads-apps-script.js (separate Sheet + deployment).
// (Extensions → Apps Script → replace Code.gs → Deploy → New Deployment)

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data.courseName || "General Enrollments";
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // ─── Strict match tab name (case-insensitive, whitespace-normalized) ──
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      var allSheets = ss.getSheets();
      var incomingClean = sheetName.replace(/\s+/g, ' ').trim().toLowerCase();
      for (var i = 0; i < allSheets.length; i++) {
        var tabClean = allSheets[i].getName().replace(/\s+/g, ' ').trim().toLowerCase();
        if (tabClean === incomingClean) {
          sheet = allSheets[i];
          break;
        }
      }
    }
    
    // ─── Create tab if still not found ────────────────────────────────
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Date", "Student Name", "Email", "Phone (WhatsApp)",
        "Home State", "Category", "CRL Rank", "Home State Rank",
        "Category Rank", "Course Price", "Payment ID", "Order ID"
      ]);
      sheet.getRange("A1:L1").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // ─── DEDUP: Skip if this paymentId already exists in the sheet ────
    var paymentId = data.paymentId || "";
    if (paymentId && paymentId !== "manual") {
      var allData = sheet.getDataRange().getValues();
      var paymentIdCol = -1;
      
      // Find the "Payment ID" column index from the header row
      if (allData.length > 0) {
        for (var c = 0; c < allData[0].length; c++) {
          if (String(allData[0][c]).toLowerCase().indexOf("payment id") !== -1) {
            paymentIdCol = c;
            break;
          }
        }
      }
      
      // If we found the column, check all rows for a match
      if (paymentIdCol !== -1) {
        for (var r = 1; r < allData.length; r++) {
          if (String(allData[r][paymentIdCol]).trim() === paymentId.trim()) {
            // Duplicate found — skip this row
            return ContentService
              .createTextOutput(JSON.stringify({ status: "skipped", reason: "duplicate paymentId: " + paymentId }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }
    
    // ─── Append the row ──────────────────────────────────────────────
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.phoneNumber,
      data.state,
      data.field,
      data.rank,
      data.homeStateRank,
      data.categoryRank,
      data.pricePaid,
      data.paymentId,
      data.orderId
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
