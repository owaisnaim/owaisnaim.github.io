(function($) {
  "use strict";

  // Mobile menu toggle
  $(".mobile-nav-toggle").click(function(e) {
    e.preventDefault();
    $(".nav-links").toggleClass("active");
    $(this).find("i").toggleClass("fa-bars fa-times");
  });

  $(".nav-links a").click(function() {
    $(".nav-links").removeClass("active");
    $(".mobile-nav-toggle i").removeClass("fa-times").addClass("fa-bars");
  });

  // Fast GPU-accelerated smooth scroll
  $('a[href*="#"]:not([href="#"])').click(function(e) {
    var targetId = this.hash;
    if (targetId && $(targetId).length) {
      e.preventDefault();
      var target = $(targetId);
      var navHeight = $('.site-nav').outerHeight() || 70;
      var targetPosition = target.offset().top - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    }
  });

  // Scroll listener with requestAnimationFrame
  var isScrolling = false;
  $(window).scroll(function() {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        var scrollDistance = $(window).scrollTop();
        
        if (scrollDistance > 30) {
          $('.site-nav').addClass('scrolled');
        } else {
          $('.site-nav').removeClass('scrolled');
        }

        if (scrollDistance > 350) {
          $('.scroll-top-btn').css('display', 'inline-flex');
        } else {
          $('.scroll-top-btn').fadeOut();
        }

        // Active nav state
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

  $('.scroll-top-btn').click(function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Interactive Terminal Tab Switcher (Without Layout Shifts)
  window.switchTerminalTab = function(tabName) {
    $('.terminal-tab-btn').removeClass('active');
    $('.terminal-code').removeClass('active');
    
    $('[data-tab="' + tabName + '"]').addClass('active');
    $('#tab-' + tabName).addClass('active');
  };

  $('.terminal-tab-btn').click(function(e) {
    e.preventDefault();
    var tab = $(this).attr('data-tab');
    switchTerminalTab(tab);
  });

  // Command Palette Logic
  window.openCommandPalette = function() {
    $('#cmd-palette').addClass('open');
    $('#cmd-search-input').val('').focus();
    filterCommands('');
  };

  window.closeCommandPalette = function() {
    $('#cmd-palette').removeClass('open');
  };

  // Keyboard Shortcuts: Cmd+K / Ctrl+K / Escape
  $(document).keydown(function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if ($('#cmd-palette').hasClass('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
    }
  });

  // Close when clicking outside dialog
  $('#cmd-palette').click(function(e) {
    if ($(e.target).is('#cmd-palette')) {
      closeCommandPalette();
    }
  });

  // Command search filter
  function filterCommands(query) {
    query = query.toLowerCase().trim();
    $('.cmd-item').each(function() {
      var text = $(this).text().toLowerCase();
      if (!query || text.indexOf(query) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  $('#cmd-search-input').on('input', function() {
    filterCommands($(this).val());
  });

  // Command item execution
  window.runCommandAction = function(action, target) {
    closeCommandPalette();
    if (action === 'navigate') {
      var el = $(target);
      if (el.length) {
        var navHeight = $('.site-nav').outerHeight() || 70;
        window.scrollTo({ top: el.offset().top - navHeight, behavior: 'smooth' });
      }
    } else if (action === 'copy-email') {
      copyEmailToClipboard('owaisnaim9@gmail.com');
    } else if (action === 'open-url') {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else if (action === 'email') {
      window.location.href = target;
    }
  };

  // Animated Stat Counters
  function initStatCounters() {
    var counters = document.querySelectorAll('.metric-num[data-target]');
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
            var duration = 1400;
            var startTime = null;

            function updateCounter(currentTime) {
              if (!startTime) startTime = currentTime;
              var progress = Math.min((currentTime - startTime) / duration, 1);
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
    }, { threshold: 0.2 });

    var metricsSection = document.querySelector('#metrics');
    if (metricsSection) {
      observer.observe(metricsSection);
    }
  }

  // Copy Email Helper
  window.copyEmailToClipboard = function(email) {
    if (!email) email = 'owaisnaim9@gmail.com';
    navigator.clipboard.writeText(email).then(function() {
      showToast('Copied to clipboard: ' + email);
    }).catch(function() {
      var temp = $('<input>');
      $('body').append(temp);
      temp.val(email).select();
      document.execCommand('copy');
      temp.remove();
      showToast('Copied to clipboard: ' + email);
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

  $(document).ready(function() {
    initStatCounters();
  });

})(jQuery);
