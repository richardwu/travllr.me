var scripts = {
  'home': function () {
    var homeApp = angular.module('homePage', []);

    homeApp.controller('mainController', ['$scope', function ($scope) {

          $('.location-input').each(function(){
            var input = $(this).get(0);
            var options = {
              types: ['(cities)']
            };
            var autocomplete = new google.maps.places.Autocomplete(input, options);
          });

      /*var latitude = gon.destination[0], longitude = gon.destination[1];
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
          var latitude = gon.origin, longitude = gon.origin,
          startDate = $('#start').val(), endDate = $('#end').val();
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location=' + latitude + ',' + longitude + '&radius=5km&dates=' + startDate + ',' + endDate + '&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
            method: 'GET',
            dataType: 'json',
            success: function (resp) {
              var domFragment = $(document.createDocumentFragment());
              console.log(resp.HotelInfoList.HotelInfo);
              $scope.hotels = resp.HotelInfoList.HotelInfo;
              $scope.$apply();
            },
            error: function (resp) {

            }
          });

          // FLIGHTS
          // API-KEY: AIzaSyA-kkfsczhpvjAP4IcjVQQ-LwSm8GQ8neo
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location=' + latitude + ',' + longitude + '&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
            method: 'GET',
            dataType: 'json',
            success: function (resp) {
              var domFragment = $(document.createDocumentFragment());
              console.log(resp.HotelInfoList.HotelInfo);
              $scope.hotels = resp.HotelInfoList.HotelInfo;
              $scope.$apply();
            },
            error: function (resp) {

            }
          });

          // POINTS OF INTEREST
          $.ajax({
            url: 'http://terminal2.expedia.com/x/hotels?location=' + latitude + ',' + longitude + '&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
            method: 'GET',
            dataType: 'json',
            success: function (resp) {
              var domFragment = $(document.createDocumentFragment());
              console.log(resp.HotelInfoList.HotelInfo);
              $scope.hotels = resp.HotelInfoList.HotelInfo;
              $scope.$apply();
            },
            error: function (resp) {

            }
          });
        }
      });*/
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
