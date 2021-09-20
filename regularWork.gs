/**
 * 定期作業のためのfunction
 * スプレッドシートに記述されているデータを読み込んで天気予報をLineBotへ流す。
 */
function regularWork() {
  // シートの情報
  const startRow = 2;
  const startCol = 1;
  const endRow = SHEET.getLastRow() - 1;
  const endCol = 4;

  // 対象の範囲を取得する。
  let registList = SHEET.getRange(startRow,startCol,endRow,endCol).getDisplayValues();

  let replayText = "";

  // 天気予報を取得して返信用の文章を作成する。
  for (let i in registList) {

    // 最初の行以外は末尾の文章に改行を挟む
    if (i != 0) {
      replayText = replayText + "\n";
    }

    // 情報の整理
    let place = registList[i][0];
    let lon = registList[i][1];
    let lat = registList[i][2];
    let targetDay = registList[i][3];

    // 8日以上先の天気予報は発表されていないため日付の比較をする。
    let today = new Date();
    let targetDayForComp = new Date(targetDay + " 00:00:00");
    let dayDiff = (Math.floor((targetDayForComp - today)/1000));

    // 日付の差が8日以上大きい場合はまだ予報が出ていないためreturn。
    if (dayDiff >= 691200) {
      replayText = replayText + "ℹ️" + targetDay.replace(/-/g,"/") + "の"　+ place + 
            "の天気予報はまだ発表されていませんので、もうしばらくお待ちください☀️☁️☂️"
    } else {

      // 天気予報を取得する。
      let weatherInfo = getWeather(lon,lat,targetDay);

      // 取得した情報から処理を決める。
      switch(weatherInfo[0]) {
        
        // エラーの場合
        case 9:
          replayText = replayText + "⚠️" + targetDay.replace(/-/g,"/") + "の" + place +　
            "の天気予報は取得の際にエラーが発生しました。\nしばらくお待ちいただくか、管理者にお尋ねください。" + weatherInfo[1];
          break;
        
        // まだ予報が出ていない場合
        case 1:
          replayText = replayText + "ℹ️" + targetDay.replace(/-/g,"/") + "の"　+ place + 
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

          replayText = replayText + "ℹ️" +  targetDay.replace(/-/g,"/")　+ "の" + place +"の予報は、" + weatherInfo[1] + icon
            + "、最高気温は" + weatherInfo[3] + "℃、最低気温は" + weatherInfo[4] + "℃です✨";
          break;
      }
    }
  }

  let payload = {
    "messages": [{
      "type": "text",
      "text": replayText
    }]
  };

  fetchData([BROADCAST_URL,payload]);
}
