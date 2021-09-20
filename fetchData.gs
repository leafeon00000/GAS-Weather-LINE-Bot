/**
 * Reply用のフェッチする処理を行う。
 * 引数：LineBotへ返信するための必要なデータ。
 *      [返信用URL,payload]
 */
function fetchData(arg) {

  let url = arg[0];
  let payload = arg[1];

  let options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ACCESS_TOKEN
    },
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}