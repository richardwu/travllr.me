$(function(){
	$.ajax({
		url: 'http://terminal2.expedia.com/x/hotels?location=47.6063889,-122.3308333&radius=5km&dates=2015-09-19,2015-09-22&apikey=nusNvdQtknZzmD0fHu42OTmv6IrMCAC7',
		method: 'GET',
		dataType: 'json',
		success: function(resp){
			console.log(resp);
		},

		error: function(resp){

		}
	});
});