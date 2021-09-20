// LINE developersのメッセージ送受信設定に記載のアクセストークン
const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN");

// 返信用のURL
const REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const BROADCAST_URL = "https://api.line.me/v2/bot/message/broadcast";

// スプレッドシート情報
const SPREAD_SHEET_ID = PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID");
const SHEET_NAME = PropertiesService.getScriptProperties().getProperty("SHEET_NAME");
const SHEET = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheetByName(SHEET_NAME);

/**
 LINEからのPOST受け取り
 */
function doPost(e) {
  // 受け取ったデータの整理
  let contents = e.postData.contents;
  let obj = JSON.parse(contents);
  let events = obj["events"];

  let payload = "";
  // データのタイプから処理方法を分け、返信用のpayloadを作成する。
  if (events[0].type == "message") {
    payload = replyMessage(events[0]);
  } else if (events[0].type == "postback") {
    payload = postBack(events[0]);
  }
  
  // フェッチ処理
  fetchData([REPLY_URL,payload]);
}