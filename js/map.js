let map;
let service;
let markers = [];

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

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    let content = `<div>${marker.title}<br>
            ${marker.position}
        </div>`

    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(content);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}


function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        let largeInfowindow = new google.maps.InfoWindow();
        let bounds = new google.maps.LatLngBounds();

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
                animation: google.maps.Animation.DROP,
                id: i
            });

            markers.push(marker);

            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
            });

            bounds.extend(markers[i].position);
        }

        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);

    }
}
