//var Place = function(data) {
//    this.title = ko.observable(data.title);
//    this.vicinity = ko.observable(data.vicinity);
//    this.position = ko.observable(data.position);
//    this.map = ko.observable(data.map);
//    animation: google.maps.Animation.DROP,
//    id: i
//}

var ViewModel = function() {

    let self = this;

    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
    this.openNav = function() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    };

    /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
    this.closeNav = function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    };

    this.showAllResults = function() {

        self.filter("");

        self.markersArray().forEach(function(marker) {
            marker.setVisible(true);
        });
        self.openNav();
        document.getElementById("showAllResults").style.display = "none";
    };

    this.markersArray = ko.observableArray([]);

    markers.forEach(function(place) {
        self.markersArray.push(place);
    });

    this.filter = ko.observable("");

    // Filter the items using the filter text
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


    this.triggerClick = function(marker) {
        google.maps.event.trigger(marker, 'click');
        self.closeNav();
        document.getElementById("showAllResults").style.display = "inherit";
    };


//    this.addPlacesArray = function() {
//        console.log(placesArray());
//    };


//    var self = this;


//    initialCats.forEach(function(catItem) {
//        self.catList.push(new Cat(catItem));
//    });//

//    this.currentCat = ko.observable( this.catList()[0] );//

//    this.incClickCount = function() {
//        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
//    };//

//    this.updateCurrentCat = function() {
//        self.currentCat(this);
//    };

}

ko.applyBindings(new ViewModel());
