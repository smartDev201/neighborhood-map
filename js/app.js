var ViewModel = function() {

    let self = this;

    // Open sidebar
    self.openNav = function() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    };

    // Close sidebar
    self.closeNav = function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
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
        document.getElementById("showAllResults").style.display = "none";
    };

    self.filter = ko.observable("");

    // Filter the items using the filter text, adopted from
    // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    self.markersArrayFiltered = ko.computed(function() {
        let filter = self.filter().toLowerCase();
        if (!filter) {
            self.markersArray().forEach(function(marker) {
                marker.setVisible(true);
            });

            return self.markersArray();

        } else {
            self.markersArrayFiltered().forEach(function(marker) {
                marker.setVisible(false);
            });

            if (largeInfowindow) {
                largeInfowindow.close();
            }

            let results = ko.utils.arrayFilter(self.markersArray(), function(item) {
                return self.stringStartsWith(item.title.toLowerCase(), filter);
            });

            results.forEach(function(marker) {
                marker.setVisible(true);
            });

            return results;
        }
    }, ViewModel);

    self.stringStartsWith = function(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };

    self.triggerClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
        self.closeNav();
        document.getElementById("showAllResults").style.display = "inherit";
    };

}

ko.applyBindings(new ViewModel());
