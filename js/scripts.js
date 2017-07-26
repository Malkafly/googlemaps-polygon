var map;
var areaPolygon;

function initMap() {

    // Map Center -23.5846919 , -46.6746296
    var latlnginicial = new google.maps.LatLng(-23.5846919, -46.6746296);
    // General Options
    var mapOptions = {
        zoom: 18,
        center: latlnginicial,
        mapTypeId: google.maps.MapTypeId.RoadMap
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var searchBox = document.getElementById('searchTextField');
    var autocomplete = new google.maps.places.Autocomplete(searchBox, latlnginicial);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        a = place.formatted_address;
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
        map.setCenter({
            lat: lat,
            lng: long
        });
        setPolygon(lat, long);
        document.getElementById('endereco').innerHTML = a;
        document.getElementById('latlng').innerHTML = lat + "," + long;
    });

    setPolygon(-23.5846919, -46.6746296);

    google.maps.event.addListener(areaPolygon, "dragend", getPolygonCoords);
    google.maps.event.addListener(areaPolygon.getPath(), "insert_at", getPolygonCoords);
    google.maps.event.addListener(areaPolygon.getPath(), "remove_at", getPolygonCoords);
    google.maps.event.addListener(areaPolygon.getPath(), "set_at", getPolygonCoords);
}

function setPolygon(lat, lng) {
    var areaselecionada = [
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(lat, lng)
    ];
    // Styling & Controls
    areaPolygon = new google.maps.Polygon({
        paths: areaselecionada,
        draggable: true,
        editable: true,
        strokeColor: '#ea7718',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#fbbc21',
        fillOpacity: 0.35
    });
    areaPolygon.setMap(null);
    areaPolygon.setMap(map);
}

//Display Coordinates below map
function getPolygonCoords() {
    var len = areaPolygon.getPath().getLength();
    var htmlStr = "";
    for (var i = 0; i < len; i++) {
        console.log(areaPolygon.getPath().getAt(i));
        htmlStr += "<tr><td>" + areaPolygon.getPath().getAt(i).lat() + "</td><td>" + areaPolygon.getPath().getAt(i).lng() + "</td></tr>";
    }
    document.getElementById('info').innerHTML = htmlStr;
}