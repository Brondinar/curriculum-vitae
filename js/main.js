$().ready(() => {
	let $activeLink = $('.header-links__a_open');

	if (window.matchMedia('(min-width: 1024px)').matches) {
		// Свой scrollbar из плагина jquery slimscroll
		$('.scrollable-area').slimScroll({
			'height': '100%'
		});

		let $cardOpen = $($activeLink.attr('href'));

		// Открыть нужную вкладку по клику на header
		$('.nav-link').click((e) => {
			let href = $(e.target).closest('.nav-link').attr('href');
			let $card = $(href);

			$cardOpen.toggleClass('inner-card_open');
			$card.toggleClass('inner-card_open');

			$cardOpen = $card;

			return false;
		});
	} else if (window.matchMedia('(max-width: 1023px)').matches) {
		// Свой scrollbar для модальных окон
		$('.modal-window .scrollable-area').slimScroll({
			'height': '100%'
		});

		// Прокрутка с учетом высоты header
		$('.nav-link').click((e) => {
			let headerHeight = $('#main-card').offset().top;
			let href = $(e.target).closest('.nav-link').attr('href');
			let $card = $(href);
			let cardY = $card.offset().top - headerHeight;

			window.scroll(0, cardY);
		});
	}

	if (window.matchMedia('(max-width: 560px)').matches) {
		$.each($('.col-2'), (i, col) => {
			$(col).removeClass('col-2');
			$(col).addClass('col-1');
		});
	}

	// Сделать активной нажатую ссылку в header
	$('.nav-link').click((e) => {
		let href = $(e.target).closest('.nav-link').attr('href');
		let $link = $('.header-links').find(`.header-links__a[href='${href}']`);

		$activeLink.toggleClass('header-links__a_open');
		$link.toggleClass('header-links__a_open');

		$activeLink = $link;

		return false;
	});

	// Открыть модальное окно при клике на popup
	$('.popup').click((e) => {
		if (!e.target.closest('.popup')) return;

		let modal = $(e.target.closest('.popup')).attr('href');

		$(modal).css('visibility', 'visible');

		return false;
	});

	// Закрыть модальное окно при клике за его пределами
	$('.modal-close').click((e) => {
		$(e.target.closest('.modal')).css('visibility', 'hidden');
	});
	
	// Валидация формы обратной связи
	$('#contact-form').validate({
		messages: {
			name: '',
			email: '',
			message: ''
		}
	});

	// Отправка формы
	$('.contact-form__send').click((e) => {
		let $form = $(e.target).closest('.contact-form');
		if ($form.valid()) {
			let data = $form.serializeArray()
			let sdata = {}

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