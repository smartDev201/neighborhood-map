let map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.3702, lng: 4.8952},
        zoom: 13
    });
}
