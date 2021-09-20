/**
 * メッセージを受け取った時の処理。
 */
function replyMessage(e) {
  let input_text = e.message.text;
  let replayText = "";

  if (input_text == "確認") {
    regularWork();
  
  } else if (input_text == ">いいえ") {
    replayText = [{
      "type": "text",
      "text": "申し訳ありません😭\n違う言葉を入力してみてください。"
    }];  

  // メッセージの場合、入力された文字から場所を検索し、確認を画面を表示する。
  } else {
    // 入力されたメッセージから場所を検索する。
    let placeInfo = getPlaceInfo(input_text);
    let addr = placeInfo[0]; // 住所
    let lon = placeInfo[1]; // 経度
    let lat = placeInfo[2]; // 緯度
    
    // はいを押された場合のpostbackを作成する。
    let yesResTextStr = "datetimepicker,"+ input_text + "," + lon + "," + lat;
    // はいを押された場合の日付の初期値と最低値（本日）のフォーマットを作成する。
    let todayFormat = Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd");

    // メッセージデータを作成する。
    replayText =  [{
      "type": "template",
      "altText": "select",
      "template": {
        "type": "buttons",
        "title": "この場所で正しいですか？",
        "text": addr,
        "actions": [{
            "type": "datetimepicker",
            "label": "はい（日付の入力へ）",
            "data": yesResTextStr,
            "mode": "date",
            "initial": todayFormat,
            "min": todayFormat
          },
          {
            "type": "message",
            "label": "いいえ",
            "text": ">いいえ"
          }
        ]
      }
    }];
  }

  let payload = {
    "replyToken": e.replyToken,
    "messages": replayText
  };

  return payload;
}