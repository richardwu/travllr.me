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
          $( "#end-calendar" ).datepicker( "option", "minDate", selectedDate );
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

      var originArr = gon.origin.split(', ');
      var originCity = originArr[0];
      var originCountry = originArr[originArr.length - 1];


      var originCode = "BOS", destinationCode = "LAX";

      var startDate = "2015-09-20";

      var flightData = {
        "request": {
          "passengers": {
            "adultCount": 1
          },
          "slice": [
          {
            "origin": "YYZ",
            "destination": "LAX",
            "date": "2015-09-20"
          },
          {
            "origin": "LAX",
            "destination": "BOS",
            "date": "2015-09-21"
          }
          ]
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
