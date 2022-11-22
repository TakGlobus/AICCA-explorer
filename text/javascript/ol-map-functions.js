/*
    Functions
    https://nominatim.openstreetmap.org/search?q=Warszaw&format=json
*/

// Get address from location
function ReverseGeocoding(lon, lat) {
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lon=' + lon + '&lat=' + lat).then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log(json);
        if(json != undefined){
            // document.getElementById('address').innerHTML = json.display_name;
        }
    })
}

// Get location from address
function LocationGeocoding(address) {
    fetch('https://nominatim.openstreetmap.org/search?q=' + address + '&format=json').then(function(response) {
        console.log("Geocoding response :: ", response);
        return response.json();
    }).then(function(json) {
        if(json != undefined){
            // document.getElementById('location').innerHTML = json[0].lat + ' ' + json[0].lon;
            var obj = json[0];
            console.log(obj);
            console.log(obj.lat, obj.lon);
            SetMarker(obj);
        }
    })
}

function getLatLng(e){
    console.log(e.value);
    LocationGeocoding(e.value);
}

function getLatLngClick(e){
    var e = document.getElementById("address");
    console.log(e.value);
    LocationGeocoding(e.value);
}

function PointToLonLat(evt)
{
    var coordinate = ol.proj.toLonLat(evt.coordinate).map(function(val) {
        return val.toFixed(6);
    });
    console.log("document :", document);
    console.log("Coordinates: ", coordinate, evt.coordinate);
    //var lon = document.getElementById('lon').value = coordinate[0];
    //var lat = document.getElementById('lat').value = coordinate[1];
    var lon =  coordinate[0];
    var lat =  coordinate[1];
    console.log("Coordinates Lon Lat: ", lon, lat);
    return coordinate;
}
