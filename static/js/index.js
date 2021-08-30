(function(){
	$('.shouye').addClass('active');
	$('.test').click(function () {
		alert('!!');
    });
	var $ul = $("#proinfo"), $lis = $ul.find("li");

	$ul.click(function () {
		alert("!!!!");
	});
	$lis.hover(function(){
		if(!$(this).hasClass('nochild')){
			$(this).addClass("prosahover");
			$(this).find(".prosmore").removeClass('hide');
		}},function(){
			if(!$(this).hasClass('nochild')){
				if($(this).hasClass("prosahover")){
					$(this).removeClass("prosahover");
				}
				$(this).find(".prosmore").addClass('hide');
			}
		});
			
})();