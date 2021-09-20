const OPEN_WEATHER_API_KEY = PropertiesService.getScriptProperties().getProperty("OPEN_WEATHER_API_KEY");

/**
 * 軽度緯度から天気予報を取得する。
 * 引数 : 対象の地点の軽度緯度情報と目的の日付までの日数。[経度,緯度,目的日]
 * 戻り値 : 気象予報情報。 
 *  正常：[0,天気,アイコンID,最高気温,最低気温,湿度]
 *  正常（7日以上先の目的日の場合）：[1,7日前になるまでお待ちください。]
 *  異常：[9,エラーメッセージ]
 * 
 * 天気アイコンIDの詳細は以下を参照。
 * https://openweathermap.org/weather-conditions#How-to-get-icon-URL
 */
function getWeather(info) {
  // 引数の整理
  let lon = info[0]; // 経度
  let lat = info[1]; // 緯度
  let targetDay = changeJSTToUnixTime(info[2]); // 目的日をUTCのUNIXTIMEに変換する。

  try {
    // 引数をもとにURLを作成する。
    let url = "https://api.openweathermap.org/data/2.5/onecall?exclude=current,minutely,hourly&lang=ja&units=metic&appid="
      + OPEN_WEATHER_API_KEY + "&lon=" + lon + "&lat=" + lat;  

    // URLからフェッチし、JSONデータに変換
    let response = UrlFetchApp.fetch(url);
    let jsonData = JSON.parse(response.getContentText());
    
    // 目的日
    let targetDailyDate = "";

    // 目的日からJSONのどのデータを参照するかを調べる。
    for (let i = 0; i < jsonData.daily.length; i++) {
      if (jsonData.daily[i].dt > targetDay) {
        targetDailyDate = i;
        break;
      }
    }

    // 目的日が7日以上先の場合は返却する。（エラーコードは1）
    if (targetDailyDate.length == 0) {
      return [1,"7日前になるまでお待ちください。"];
    }

    // 必要なデータを取得していく。
    // 天気とアイコン
    let weather = jsonData.daily[targetDailyDate].weather[0].description;
    let icon = jsonData.daily[targetDailyDate].weather[0].icon;
    // 最高・最低気温
    let maxTemp = Math.floor(jsonData.daily[targetDailyDate].temp.max - 273.15);
    let minTemp = Math.floor(jsonData.daily[targetDailyDate].temp.min - 273.15);
    // 湿度
    let humidity = jsonData.daily[targetDailyDate].humidity;

    // 返却する。（エラーコードは0）
    return [0,weather,icon,maxTemp,minTemp,humidity];

    } catch (e) {
        // エラーメッセージを返却する。(エラーコードは9)
        return [9,"【error】 [" + new Date() +  "] " + e];
    }
}

/**
 * JST日付からUNIX時間を返却する。
 * 引数：JSTで示された日付のみのデータ。
 * 戻り値：引数の日付の00:00:00.000のUNIX時間(UTC) 単位は秒
 */
function changeJSTToUnixTime(jst) {
  // そのままnewDate()すると勝手に9時になってしまうため、00:00:00.000を予め付与する。
  let target = new Date(jst + " 00:00:00");
  // 返却したい値はJSTの0時なので最後にJSTとUTCとの時差である9時間を引いている。
  return Math.floor(Date.parse(Utilities.formatDate(target, 'GMT', 'dd MMM yyyy HH:mm:ss z'))/1000)  - 32400;
}