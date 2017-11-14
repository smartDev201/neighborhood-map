let map;
let service;
let infowindow;


function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    let amsterdam = new google.maps.LatLng(52.3702, 4.8952);

    map = new google.maps.Map(document.getElementById('map'), {
        center: amsterdam,
        zoom: 13
    });

    var request = {
        location: amsterdam,
        radius: '5000',
        type: ['night_club']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            let lat = results[i].geometry.location.lat();
            let lng = results[i].geometry.location.lng();

            let myLatLng = {
                lat: lat,
                lng: lng
            }

            let marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: results[i].name,
                animation: google.maps.Animation.DROP
            });

            console.log(results[i]);


//            var place = results[i];
//            console.log(place.geometry.location);
//            createMarker(results[i]);
        }
    }
}

//let locations = https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyB1Lc8oG0MSyV4DNqRljDEdK_lWaBzHhEo&location=52.3702,4.8952&radius=30000&keyword=nightlife;
//console.log(locations);

const test = [
  {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
  {name: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {name: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];
