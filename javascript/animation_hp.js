

$(".in-search").on('focus', function () {
	$(this).parent('label').addClass('active');
});

$(".in-search").on('blur', function () {
	if($(this).val().length == 0)
		$(this).parent('label').removeClass('active');
});

$(".fotoProfilo").on('click', function () {
	$(".dropdown-menu-user").toggleClass('dropdown-menu-user-show');
});
