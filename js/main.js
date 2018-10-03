// Свой scrollbar из плагина jquery slimscroll
$(function() {
	$('.scrollable-area').slimScroll({
		'height': '100%'
	});
});

let cardOpen = $('#about-card');

// Открыть нужную вкладку по клику на header
$('.header-links').on('click', (e) => {
	console.log(e.target);
	if (!e.target.closest('.link')) return;

	let card = $(e.target.closest('.link')).attr('href');

	cardOpen.css('visibility', 'hidden');
	$(card).css('visibility', 'visible');

	cardOpen = $(card);

	return false;
});