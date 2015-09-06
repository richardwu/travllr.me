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
      $scope.confirm = function(mes){
        return window.confirm(mes);
      }
      $scope.setPage = function(num){
        $scope.page = num;
        if(num==0) {
          $scope.data.location.start='';
          $scope.data.location.end='';
        }
      }
      $scope.convertDate = function(date){
        if (moment(date).hours() == 0 && moment(date).minutes() == 0 && moment(date).seconds() == 0)
          return moment(date).format('MMM D')
        else 
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

      $scope.updateLocationFields = function(){
        $scope.data.location.start = $('#origin').val();
        $scope.data.location.end = $('#destination').val();
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
      $scope.loadDistanceMatrix = function(){

      }
      // Returns the estimated length of time, in minutes, needed for the given activity
      $scope.calculateCost = function(act){

      }
      // Returns the "cost" for including an activity based on how long it takes to get there and how long it takes to participate in it
      $scope.calculateCost = function(act1, act2){
        return distance(act1, act2) + calculateCost(act2);
      }

      $scope.groupActivities = function(){
        var startDate = moment(new Date ($scope.data.date.start));
        var endDate = moment(new Date ($scope.data.date.end));

        var currentDate = startDate;
        while (!currentDate.isAfter(endDate)){
          // This can be modified to allow user input
          var startTime = 8;
          var endTime = 22;
          // Special case for first date (start time == arriving flight's arrival time)
          if (currentDate == startDate){
            var departingFlight = $scope.flights[$scope.selectedFlight].slice[0];
            var lastSegment = $(departingFlight.segment).last();

            // Remove timezone to be able to parse hour
            timeStr = lastSegment[0].leg[0].arrivalTime;
            timeStr = timeStr.substring(0, timeStr.length -6);
            // One hour leeway
            startTime = moment(timeStr).hours() + 1;
          }
          // Special case for last date (end time == departing flight's departure time)
          else if (currentDate == endDate){
            var arrivingFlight = $($scope.flights[scope.selectedFlight].slice).last();
            var firstSegment = departingFlight.segment[0];

            // Remove timezone to be able to parse hour
            timeStr = firstSegment.leg[0].departureTime;
            timeStr = timeStr.substring(0, timeStr.length - 6);

            endTime = moment(timeStr).hours();
          }

          // Increment currentDate by 1 day
          currentDate.add(1, 'days');

          // GROUP ACTIVITIES INTO DAYS

          // set up constants
          var MAX_LIMIT = 14; // starttime - endtime
          // initialize vars
          var currentAct = 0, totalCost = calculateCost(currentAct),
          includedActivities = [currentAct], cost = [0];

          for (i in selectedActivities){
            // Update cost array
            for (j in selectedActivities) {
              if (cost[j] == undefined || calculateCost(currentAct, j) < cost[j])
                cost[j] = calculateCost(currentAct, j);
            }
            // Choose minimum activity
            var minAct = 0;
            for (j in selectedActivities){
              if (includedActivities.indexOf(j) == -1 && cost[j] < cost[minAct]){
                minAct = j;
              }
            }
            // Set minimum activity to current activity
            includedActivities.push(minAct);
            currentAct = minAct;
            // Check if maximum limit reached
            if(totalCost >= MAX_LIMIT) {
              // Finished grouping a set of activities into one day!



            } // end if
          } // end for loop
        }

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
            index: i
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
          // Returns array of POI index's in order
          console.log(data);

          var orderedActivities = [];

          for(i in data){
            orderedActivities.push($scope.activities[parseInt(data[i])]);
          }
          $scope.itineraries = [];
          $scope.itineraries[0] = orderedActivities;
          $scope.itineraries[1] = orderedActivities;
          $scope.itineraries[2] = orderedActivities;
          $scope.flight = $scope.flights[$scope.selectedFlight];
          $scope.loaded = true;
          $scope.$apply();


          var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          // Initialising google maps for each day

          var hotelMaps = {lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lon)};
          for (i in $scope.itineraries) {
            var map = new google.maps.Map(document.getElementById('itinerary-map-'+(parseInt(i)+1)), {
              zoom: 12,
              center: hotelMaps,
              scrollwheel: false
            });

            for (j in $scope.itineraries[i]){
              var pos = {lat: parseFloat($scope.itineraries[i][j].location.coordinate.latitude), lng: parseFloat($scope.itineraries[i][j].location.coordinate.longitude) };
              console.log(pos);
              var marker = new google.maps.Marker({
                position: pos,
                map: map, 
                title: $scope.itineraries[i][j].name,
                label: labels[j]
              });
            }

            var marker = new google.maps.Marker({
              position: hotelMaps,
              map: map, 
              title: $scope.hotels[$scope.selectedHotel].Name
            });
          }
        });
        //
      };

      window.scope = $scope;
      $('.location-input').each(function(){
        var input = $(this).get(0);
        var options = {
          types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
      });

      $scope.updateDate = function(){
        $scope.data.date = {
          start: moment($('#start-calendar').datepicker('getDate')).format("YYYY-MM-DD"),
          end: moment($('#end-calendar').datepicker('getDate')).format("YYYY-MM-DD")
        };
      };

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
