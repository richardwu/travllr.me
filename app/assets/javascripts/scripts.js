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


      // Submit data to /choose

      $('#submit-button').on('click', function(){

        // window.scope.data.location doesnt work because ng-model doesnt register
        // the autocomplete!!!!!
        // - richard

        var inputData = {
          origin: $('#origin').val(),
          destination: $('#destination').val(),
          startDate: window.scope.data.date.start,
          endDate: window.scope.data.date.end
        };

        // Returns JSON of hotels

        $.ajax({
          url: '/hotels',
          method: 'GET',
          data: inputData,
          dataType: 'json',
          success: function(resp){
            console.log(resp);
          },
          error: function(resp){
            console.log(resp);
          }
        });

        // Returns JSON of flights
        $.ajax({
          url: '/flights',
          method: 'GET',
          data: inputData,
          dataType: 'json',
          success: function(resp){
            console.log(resp);
          },
          error: function(resp){
            console.log(resp);
          }
        });


        // Returns JSON of activities
        $.ajax({
          url: '/activities',
          method: 'GET',
          data: inputData,
          dataType: 'json',
          success: function(resp){
            console.log(resp);
          },
          error: function(resp){
            console.log(resp);
          }
        });

      });


    }]);
  },
  'choose': function() {
    var chooseApp = angular.module('choosePage',[]);
    chooseApp.controller('mainController', ['$scope', function($scope) {
        
      window.scope = $scope;

      var originArr = gon.origin.split(', ');
      var originCity = originArr[0];
      var originCountry = originArr[originArr.length - 1];

      var destinationArr = gon.destination.split(', ');
      var destinationCity = destinationArr[0];
      var destinationCountry = destinationArr[destinationArr.length - 1];



      // ****************************** HOTELS ******************************
     
      // Hotels are retrieved when final next button is clicked (see 'home')




      // ***************************** FLIGHTS ********************************

      // Flights are retrieved when final next button is clicked (see 'home')



      //***************************** POINTS OF INTEREST ***************************

      // API not working.... messaged Expedia!!!!

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
