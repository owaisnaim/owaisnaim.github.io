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

  // Fast, responsive smooth scrolling using native browser acceleration
  $('a[href*="#"]:not([href="#"])').click(function(e) {
    var targetId = this.hash;
    if (targetId && $(targetId).length) {
      e.preventDefault();
      var target = $(targetId);
      var navHeight = $('.site-nav').outerHeight() || 70;
      var targetPosition = target.offset().top - navHeight + 5;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  });

  // Optimized scroll handler using requestAnimationFrame
  var isScrolling = false;
  $(window).scroll(function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        var scrollDistance = $(window).scrollTop();
        
        // Navbar blur enhancement on scroll
        if (scrollDistance > 30) {
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

        // Active link indicator
        var navHeight = $('.site-nav').outerHeight() || 70;
        $('section[id]').each(function() {
          var top = $(this).offset().top - navHeight - 30;
          var bottom = top + $(this).outerHeight();
          var id = $(this).attr('id');
          if (scrollDistance >= top && scrollDistance < bottom) {
            $('.nav-links a').removeClass('active');
            $('.nav-links a[href="#' + id + '"]').addClass('active');
          }
        });

        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Scroll to top button action
  $('.scroll-to-top').click(function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Copy email to clipboard helper
  window.copyEmailToClipboard = function(email) {
    if (!email) email = 'owaisnaim9@gmail.com';
    navigator.clipboard.writeText(email).then(function() {
      showToast('Email copied to clipboard: ' + email);
    }).catch(function() {
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
    }, 2500);
  }

})(jQuery);
