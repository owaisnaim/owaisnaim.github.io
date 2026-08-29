(function($) {
  "use strict";

  // Mobile menu toggle
  $(".mobile-nav-toggle").click(function(e) {
    e.preventDefault();
    $(".nav-links").toggleClass("active");
    $(this).find("i").toggleClass("fa-bars fa-times");
  });

  // Close mobile nav when clicking a link
  $(".nav-links a").click(function() {
    $(".nav-links").removeClass("active");
    $(".mobile-nav-toggle i").removeClass("fa-times").addClass("fa-bars");
  });

  // Smooth scroll
  $('a[href*="#"]:not([href="#"])').click(function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        e.preventDefault();
        var navHeight = $('.site-nav').outerHeight() || 70;
        $('html, body').animate({
          scrollTop: target.offset().top - navHeight + 10
        }, 800);
        return false;
      }
    }
  });

  // Scroll events
  $(window).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    
    // Navbar styling on scroll
    if (scrollDistance > 40) {
      $('.site-nav').addClass('scrolled');
    } else {
      $('.site-nav').removeClass('scrolled');
    }

    // Scroll to top button
    if (scrollDistance > 300) {
      $('.scroll-to-top').css('display', 'inline-flex');
    } else {
      $('.scroll-to-top').fadeOut();
    }

    // Active link update
    var navHeight = $('.site-nav').outerHeight() || 70;
    $('section[id]').each(function() {
      var top = $(this).offset().top - navHeight - 20;
      var bottom = top + $(this).outerHeight();
      var id = $(this).attr('id');
      if (scrollDistance >= top && scrollDistance < bottom) {
        $('.nav-links a').removeClass('active');
        $('.nav-links a[href="#' + id + '"]').addClass('active');
      }
    });
  });

  // Scroll to top button action
  $('.scroll-to-top').click(function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  // Copy email to clipboard helper
  window.copyEmailToClipboard = function(email) {
    if (!email) email = 'owaisnaim9@gmail.com';
    navigator.clipboard.writeText(email).then(function() {
      showToast('Email copied to clipboard: ' + email);
    }).catch(function() {
      // Fallback
      var temp = $('<input>');
      $('body').append(temp);
      temp.val(email).select();
      document.execCommand('copy');
      temp.remove();
      showToast('Email copied to clipboard: ' + email);
    });
  };

  function showToast(message) {
    var toast = $('#toast-notice');
    toast.find('.toast-msg').text(message);
    toast.addClass('show');
    setTimeout(function() {
      toast.removeClass('show');
    }, 3000);
  }

})(jQuery);
