let map;
let service;
let markers = [];
let largeInfowindow;

// Error handling when Google Maps API fails to load
function mapLoadError() {
    map = document.getElementById('map');
    map.insertAdjacentHTML('beforeend', `<p class="googleMapsFail"><em>Failed to load Google Maps data.</em></p>`);
}

// Callback function to initialize map
function initMap() {
    let amsterdam = new google.maps.LatLng(52.3702, 4.8952);

    map = new google.maps.Map(document.getElementById('map'), {
        center: amsterdam,
        zoom: 13
    });

    // Search for restaurants in Amsterdam
    let request = {
        location: amsterdam,
        radius: '1000',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

// Process nearby search results
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        largeInfowindow = new google.maps.InfoWindow();
        let bounds = new google.maps.LatLngBounds();

        // Create markers for each search result
        for (let i = 0; i < results.length; i++) {
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

            // Create onclick event to open info window at each marker
            marker.addListener('click', function() {
                if (marker.getAnimation() === null) {
                    populateInfoWindow(this, largeInfowindow);
                    toggleBounce(marker);

                // Close info window if same marker is clicked
//                } else {
//                    largeInfowindow.close();
//                    toggleBounce(marker);
//                    largeInfowindow.marker = null;
                }
            });

            // Extend map boundaries for each marker
            bounds.extend(markers[i].position);

        }

        map.fitBounds(bounds);

        // Recenter map and fit all markers when window is resized
        google.maps.event.addDomListener(window, "resize", function() {
            let center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
            map.fitBounds(bounds);
        });

        // Load ViewModel script when all map components are initialized
        let script;
        script = document.createElement('script');
        script.src = 'js/app.js';
        document.head.appendChild(script);
    }
}

// Populate info window when marker is clicked
function populateInfoWindow(marker, infowindow) {

    // Initial info window content
    let content = `<div class="infowindow">
            <h3>${marker.title}</h3><br>
            ${marker.vicinity}<br>
        </div>`;

    // Check if info window is not already opened on this marker
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent(content);

        // Fetch URL to search for restaurant name in Foursquare API
        let url = `https://api.foursquare.com/v2/venues/search?v=20170801&near=Amsterdam&query=${marker.title}&limit=1&client_id=S5A3QSAZPWULTNNOTN2QL0NPX4SG1OR5QRFTATHHPO4GXZEN&client_secret=DU0Z30UIE1PSCVHQT4DSOMGWRZTQKPAXTFBQXY3ZUZYQWFHO`;

        // Check response status and resolve/reject
        function status(response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response);
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        }

        // Parse data
        function json(response) {
            return response.json();
        }

        // Search for restaurant name in Foursquare API
        fetch(url)
            .then(status)
            .then(json)
            .then(function(data) {
                let thisInfoWindow = document.querySelector('.infowindow');
                let checkinsCount = data.response.venues[0].stats.checkinsCount;
                let website = "";

                // Get restaurant URL if available
                if (data.response.venues[0].url) {
                    website = `<br><a class="website" href="${data.response.venues[0].url}" target="_blank">Link to Website</a>`;
                };

                content += `<span>
                    ${checkinsCount} check-ins via <a class="foursquare" href="https://foursquare.com/" target="_blank">Foursquare</a>
                    </span>
                    ${website}`;

                // Append number of check-ins, Foursquare and website link to info window
                infowindow.setContent(content);

                // Add click event listeners to info window links
                if (website) {
                    let websiteLink = document.querySelector(".website");
                    websiteLink.addEventListener('click', function() {
                        window.open(this.href);
                    });
                }

                let foursquareLink = document.querySelector(".foursquare");
                foursquareLink.addEventListener('click', function() {
                    window.open(this.href);
                });
            })

            // Error handling when Foursquare API fails to load
            .catch(function(error) {
                let thisInfoWindow = document.querySelector('.infowindow');
                thisInfoWindow.insertAdjacentHTML('beforeend', `<span><em>Failed to load Foursquare data.<br>${error}</em></span>`);
            });

        // Open info window on map
        infowindow.open(map, marker);

        // Clear marker properties when info window is closed
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
            clearAllAnimations();
            infowindow.marker = null;
        });
    }

    // Close info window and clear animations if user clicks anywhere on map
    google.maps.event.addListener(map, 'click', function() {
        if (largeInfowindow) {
            largeInfowindow.close();
            clearAllAnimations();
            infowindow.marker = null;
        }
    });
}

// Toggle marker bounce animation
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        clearAllAnimations();
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// Clear all marker animations
function clearAllAnimations() {
    markers.forEach(function(marker) {
        marker.setAnimation(null);
    });
}
