$().ready(() => {
	let $activeLink = $('.header-links__a_open');

	if (window.matchMedia('(min-width: 1024px)').matches) {
		// Custom scrollbar from jquery slimscroll plugin
		$('.scrollable-area').slimScroll({
			'height': '100%'
		});

		let $cardOpen = $($activeLink.attr('href'));

		// Open appropriate card after click on .nav-link
		$('.nav-link').click((e) => {
			let href = $(e.target).closest('.nav-link').attr('href');
			let $card = $(href);

			$cardOpen.toggleClass('inner-card_open');
			$card.toggleClass('inner-card_open');

			$cardOpen = $card;

			return false;
		});
	} else if (window.matchMedia('(max-width: 1023px)').matches) {
		// Custom scrollbar for modal window from jquery slimscroll plugin
		$('.modal-window .scrollable-area').slimScroll({
			'height': '100%'
		});

		// Scroll to appropriate card taking into account .nav-menu height
		$('.nav-link').click((e) => {
			let headerHeight = $('#main-card').offset().top;
			let href = $(e.target).closest('.nav-link').attr('href');
			let $card = $(href);
			let cardY = $card.offset().top - headerHeight;

			window.scroll(0, cardY);
		});
	}

	if (window.matchMedia('(max-width: 560px)').matches) {
		// Header is fixed. We need to change its width directly
		let rootWidth = $('.root').width();

		$('.header').width(rootWidth);

		// Change two-columns divs to one-column
		$.each($('.col-2'), (i, col) => {
			$(col).removeClass('col-2');
			$(col).addClass('col-1');
		});
	}

	// Make appropriate tab active
	$('.nav-link').click((e) => {
		let href = $(e.target).closest('.nav-link').attr('href');
		let $link = $('.header-links').find(`.header-links__a[href='${href}']`);

		$activeLink.toggleClass('header-links__a_open');
		$link.toggleClass('header-links__a_open');

		$activeLink = $link;

		return false;
	});

	// Open modal window
	$('.popup').click((e) => {
		if (!e.target.closest('.popup')) return;

		let modal = $(e.target.closest('.popup')).attr('href');

		$(modal).css('visibility', 'visible');

		return false;
	});

	// Close modal window
	$('.modal-close').click((e) => {
		$(e.target.closest('.modal')).css('visibility', 'hidden');
	});
	
	// Form validation from jquery validate plugin
	$('#contact-form').validate({
		messages: {
			name: '',
			email: '',
			message: ''
		}
	});

	// Submit form
	$('.contact-form__send').click((e) => {
		let $form = $(e.target).closest('.contact-form');
		
		if ($form.valid()) {
			let data = $form.serializeArray()
			let sdata = {}

			// Serialize form data to necessary format
			$.each(data, (i, field) => {
				Object.assign(sdata, { [field.name]: field.value });
			});

			sdata = JSON.stringify(sdata);

			$.ajax({
				url: $form.attr('action'),
				type: $form.attr('method'),
				contentType: 'application/json',
				data: sdata,
				success: (data) => {
					$form[0].reset();
					$form.append(`<p class="contact-form__response contact-form__response_success">
						Сообщение успешно отправлено!</p>`)
				},
				error: (errors) => {
					console.log(errors);
					$form.append(`<p class="contact-form__response contact-form__response_error">
						Не удалось отправить сообщение!</p>`)
				},
				complete: () => {
					setTimeout(() => {
						$form.find('.contact-form__response').remove();
					}, 5000);
				}
			});
		}
	});
});