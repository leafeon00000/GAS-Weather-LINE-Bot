/**
 * 場所情報から軽度緯度を取得するクラス。
 * 引数:検索したい場所
 */
function getPlaceInfo(place) {
  
  var
    geocoder = Maps.newGeocoder(), // Creates a new Geocoder object.
    geocoder = geocoder.setLanguage('ja'),  // Use Japanese
    response = geocoder.geocode(place);

  response = response.results[0];

  let addr = response["formatted_address"] // 郵便番号・住所

  let lng = response["geometry"]["location"]["lng"]; // 経度
  let lat = response["geometry"]["location"]["lat"]; // 緯度
  let placeInfo = [addr, lng, lat];
  
  return placeInfo;
}