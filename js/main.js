const getAge = () => {
  const born = new Date(1997, 4, 29);
  const now = new Date();

  return Math.floor((now - born) / (1000 * 60 * 60 * 24 * 365));
};

function handlerLinkClick(e) {
  let orientation = e.data.orientation;
  let $activeLink = $('.header-links__a_open');
  let href = $(e.target).closest('.nav-link').attr('href');
  let $link = $('.header-links').find(`.header-links__a[href='${href}']`);
  let $card = $(href);

  $activeLink.removeClass('header-links__a_open');
  $link.addClass('header-links__a_open');

  if (orientation === 'album') {
      let $cardOpen = $('.inner-card_open');

      $cardOpen.removeClass('inner-card_open');
      $card.addClass('inner-card_open');
  } else if (orientation === 'portrait') {
      let headerHeight = $('#main-card').offset().top;
      let cardY = $card.offset().top - headerHeight;

      window.scroll(0, cardY);
  }

  return false;
}

$().ready(() => {
  // Window resize handler
  $(window).resize(() => {
    $('.nav-link').off('click', handlerLinkClick);
    $('.scrollable-area').slimScroll({ destroy: true });

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('.scrollable-area').slimScroll({
        'height': '100%'
      });

      $('.nav-link').on('click', { orientation: 'album' }, handlerLinkClick);
    } else if (window.matchMedia('(max-width: 1023px)').matches) {
      $('.modal-window .scrollable-area').slimScroll({
        'height': '100%'
      });

      $('.nav-link').on('click', { orientation: 'portrait' }, handlerLinkClick);
    }

    if (window.matchMedia('(max-width: 560px)').matches) {
      // Header is fixed. We need to change its width directly
      let rootWidth = $('.root').width();
      $('.header').width(rootWidth);
    } else {
      $('.header').attr('style', '');
    }
  });

  $(window).trigger('resize');

  $('.age__span').text(getAge());

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
