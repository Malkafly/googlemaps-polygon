var map;
var areaPolygon;
var areaselecionada = [];

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
    var field = new google.maps.Polygon({
        paths: [],
        draggable: false,
        editable: true,
        strokeColor: '#ea7718',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#fbbc21',
        fillOpacity: 0.35
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        a = place.formatted_address;
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
        map.setCenter({
            lat: lat,
            lng: long
        });

        document.getElementById('endereco').innerHTML = a;
        document.getElementById('latlng').innerHTML = lat + "," + long;
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        polygonOptions: {
            editable: true
        },
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
        // drawingManager.setOptions({
        //     drawingMode: null,
        //     drawingControlOptions: {
        //         position: google.maps.ControlPosition.TOP_CENTER,
        //         drawingModes: []
        //     }
        // });
        field.setPath(polygon.getPath().getArray());
        polygon.setMap(null);
        polygon = null;
        field.setMap(map);
        getPolygonCoords(field.getPath());
        google.maps.event.addListener(field.getPath(), 'set_at', function (index, obj) {
            // changed point, via map
            getPolygonCoords(field.getPath());
            //console.log("a point has changed");
        });
        google.maps.event.addListener(field.getPath(), 'insert_at', function (index, obj) {
            // new point via map
            getPolygonCoords(field.getPath());
            //console.log("a point has been added");
        });
        google.maps.event.addListener(field.getPath(), "remove_at", function (index, obj) {
            //removed point, via map
            getPolygonCoords(field.getPath());
            //console.log("a point has been removed");
        });

    });

}


function getPolygonCoords(path) {
    var len = path.getLength();
    var htmlStr = "";
    for (var i = 0; i < len; i++) {
        htmlStr += "<tr><td>" + path.getAt(i).lat() + "</td><td>" + path.getAt(i).lng() + "</td></tr>";
    }
    document.getElementById('info').innerHTML = htmlStr;
}