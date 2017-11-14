var Place = function(data) {
    this.title = ko.observable(data.title);
    this.vicinity = ko.observable(data.vicinity);
}

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

    this.placesArray = ko.observableArray([]);

    places.forEach(function(place) {
        self.placesArray.push(new Place(place));
    });



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
