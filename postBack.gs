/**
 * Post Backを受け取った際の処理
 */
function postBack(e) {
  // 受け取った情報を整理する。（[datetimepicker,目的地,経度,緯度]）
  let data = e.postback.data.split(",");

  let replayText = "✅登録しました！\n";
  if (data[0] == "datetimepicker") {

    let targetDay = e.postback.params['date'];

    // スプレッドシートに書き込むための引数。最初の文字を削除し、最後に目的日を追加する。（[入力された地名,経度,緯度,目的日]）
    let wSSArg = data.slice(1,data.length);
    wSSArg.push(targetDay);

    // スプレッドシートに書き込む
    writeSpreadSheet(wSSArg);

    let today = new Date();
    let targetDayForComp = new Date(targetDay + " 00:00:00");
    let dayDiff = (Math.floor((targetDayForComp - today)/1000));

    // 日付の差が8日以上大きい場合はまだ予報が出ていないためreturn。
    if (dayDiff >= 691200) {
      replayText = replayText + targetDay.replace(/-/g,"/")　+ "の"  + data[1] + 
        "の天気予報はまだ発表されていませんので、もうしばらくお待ちください☀️☁️☂️"
    } else {
      // 天気予報を取得するための引数を作成（[経度,緯度,目的日]）
      let gWArg = [data[2],data[3],targetDay];

      // 天気予報を取得
      let weatherInfo = getWeather(gWArg);
      
      // 取得した情報から処理を決める。
      switch(weatherInfo[0]) {
        
        // エラーの場合
        case 9:
          replayText = "⚠️エラーが発生しました。\nしばらくお待ちいただくか、管理者にお尋ねください。\n" + weatherInfo[1];
          break;
        
        // まだ予報が出ていない場合
        case 1:
          replayText = replayText + targetDay.replace(/-/g,"/")　+ "の" + data[1] + 
            "の天気予報はまだ発表されていませんので、もうしばらくお待ちください☀️☁️☂️"
          break;

        // 正常な場合
        case 0:
          // アイコンを設定する。
          let icon = "";
          switch (weatherInfo[2]) {
            case "01d" : icon = "☀️"; 
              break;
            case "02d" : icon = "🌤";
              break;
            case "03d" : icon = "☁️";
              break;
            case "04d" : icon = "☁️";
              break;
            case "09d" : icon = "☂️";
              break;
            case "10d" : icon = "☔️";
              break;
            case "11d" : icon = "⛈";
              break;
            case "13d" : icon = "☃️";
              break;
            case "50d" : icon = "🌫";
              break;
          }

          replayText = replayText + targetDay.replace(/-/g,"/")　+ "の" + data[1] +"の予報は、" + weatherInfo[1] + icon
            + "、最高気温は" + weatherInfo[3] + "℃、最低気温は" + weatherInfo[4] + "℃です✨";
          break;
      }　
    }
  };

  let payload = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "text",
      "text": replayText
    }]
  };

  return payload;
}