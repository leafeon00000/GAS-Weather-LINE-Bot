/**
 * 軽度緯度と登録地名と目的の日付をスプレッドシートに登録するクラス。
 * 引数:配列の引数。配列は以下の通り。
 *   　　[入力された地名,経度,緯度,目的の日付]
 */
function writeSpreadSheet(info) {
  SHEET.appendRow([info[0], info[1], info[2], info[3], new Date()]);
}
