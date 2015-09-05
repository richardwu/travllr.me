var scripts = {
  'home' : function(){

      $('.location-input').each(function(){
        var input = $(this).get(0);
        var options = {
          types: ['(cities)']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);
      });
  },
  'datepick' : function(){

  },
  'choose' : function(){

    var chooseApp = angular.module('choosePage',[]);

    chooseApp.controller('mainController', ['$scope', function($scope) {

          // HOTELS
          // Geocoding
          // Apikey: AIzaSyA7MqyVfVftqD3ICLgFw1RJva350N38mcQ
          /*
          $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+gon.origin+'&key=AIzaSyA7MqyVfVftqD3ICLgFw1RJva350N38mcQ',
            method: 'GET',
            dataType: 'json',
            success: function(resp){

            }
          });
*/

          var latitude = gon.origin, longitude = gon.,
          startDate = $('#start').val(), endDate = $('#end').val();
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates='+startDate+','+endDate+'&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
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

          // FLIGHTS
          // API-KEY: AIzaSyA-kkfsczhpvjAP4IcjVQQ-LwSm8GQ8neo
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
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

          // POINTS OF INTEREST
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
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
    }]);
  }
};
var loaded = false;
function autoload(){
  if(!loaded){
    loaded = true;
    scripts[$('body').attr('id')]();
  }
}
$(function(){
  autoload();
});
