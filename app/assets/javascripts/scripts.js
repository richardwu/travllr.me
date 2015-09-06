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
      $scope.shouldHide = function(idx){
        return $scope.selectedActivities.length >= $scope.total && !$scope.activitySelected(idx);
      };
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

      $scope.getLimits = function(){
        var startDate = moment($scope.data.date.start);
        var endDate = moment($scope.data.date.end);
        var limit = [], countr = 1;

        var ACTIVITY_DURATION = 2;

        var currentDate = moment(startDate);
        while (!currentDate.isAfter(endDate)){
          // This can be modified to allow user input
          var startTime = 8;
          var endTime = 22;
          // Special case for first date (start time == arriving flight's arrival time)
          if (currentDate.isSame(startDate)){
            console.log("Start date!")
            var arrivingFlight = $scope.flights[$scope.selectedFlight].slice[0];
            var lastSegment = $(arrivingFlight.segment).last();

            // Remove timezone to be able to parse hour
            timeStr = lastSegment[0].leg[0].arrivalTime;
            timeStr = timeStr.substring(0, timeStr.length -6);

            // START TIME IS AN INTEGER REPRESENT THE # OF HOURS

            // One hour leeway for getting off plane
            startTime = moment(timeStr).hours() + 1;

            if(startTime + ACTIVITY_DURATION < 16) {
              limit[0] = startTime; // TRUE
              limit[countr] = parseInt((16 - startTime)/ACTIVITY_DURATION);
              startTime = 16;
              countr++;
            }
            else {
              limit[0] = -1; // FALSE
            }
          }
          // Special case for last date (end time == departing flight's departure time)
          else if (currentDate.isSame(endDate)){
            var departingFlight = $($scope.flights[$scope.selectedFlight].slice).last();
            var firstSegment = departingFlight[0].segment[0];

            // Remove timezone to be able to parse hour
            timeStr = firstSegment.leg[0].departureTime;
            timeStr = timeStr.substring(0, timeStr.length - 6);

            // One hour leeway for getting on flight
            endTime = moment(timeStr).hours() - 1;
            console.log("End date!");
          }else{
            console.log("Normal!");
          }

          limit[countr] = parseInt((endTime - startTime)/ACTIVITY_DURATION);

          // Increment currentDate by 1 day
          currentDate.add(1, 'days');
          countr++;

        } // end while
        return limit;
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
        var limits = $scope.getLimits();
        var tempLimits = limits;
        $scope.total = tempLimits.reduce(function(pv, cv) { return pv + cv; }, 0);
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
            id: parseInt(i)
          });
        }

        var hotel = {
          lat: parseFloat($scope.hotels[$scope.selectedHotel].Location.GeoLocation.Latitude),
          lon: parseFloat($scope.hotels[$scope.selectedHotel].Location.GeoLocation.Longitude)
        };

        var xlimits = $scope.getLimits();
        var tempLimits = $.extend([], xlimits);
        tempLimits.shift();
        $scope.itineraries = [];
        $scope.checkInItinerary = [];
        $scope.checkInTime = null;

        // Known bug: prim algorithm skips first index
        // Shift in hotel coords as first
        pois.splice(0,0, hotel);
        pois[0].id = -1;

        $.post('/clusters',{
          pois: JSON.stringify(pois),
          limits: tempLimits
        }, function(clusters){
          console.log(clusters);

          var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

          for (i in clusters){
            var clusteredPois = clusters[i];

            // Init the init element
            $scope.itineraries[i] = [];

            $.ajax({
              url: 'routes',
              method: 'POST',
              data: {
                hotel: hotel,
                pois: clusteredPois,
                i: i
              },
              dataType: 'json',
              success: function(data){
                // Returns array of POI index's in order
                var ACTIVITY_DURATION = 2;
                var i = data.i;
                var ids = data.ids;
                var times = data.times, startTime;
                if (i == 0 && xlimits[0] != -1) { // first day
                  console.log("Cluster before check-in!");
                  startTime = xlimits[0];
                  $scope.checkInTime = Math.max(startTime, 16);
                  if ($scope.checkInTime >= 12)
                    $scope.checkInTime = ($scope.checkInTime % 12).toString() + ":00 PM";
                  else
                    $scope.checkInTime = $scope.checkInTime.toString() + ":00 AM";
                }
                else {
                  startTime = 8; // 8 am
                }
                console.log("----");
                console.log(startTime);
                console.log(xlimits[0]);
                console.log(xlimits);

                console.log("----");
                for(j in ids){
                  var activity = $scope.activities[parseInt(ids[j])];
                  var graphhoppertime = moment({second: times[j]});
                  var time = moment({hour: graphhoppertime.hours() + ACTIVITY_DURATION*j + startTime, minute: graphhoppertime.minutes(), second: graphhoppertime.seconds()});
                  $scope.itineraries[i].push(activity);
                  $scope.itineraries[i][j]["time"]= time.format("hh:mm A");
                }

                if (i == 0 && xlimits[0] != -1) { // first day
                  console.log("Another first day if statement");
                  $scope.checkInItinerary = $scope.itineraries[0];

                }

                  $scope.loaded = true;
                                $scope.$apply();
                var hotelMaps = {lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lon)};

                var map = new google.maps.Map(document.getElementById('itinerary-map-'+(parseInt(i)+1)), {
                  zoom: 12,
                  center: hotelMaps,
                  scrollwheel: false
                });

                for (j in $scope.itineraries[i]){
                  var pos = {lat: parseFloat($scope.itineraries[i][j].location.coordinate.latitude), lng: parseFloat($scope.itineraries[i][j].location.coordinate.longitude) };
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
                  title: 'HOTEL: ' + $scope.hotels[$scope.selectedHotel].Name
                });

                  $scope.$apply();
              },

              error: function(data){
                console.log('routes posting error');
              }
            });  // End of post to /routes (callback)

            //
          }

          // Initialising google maps for each day

          // var hotelMaps = {lat: parseFloat(hotel.lat), lng: parseFloat(hotel.lon)};
          // for (i in $scope.itineraries) {
          //   var map = new google.maps.Map(document.getElementById('itinerary-map-'+(parseInt(i)+1)), {
          //     zoom: 12,
          //     center: hotelMaps,
          //     scrollwheel: false
          //   });

          //   for (j in $scope.itineraries[i]){
          //     var pos = {lat: parseFloat($scope.itineraries[i][j].location.coordinate.latitude), lng: parseFloat($scope.itineraries[i][j].location.coordinate.longitude) };
          //     console.log(pos);
          //     var marker = new google.maps.Marker({
          //       position: pos,
          //       map: map,
          //       title: $scope.itineraries[i][j].name,
          //       label: labels[j]
          //     });
          //   }

          //   var marker = new google.maps.Marker({
          //     position: hotelMaps,
          //     map: map,
          //     title: $scope.hotels[$scope.selectedHotel].Name
          //   });
          // }

          $scope.flight = $scope.flights[$scope.selectedFlight];
          $scope.$apply();
          //
        }); // End of post to /clusters (callback)
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
$( document ).ajaxError(function() {
  alert("Something happened.");
});
