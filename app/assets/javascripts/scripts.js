var scripts = {
  'home': function () {
    var homeApp = angular.module('homePage', ['ui.bootstrap']);
    homeApp.controller('mainController', ['$scope', function ($scope) {
      $scope.data = {
        location: {
          start: 'Toronto, Canada',
          end: 'Paris, France'
        },
        date: {
          start: '2015-09-15',
          end: '2015-09-25'
        }
      };

$scope.getNumber = function(num) {
var useless = [];
for(var i = 0; i < Math.ceil(Number(num)); i++) useless.push(i);
return useless;
}
      $scope.divideDays = function(price){
        return Number(price) / moment(new Date($scope.data.date.end)).diff(moment(new Date($scope.data.date.start)), 'days');
      };
      $scope.totalPrice = function(){
        var total = 0;
        if($scope.selectedFlight != -1){
            total += Number($scope.flights[$scope.selectedFlight].saleTotal.substring(3))
        }
        if($scope.selectedHotel != -1){
            total += Number($scope.hotels[$scope.selectedHotel].Price.TotalRate.Value);
        }
        return total;
      }
      $scope.setPage = function(num){
        $scope.page = num;
      }
      $scope.convertDate = function(date){
        return moment(date).format("MMM D @ h:mm A")
      }
      $scope.getCarrier = function(code){
        return $scope.flightData.trips.data.carrierNames[code].name;
      }
      $scope.toggleActivity = function(idx){
        if($scope.selectedActivities.indexOf(idx) != -1){
          $scope.selectedActivities.splice($scope.selectedActivities.indexOf(idx), 1);
        }else{
          $scope.selectedActivities.push(idx);
        }
      }
      $scope.activitySelected = function(idx){
        return $scope.selectedActivities.indexOf(idx) != -1;
      }
      $scope.selectedFlight = -1;
      $scope.flightData = {}, $scope.flights = [], $scope.selectedHotel = -1;
      $scope.hotels = [], $scope.selectedActivities = [];
      $scope.page = 0;
      $scope.loadFlights = function(){
        $scope.page = 2;
        $scope.loaded = false;
        $.get('flights.json', {
          origin: $scope.data.location.start,
          destination: $scope.data.location.end,
          startDate: $scope.data.date.start,
          endDate: $scope.data.date.end
        }, function(data){
          data.trips.data.carrierNames = {};
          for(var i = 0; i < data.trips.data.carrier.length; i++){
            data.trips.data.carrierNames[data.trips.data.carrier[i].code] = data.trips.data.carrier[i];
          }
          $scope.flightData = data;
          $scope.flights = data.trips.tripOption;
          $scope.loaded = true;
          $scope.$apply();
        });
      };
      $scope.loadHotels = function(){
        $scope.page = 3;
        $scope.loaded = false;
        $.get('hotels', {
          origin: $scope.data.location.start,
          destination: $scope.data.location.end,
          startDate: $scope.data.date.start,
          endDate: $scope.data.date.end
        }, function(data){
          $scope.hotels = data.HotelInfoList.HotelInfo;
          $scope.loaded = true;
          $scope.$apply();
        });
      };


      $scope.loadActivities = function(){
        $scope.page = 4;
        $scope.loaded = false;
        $.get('activities', {
          origin: $scope.data.location.start,
          destination: $scope.data.location.end,
          startDate: $scope.data.date.start,
          endDate: $scope.data.date.end
        }, function(data){
          $scope.activities = data.businesses;
          $scope.loaded = true;
          $scope.$apply();
        });
      };

      $scope.loadItinerary = function(){
        $scope.page = 5;
        $scope.loaded = false;

        var pois = [];
        for (i in $scope.selectedActivities){
          pois.push({
            lat: $scope.activities[$scope.selectedActivities[i]].location.coordinate.latitude,
            lon: $scope.activities[$scope.selectedActivities[i]].location.coordinate.longitude,
            id: $scope.activities[$scope.selectedActivities[i]].id
          });
        }

        var hotel = {
          lat: $scope.hotels[$scope.selectedHotel].Location.GeoLocation.Latitude,
          lon: $scope.hotels[$scope.selectedHotel].Location.GeoLocation.Longitude
        };

        $.post('routes', {
          hotel: hotel,
          pois: pois
        }, function(data){
          // Returns array of POI id's in order
          console.log(data);

          $scope.loaded = true;
          $scope.$apply();
        });

      };

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
          $( "#end-calendar" ).datepicker( "option", "minDate", moment(new Date(selectedDate)).add(1, "days").toDate() );

            $( "#end-calendar" ).datepicker( "option", "maxDate", moment(new Date(selectedDate)).add(27, "days").toDate() );
            updateDate();
        }
      });
      $( "#end-calendar" ).datepicker({
        minDate: "+2d",
        maxDate: "+28d",
        onSelect: function( selectedDate ) {
          updateDate();
        }
      });

      // Submit data to /choose

      // $('#submit-button').on('click', function(){

      //   // window.scope.data.location doesnt work because ng-model doesnt register
      //   // the autocomplete!!!!!
      //   // - richard

      //   var inputData = {
      //     origin: $('#origin').val(),
      //     destination: $('#destination').val(),
      //     startDate: window.scope.data.date.start,
      //     endDate: window.scope.data.date.end
      //   };

      //   // Returns JSON of hotels

      //   $.ajax({
      //     url: '/hotels',
      //     method: 'GET',
      //     data: inputData,
      //     dataType: 'json',
      //     success: function(resp){
      //       console.log(resp);
      //     },
      //     error: function(resp){
      //       console.log(resp);
      //     }
      //   });

      //   // Returns JSON of flights
      //   $.ajax({
      //     url: '/flights',
      //     method: 'GET',
      //     data: inputData,
      //     dataType: 'json',
      //     success: function(resp){
      //       console.log(resp);
      //     },
      //     error: function(resp){
      //       console.log(resp);
      //     }
      //   });

      $('#routes').click(function(){
        $.ajax({
          url: '/routes',
          method: 'GET',
          dataType: 'json',
              success: function(resp){
                console.log(resp);
              },
              error: function(resp){
                console.log(resp);
              }
      });
    });


      //   // Returns JSON of activities
      //   $.ajax({
      //     url: '/activities',
      //     method: 'GET',
      //     data: inputData,
      //     dataType: 'json',
      //     success: function(resp){
      //       console.log(resp);
      //     },
      //     error: function(resp){
      //       console.log(resp);
      //     }
      //   });

      // });


      // Function to generate itin
      $('#generate-itin').on('click', function(){
        var hotel;
        var flight;
        // Sorted
        var activities;
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
  $.material.init();
});
