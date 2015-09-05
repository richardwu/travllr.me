$(function(){
	$('.location-input').each(function(){
		var input = $(this).get(0);
		var options = {
		types: ['(cities)']
		};
		var autocomplete = new google.maps.places.Autocomplete(input, options);
	});
});