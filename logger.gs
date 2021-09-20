function logger(str) {
  const LogSheet = PropertiesService.getScriptProperties().getProperty("LogSheet");
  const Sh = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheetByName(LogSheet);

  Sh.appendRow([new Date(), str]);
}
