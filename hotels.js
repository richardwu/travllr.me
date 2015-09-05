// Get hotels from hackathon.expedia.com

$(function(){

  $('#submit_button').on('click', function(){

    var latitude = $, longitude = $;

    $.ajax({
      url: 'http://terminal2.expedia.com/x/hotels?location='+latitude+','+longitude+'&radius=5km&dates=2015-05-19,2015-05-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
      method: 'GET',
      dataType: 'json',
      success: function(resp){

        console.log(resp);

        var domFragment = $(document.createDocumentFragment());

        for (i in resp.HotelInfoList.HotelInfo) {

          var img = '<img src="'+resp.HotelInfoList.HotelInfo[i].ThumbnailUrl+'">';
          var description = resp.HotelInfoList.HotelInfo[i].Description;
          var rating = resp.HotelInfoList.HotelInfo[i].StarRating;
          domFragment.append('<div class="hotel-result">'+resp.HotelInfoList.HotelInfo[i].Description+'<div>');
        }

        $('#hello').append(domFragment);

      },
      error: function(resp){

      }
    });
  });
});
