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

  // Project Category Filter Handler
  $('.filter-btn').click(function() {
    var filterValue = $(this).attr('data-filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filterValue === 'all') {
      $('.project-item').removeClass('hidden').fadeIn(300);
    } else {
      $('.project-item').each(function() {
        var categories = $(this).attr('data-category') || '';
        if (categories.indexOf(filterValue) !== -1) {
          $(this).removeClass('hidden').fadeIn(300);
        } else {
          $(this).addClass('hidden').fadeOut(200);
        }
      });
    }
  });

  // Animated Stat Counters using IntersectionObserver
  function initStatCounters() {
    var counters = document.querySelectorAll('.metric-number[data-target]');
    if (!counters.length) return;

    var animated = false;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(function(counter) {
            var target = parseFloat(counter.getAttribute('data-target'));
            var prefix = counter.getAttribute('data-prefix') || '';
            var suffix = counter.getAttribute('data-suffix') || '';
            var isDecimal = target % 1 !== 0;
            var duration = 1600; // ms
            var startTime = null;

            function updateCounter(currentTime) {
              if (!startTime) startTime = currentTime;
              var progress = Math.min((currentTime - startTime) / duration, 1);
              // Ease out quadratic
              var easeProgress = 1 - (1 - progress) * (1 - progress);
              var currentVal = easeProgress * target;

              if (isDecimal) {
                counter.textContent = prefix + currentVal.toFixed(1) + suffix;
              } else {
                counter.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                if (isDecimal) {
                  counter.textContent = prefix + target.toFixed(1) + suffix;
                } else {
                  counter.textContent = prefix + target.toLocaleString() + suffix;
                }
              }
            }
            requestAnimationFrame(updateCounter);
          });
        }
      });
    }, { threshold: 0.3 });

    var metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
      observer.observe(metricsSection);
    }
  }

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

  // Initialize on load
  $(document).ready(function() {
    initStatCounters();
  });

})(jQuery);
