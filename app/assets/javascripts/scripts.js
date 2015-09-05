var scripts = {
  'home': function () {
    var homeApp = angular.module('homePage', []);
    homeApp.controller('mainController', ['$scope', function ($scope) {
      $scope.data = {
        location: {
          start: '',
          end: ''
        },
        date: {
          start: '',
          end: ''
        }
      };
      $scope.page = 0;
      window.scope = $scope;
      $('.location-input').each(function(){
        var input = $(this).get(0);
        var options = {
          types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
      });
      function updateDate(){
        $scope.data.date = {
          start: $('#start-calendar').datepicker('getDate'),
          end: $('#end-calendar').datepicker('getDate')
        };
      }
      $( "#start-calendar" ).datepicker({
        minDate: "+1d",
        onSelect: function( selectedDate ) {
          $( "#end-calendar" ).datepicker( "option", "minDate", selectedDate );
          updateDate();
        }
      });
      $( "#end-calendar" ).datepicker({
        minDate: "+1d",
        onSelect: function( selectedDate ) {
          updateDate();
        }
      });
    }]);
},
'choose': function() {
  var chooseApp = angular.module('choosePage',[]);
  chooseApp.controller('mainController', ['$scope', function($scope) {

      // HOTELS
      var latitude = gon.destination[0], longitude = gon.destination[1];
      $.ajax({
        url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates='+gon.startdate+','+gon.enddate+'&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
        method: 'GET',
        dataType: 'json',
        success: function(resp){
          var domFragment = $(document.createDocumentFragment());
          console.log(resp.HotelInfoList.HotelInfo);
          $scope.hotels = resp.HotelInfoList.HotelInfo;
          $scope.$apply();
        },
        error: function(resp){
        }
      });

      gon.origin = "Toronto, ON, Canada";
      gon.destination = "Boston, MA, United States";

      var originArr = gon.origin.split(', ');
      var originCity = originArr[0];
      var originCountry = originArr[originArr.length - 1];

      var destinationArr = gon.destination.split(', ');
      var destinationCity = destinationArr[0];
      var destinationCountry = destinationArr[destinationArr.length - 1];

      var originFound = false, destinationFound = false;

      var originCode, destinationCode;


      // Exceptions list
      if (originCity == 'Boston' && originCountry == 'United States'){
        originCode = 'BOS';
        originFound = true;
      }
      if (destinationCity == 'Boston' && destinationCountry == 'United States'){
        destinationCode = 'BOS';
        destinationFound = true;
      }


      // Note: Some cities with only 2 airports (e.g. Boston) dont have a code for 'All Airports',
      // hence they sometimes return the less busy airport

      for (i in gon.airports){
        if (originFound == false && gon.airports[i].city == originCity && gon.airports[i].country == originCountry){
          originCode = gon.airports[i].iata;
          if (gon.airports[i].name == "All Airports")
            originFound = true;
        }
        // TODO: Consider using elseif if origin/destination cannot be the same
        if (destinationFound == false && gon.airports[i].city == destinationCity && gon.airports[i].country == destinationCountry){
          destinationCode = gon.airports[i].iata;
          if (gon.airports[i].name == "All Airports")
            destinationFound = true;
        }

        if (originFound && destinationFound)
          break;
      }

      console.log(originCode + ' ' + destinationCode);

      var flightData = {
        "request": {
          "passengers": {
            "adultCount": 1
          },
          "slice": [
          {
            "origin": originCode,
            "destination": destinationCode,
            "date": gon.startdate
          },
          {
            "origin": destinationCode,
            "destination": originCode,
            "date": gon.enddate
          }
          ],
          "solutions": 10
        }
      };

      $.ajax({
        url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCopWHWwD4ybUyhAumQ20bodU0AuaYM3_c',
        method: 'POST',
        data: JSON.stringify(flightData),
        contentType: 'application/json',
        dataType: 'json',
        success: function(resp){
          console.log(resp);
        },

        error: function(resp){  
          console.log('error loading flights');
        }
      });

      // // FLIGHTS
      // // API-KEY: AIzaSyA-kkfsczhpvjAP4IcjVQQ-LwSm8GQ8neo
      // $.ajax({
      //   url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
      //   method: 'GET',
      //   dataType: 'json',
      //   success: function(resp){
      //     var domFragment = $(document.createDocumentFragment());
      //     console.log(resp.HotelInfoList.HotelInfo);
      //     $scope.hotels = resp.HotelInfoList.HotelInfo;
      //     $scope.$apply();
      //   },
      //   error: function(resp){

      //   }
      // });

      // // POINTS OF INTEREST
      // $.ajax({
      //   url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
      //   method: 'GET',
      //   dataType: 'json',
      //   success: function(resp){
      //     var domFragment = $(document.createDocumentFragment());
      //     console.log(resp.HotelInfoList.HotelInfo);
      //     $scope.hotels = resp.HotelInfoList.HotelInfo;
      //     $scope.$apply();
      //   },
      //   error: function(resp){

      //   }
      // });
}]);
},
'lalal': function () {

}
};
var loaded = false;
function autoload() {
  if (!loaded) {
    loaded = true;
    scripts[$('body').attr('id')]();
  }
}
$(function () {
  autoload();
});
