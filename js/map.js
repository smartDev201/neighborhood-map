let map;
let service;
let markers = [];
let largeInfowindow;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    let amsterdam = new google.maps.LatLng(52.3702, 4.8952);

    map = new google.maps.Map(document.getElementById('map'), {
        center: amsterdam,
        zoom: 13
    });

    var request = {
        location: amsterdam,
        radius: '1000',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}


  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.

    fetch(`https://api.foursquare.com/v2/venues/search?v=20170801&near=Amsterdam&query=${marker.title}&limit=1&client_id=S5A3QSAZPWULTNNOTN2QL0NPX4SG1OR5QRFTATHHPO4GXZEN&client_secret=DU0Z30UIE1PSCVHQT4DSOMGWRZTQKPAXTFBQXY3ZUZYQWFHO`).then(function(response) {
        return response.json();
    })
    .then(function(response) {
        let checkinsCount = response.response.venues[0].stats.checkinsCount;
        let thisInfoWindow = document.querySelector('.infowindow');
        thisInfoWindow.insertAdjacentHTML('beforeend', `<span>${checkinsCount} check-ins via <a href="https://foursquare.com/">Foursquare</a></span>`);
        console.log(checkinsCount);
    });

    let content = `<div class="infowindow">
            <h3>${marker.title}</h3><br>
            ${marker.vicinity}<br>
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

        largeInfowindow = new google.maps.InfoWindow();
        let bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < results.length; i++) {
            let lat = results[i].geometry.location.lat();
            let lng = results[i].geometry.location.lng();

            let myLatLng = {
                lat: lat,
                lng: lng
            }

            let title = results[i].name;
            let vicinity = results[i].vicinity;

            let marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: title,
                vicinity: vicinity,
                animation: google.maps.Animation.DROP,
                id: i
            });

            markers.push(marker);

            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                populateInfoWindow(this, largeInfowindow);
                toggleBounce(marker);
            });

            bounds.extend(markers[i].position);

        }

        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
            map.fitBounds(bounds);
        });

        let script;
        script = document.createElement('script');
        script.src = 'js/app.js';
        document.head.appendChild(script);

        google.maps.event.addListener(map, 'click', function() {
            if (largeInfowindow) {
                largeInfowindow.close();

                markers.forEach(function(marker) {
                    marker.setAnimation(null);
                });
            }
        });
    }
}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        markers.forEach(function(marker) {
            marker.setAnimation(null);
        });
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
