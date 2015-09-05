// Get hotels from hackathon.expedia.com


var myApp = angular.module('choosePage',[]);

myApp.controller('mainController', ['$scope', function($scope) {

      var latitude = $, longitude = $;

      $.ajax({
        url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-05-19,2015-05-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
        method: 'GET',
        dataType: 'json',
        success: function(resp){

          console.log(resp);

          var domFragment = $(document.createDocumentFragment());

          console.log(resp.HotelInfoList.HotelInfo);


        },
        error: function(resp){

        }
      });
}]);
