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
          start: moment($('#start-calendar').datepicker('getDate')).format("YYYY-MM-DD"),
          end: moment($('#end-calendar').datepicker('getDate')).format("YYYY-MM-DD")
        };
        $scope.$apply();
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
        
        console.log(gon.originCode);
        console.log(gon.destinationCode);
        
      gon.startdate = "2015-09-20";
      gon.enddate = "2015-09-25";





      // ****************************** HOTELS ******************************
      var latitude = gon.destinationCoord[0], longitude = gon.destinationCoord[1];
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
          console.log('error loading hotels');

        }
      });







      // ***************************** FLIGHTS ********************************

      var originArr = gon.origin.split(', ');
      var originCity = originArr[0];
      var originCountry = originArr[originArr.length - 1];

      var destinationArr = gon.destination.split(', ');
      var destinationCity = destinationArr[0];
      var destinationCountry = destinationArr[destinationArr.length - 1];



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





      

      //***************************** POINTS OF INTEREST ***************************


      $.ajax({
        url: 'http://terminal2.expedia.com/x/activities/search?location='+destinationCity+'&startDate='+gon.startdate+'&endDate='+gon.enddate+'&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
        method: 'GET',
        dataType: 'json',
        success: function(resp){
          console.log(resp);
        },
        error: function(resp){
          console.log('error loading activities');
        }
      });






    }]);
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
