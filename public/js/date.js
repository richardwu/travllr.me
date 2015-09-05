$(function(){
    $( "#start" ).datepicker({
        minDate: "+1D",
        onSelect: function(selectedDate){
            $( "#end" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $( "#end" ).datepicker({
        minDate: "+2D"
    });
});