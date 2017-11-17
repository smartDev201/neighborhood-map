var ViewModel = function() {

    let self = this;
    self.openbtnIsClicked = ko.observable(false);

    // Open sidebar
    self.openNav = function() {
        self.openbtnIsClicked(true);
//        document.getElementById("mySidenav").style.width = "250px";
//        document.getElementById("main").style.marginLeft = "250px";
    };

    // Close sidebar
    self.closeNav = function() {
        self.openbtnIsClicked(false);
///        document.getElementById("mySidenav").style.width = "0";
//        document.getElementById("main").style.marginLeft = "0";
    };

    self.markersArray = ko.observableArray([]);

    // Push all marker instances to markersArray observable array
    markers.forEach(function(place) {
        self.markersArray.push(place);
    });

    // Show all markers and open sidebar when Show All Results button is clicked
    self.showAllResults = function() {
        self.filter("");

        self.markersArray().forEach(function(marker) {
            marker.setVisible(true);
        });

        self.openNav();

        // Hide Show All Results button
        document.getElementById("showAllResults").style.display = "none";
    };

    self.filter = ko.observable("");

    // Filter list items using the input text, adopted from
    // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    self.markersArrayFiltered = ko.computed(function() {
        let filter = self.filter().toLowerCase();

        // If no input text, make all markers visible & show all list items
        if (!filter) {
            self.markersArray().forEach(function(marker) {
                marker.setVisible(true);
            });

            return self.markersArray();

        // If user types in input field
        } else {

            // First, hide all markers and close info window, if open
            self.markersArrayFiltered().forEach(function(marker) {
                marker.setVisible(false);
            });

            if (largeInfowindow) {
                largeInfowindow.close();
            }

            clearAllAnimations();
            largeInfowindow.marker = null;

            // Show Show All Results button
            document.getElementById("showAllResults").style.display = "inherit";

            // Show only list items that start with the input field text
            let results = ko.utils.arrayFilter(self.markersArray(), function(item) {
                return self.stringStartsWith(item.title.toLowerCase(), filter);
            });

            // Show markers only for filtered results
            results.forEach(function(marker) {
                marker.setVisible(true);
            });

            return results;
        }
    }, ViewModel);

    // Return true if list item starts with input field text
    self.stringStartsWith = function(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    // Trigger marker click when clicking list item in sidebar
    self.triggerClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
        self.closeNav();
        document.getElementById("showAllResults").style.display = "inherit";
    };

};

ko.applyBindings(new ViewModel());
