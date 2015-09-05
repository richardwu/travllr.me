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

          var latitude = 47.6063889, longitude = -122.3308333;

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
