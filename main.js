/* ============================================================
   AGENT SITE TEMPLATE — Master JavaScript
   Shared logic for all pages: nav, animations, forms,
   calculators, modals, carousel, and utilities
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     Utility Helpers
     ---------------------------------------- */
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function $$(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  function formatCurrency(num) {
    if (num == null || isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  function formatCurrencyDecimals(num) {
    if (num == null || isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  function formatNumber(num) {
    if (num == null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }

  function parseNumericInput(value) {
    return parseFloat(String(value).replace(/[^0-9.\-]/g, '')) || 0;
  }

  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // Safe text setter — always uses textContent, never innerHTML
  function setText(el, text) {
    if (el) el.textContent = text;
  }

  // Safe DOM element creator
  function createElement(tag, attrs, textContent) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
    }
    if (textContent) el.textContent = textContent;
    return el;
  }


  /* ----------------------------------------
     Navigation — Scroll + Mobile Toggle
     ---------------------------------------- */
  function initNav() {
    var nav = $('.nav');
    var toggle = $('.nav__toggle');
    var mobileMenu = $('.nav__mobile-menu');

    if (!nav) return;

    // Scroll effect
    function onScroll() {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on load

    // Mobile toggle
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close mobile menu on link click
      $$('.nav__mobile-link', mobileMenu).forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Set active link based on current page
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
    $$('.nav__mobile-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }


  /* ----------------------------------------
     Scroll Reveal Animations
     ---------------------------------------- */
  function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Immediately show all elements
      $$('.reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ----------------------------------------
     Animated Number Count-Up
     ---------------------------------------- */
  function initCountUp() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var counters = $$('[data-count-to]');

    if (!counters.length) return;

    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var prefix = el.getAttribute('data-count-prefix') || '';
      var suffix = el.getAttribute('data-count-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
      var duration = prefersReduced ? 0 : 2000;
      var startTime = null;

      if (prefersReduced || duration === 0) {
        el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals) : formatNumber(target)) + suffix;
        return;
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;

        if (decimals > 0) {
          el.textContent = prefix + current.toFixed(decimals) + suffix;
        } else {
          el.textContent = prefix + formatNumber(current) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ----------------------------------------
     Testimonial Carousel
     ---------------------------------------- */
  function initCarousel() {
    var carousel = $('.review-carousel');
    if (!carousel) return;

    var track = $('.review-carousel__track', carousel);
    var slides = $$('.review-carousel__slide', carousel);

    if (!track || slides.length === 0) return;

    // Hide nav controls (dots + buttons) — not needed for continuous scroll
    var nav = $('.review-carousel__nav', carousel);
    if (nav) nav.style.display = 'none';

    // Clone all slides for seamless infinite loop
    var origCount = slides.length;
    for (var i = 0; i < origCount; i++) {
      track.appendChild(slides[i].cloneNode(true));
    }

    var offset = 0;
    var speed = 1.0; // pixels per frame (~60px/s at 60fps)
    var isPaused = false;

    function getOriginalSetWidth() {
      return slides[0].getBoundingClientRect().width * origCount;
    }

    function animate() {
      if (!isPaused) {
        offset += speed;
        var totalWidth = getOriginalSetWidth();
        if (offset >= totalWidth) {
          offset -= totalWidth;
        }
        track.style.transform = 'translateX(' + (-offset) + 'px)';
      }
      requestAnimationFrame(animate);
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', function () { isPaused = true; });
    carousel.addEventListener('mouseleave', function () { isPaused = false; });

    // Pause on touch
    carousel.addEventListener('touchstart', function () { isPaused = true; }, { passive: true });
    carousel.addEventListener('touchend', function () { isPaused = false; }, { passive: true });

    requestAnimationFrame(animate);
  }


  /* ----------------------------------------
     FAQ Accordion
     ---------------------------------------- */
  function initAccordion() {
    $$('.accordion-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.accordion-item');
        var content = item.querySelector('.accordion-content');
        var isOpen = item.classList.contains('open');

        // Close all in same section
        var section = item.closest('.faq-section') || item.parentElement;
        $$('.accordion-item.open', section).forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            var openContent = openItem.querySelector('.accordion-content');
            if (openContent) openContent.style.maxHeight = null;
          }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
        if (!isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    });
  }


  /* ----------------------------------------
     Form Validation
     ---------------------------------------- */
  function initFormValidation() {
    $$('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var isValid = true;

        // Clear previous errors
        $$('.form-group.error', form).forEach(function (group) {
          group.classList.remove('error');
        });

        // Check required fields
        $$('[required]', form).forEach(function (input) {
          var group = input.closest('.form-group');
          if (!group) return;

          var value = input.value.trim();
          var errorEl = group.querySelector('.form-error');

          if (!value) {
            group.classList.add('error');
            if (errorEl) errorEl.textContent = 'This field is required';
            isValid = false;
            return;
          }

          // Email validation
          if (input.type === 'email' && value) {
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
              group.classList.add('error');
              if (errorEl) errorEl.textContent = 'Please enter a valid email address';
              isValid = false;
            }
          }

          // Phone validation (loose)
          if (input.type === 'tel' && value) {
            var digits = value.replace(/\D/g, '');
            if (digits.length < 10) {
              group.classList.add('error');
              if (errorEl) errorEl.textContent = 'Please enter a valid phone number';
              isValid = false;
            }
          }
        });

        if (!isValid) {
          e.preventDefault();
          var firstError = form.querySelector('.form-group.error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        // Prevent actual submission (template — no backend)
        e.preventDefault();

        // Add loading state to submit button
        var submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
        }

        // Simulate submission delay, then show success
        setTimeout(function () {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
          }

          // Replace form with success message using safe DOM methods
          var container = form.parentElement;
          form.style.display = 'none';

          var successDiv = createElement('div', { 'class': 'success-message show' });
          var iconDiv = createElement('div', { 'class': 'success-message__icon' }, '\u2713');
          var titleEl = createElement('h4', { 'class': 'success-message__title' }, 'Message Sent!');
          var textEl = createElement('p', { 'class': 'success-message__text' }, 'Thank you for reaching out. I\'ll get back to you shortly.');

          successDiv.appendChild(iconDiv);
          successDiv.appendChild(titleEl);
          successDiv.appendChild(textEl);
          container.appendChild(successDiv);
        }, 1200);
      });
    });

    // Real-time error clearing on input
    $$('.form-group input, .form-group select, .form-group textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var group = input.closest('.form-group');
        if (group && group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    });
  }


  /* ----------------------------------------
     Floating Contact Button + Mini Form
     ---------------------------------------- */
  function initFloatingCTA() {
    var container = $('.floating-cta');
    if (!container) return;

    var btn = $('.floating-cta__btn', container);
    var form = $('.floating-cta__form', container);
    var closeBtn = $('.floating-cta__form-close', container);

    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      form.classList.toggle('open');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        form.classList.remove('open');
      });
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!container.contains(e.target)) {
        form.classList.remove('open');
      }
    });
  }


  /* ----------------------------------------
     Exit Intent Popup
     ---------------------------------------- */
  function initExitIntent() {
    var overlay = $('#exit-intent-modal');
    if (!overlay) return;

    var closeBtn = $('.modal__close', overlay);
    var hasShown = sessionStorage.getItem('exit_intent_shown');

    if (hasShown) return;

    function showModal() {
      overlay.classList.add('open');
      sessionStorage.setItem('exit_intent_shown', '1');
      document.removeEventListener('mouseout', onMouseOut);
    }

    function closeModal() {
      overlay.classList.remove('open');
    }

    function onMouseOut(e) {
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) {
        showModal();
      }
    }

    // Delay enabling exit intent by 5 seconds
    setTimeout(function () {
      document.addEventListener('mouseout', onMouseOut);
    }, 5000);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeModal();
      }
    });
  }


  /* ----------------------------------------
     Listings Filter
     ---------------------------------------- */
  function initListingsFilter() {
    var filterBar = $('.filter-bar');
    if (!filterBar) return;

    var pills = $$('.filter-pill[data-filter]', filterBar);
    var cards = $$('.listing-card[data-status]');
    var emptyState = $('.empty-state');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        var filter = pill.getAttribute('data-filter');

        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        var visibleCount = 0;
        cards.forEach(function (card) {
          var status = card.getAttribute('data-status');
          var show = filter === 'all' || status === filter;
          card.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? '' : 'none';
        }
      });
    });
  }


  /* ----------------------------------------
     Hero Search Filter (Buy page)
     ---------------------------------------- */
  function initHeroSearch() {
    var bedsSelect = $('#hero-beds');
    var bathsSelect = $('#hero-baths');
    var priceSelect = $('#hero-price');
    if (!bedsSelect || !bathsSelect || !priceSelect) return;

    var browseBtn = document.querySelector('a[href="#listings"].btn');
    if (!browseBtn) return;

    browseBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var minBeds = bedsSelect.value;
      var minBaths = bathsSelect.value;
      var maxPrice = priceSelect.value;

      var cards = $$('.listing-card[data-status]');
      var emptyState = $('.empty-state');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var beds = parseInt(card.getAttribute('data-beds') || '0', 10);
        var baths = parseInt(card.getAttribute('data-baths') || '0', 10);
        var price = parseInt(card.getAttribute('data-price') || '0', 10);

        var show = true;
        if (minBeds !== 'any' && beds < parseInt(minBeds, 10)) show = false;
        if (minBaths !== 'any' && baths < parseInt(minBaths, 10)) show = false;
        if (maxPrice !== 'any' && price > parseInt(maxPrice, 10)) show = false;

        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? '' : 'none';
      }

      document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
    });
  }


  /* ----------------------------------------
     Property Gallery
     ---------------------------------------- */
  function initPropertyGallery() {
    var gallery = $('.property-gallery');
    if (!gallery) return;

    var mainImg = $('img', gallery);
    var thumbs = $$('.property-gallery__thumb', gallery);

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var thumbImg = thumb.querySelector('img');
        var src = thumbImg ? (thumbImg.getAttribute('data-full') || thumbImg.src) : null;
        var alt = thumbImg ? thumbImg.alt : '';
        if (mainImg && src) {
          mainImg.src = src;
          mainImg.alt = alt;
        }
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
      });
    });
  }


  /* ----------------------------------------
     Home Valuation Calculator
     ---------------------------------------- */
  function initValuationTool() {
    var form = $('#valuation-form');
    if (!form) return;

    var steps = $$('.step-form__step', form);
    var progressDots = $$('.step-form__progress-dot');
    var currentStep = 0;

    function showStep(index) {
      steps.forEach(function (step, i) {
        step.classList.toggle('active', i === index);
      });
      progressDots.forEach(function (dot, i) {
        dot.classList.remove('active', 'completed');
        if (i < index) dot.classList.add('completed');
        if (i === index) dot.classList.add('active');
      });
      currentStep = index;
    }

    $$('.step-form__next', form).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
          showStep(currentStep + 1);
        }
      });
    });

    $$('.step-form__prev', form).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentStep > 0) {
          showStep(currentStep - 1);
        }
      });
    });

    // Condition cards
    $$('.condition-card', form).forEach(function (card) {
      card.addEventListener('click', function () {
        $$('.condition-card', card.parentElement).forEach(function (c) {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        var input = card.parentElement.querySelector('input[type="hidden"]');
        if (input) input.value = card.getAttribute('data-value');
      });
    });

    // Email gate submission
    var emailGateForm = $('#email-gate-form');
    if (emailGateForm) {
      emailGateForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameInput = emailGateForm.querySelector('input[name="name"]');
        var emailInput = emailGateForm.querySelector('input[name="email"]');

        if (!nameInput || !emailInput) return;
        if (!nameInput.value.trim() || !emailInput.value.trim()) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) return;

        calculateValuation();
      });
    }

    function calculateValuation() {
      var sqftEl = $('#val-sqft');
      var bedsEl = $('#val-beds');
      var bathsEl = $('#val-baths');
      var yearEl = $('#val-year');

      var sqft = parseNumericInput(sqftEl ? sqftEl.value : '1500');
      var beds = parseInt(bedsEl ? bedsEl.value : '3', 10);
      var baths = parseInt(bathsEl ? bathsEl.value : '2', 10);
      var yearBuilt = parseInt(yearEl ? yearEl.value : '1990', 10);
      var conditionEl = form.querySelector('.condition-card.selected');
      var condition = conditionEl ? conditionEl.getAttribute('data-value') : 'good';

      // Simple formula for lead capture (not a real AVM)
      var basePricePerSqft = 185;
      var conditionMultiplier = {
        excellent: 1.2,
        good: 1.0,
        fair: 0.85,
        'needs-work': 0.7,
      };

      var ageAdjust = Math.max(0.75, 1 - ((new Date().getFullYear() - yearBuilt) * 0.003));
      var bedBathBonus = (beds * 8000) + (baths * 12000);
      var basePrice = sqft * basePricePerSqft * (conditionMultiplier[condition] || 1.0) * ageAdjust + bedBathBonus;
      var lowEstimate = Math.round(basePrice * 0.9 / 1000) * 1000;
      var highEstimate = Math.round(basePrice * 1.1 / 1000) * 1000;

      // Show result
      var emailGate = $('#email-gate');
      var resultPanel = $('#valuation-result');

      if (emailGate) emailGate.style.display = 'none';
      if (resultPanel) {
        resultPanel.style.display = 'block';
        setText($('#result-low', resultPanel), formatCurrency(lowEstimate));
        setText($('#result-high', resultPanel), formatCurrency(highEstimate));
      }
    }

    showStep(0);
  }


  /* ----------------------------------------
     Net Proceeds Calculator
     ---------------------------------------- */
  function initProceedsCalc() {
    var form = $('#proceeds-form');
    if (!form) return;

    var resultPanel = $('#proceeds-result');

    function calculate() {
      var salePrice = parseNumericInput($('#proc-sale-price') ? $('#proc-sale-price').value : '0');
      var mortgageBalance = parseNumericInput($('#proc-mortgage') ? $('#proc-mortgage').value : '0');
      var commissionPct = parseNumericInput($('#proc-commission') ? $('#proc-commission').value : '6') / 100;
      var closingPct = parseNumericInput($('#proc-closing') ? $('#proc-closing').value : '2') / 100;
      var hoaPayoff = parseNumericInput($('#proc-hoa') ? $('#proc-hoa').value : '0');
      var repairs = parseNumericInput($('#proc-repairs') ? $('#proc-repairs').value : '0');

      if (salePrice <= 0) return;

      var commissionAmt = salePrice * commissionPct;
      var closingAmt = salePrice * closingPct;
      var totalDeductions = mortgageBalance + commissionAmt + closingAmt + hoaPayoff + repairs;
      var netProceeds = salePrice - totalDeductions;

      if (resultPanel) {
        resultPanel.style.display = '';
        setText($('#res-sale-price', resultPanel), formatCurrency(salePrice));
        setText($('#res-mortgage', resultPanel), '-' + formatCurrency(mortgageBalance));
        setText($('#res-commission', resultPanel), '-' + formatCurrency(commissionAmt));
        setText($('#res-closing', resultPanel), '-' + formatCurrency(closingAmt));
        setText($('#res-hoa', resultPanel), '-' + formatCurrency(hoaPayoff));
        setText($('#res-repairs', resultPanel), '-' + formatCurrency(repairs));
        setText($('#res-net', resultPanel), formatCurrency(netProceeds));

        var netEl = $('#res-net', resultPanel);
        if (netEl) {
          netEl.style.color = netProceeds >= 0 ? 'var(--status-active)' : 'var(--status-sold)';
        }

        // Update visual bar
        var barProceeds = $('#res-bar-proceeds');
        var barCosts = $('#res-bar-costs');
        var barKeepLabel = barProceeds ? barProceeds.parentElement.nextElementSibling : null;
        if (barProceeds && barCosts && salePrice > 0) {
          var keepPct = Math.max(0, Math.round((netProceeds / salePrice) * 100));
          var costPct = 100 - keepPct;
          barProceeds.style.width = keepPct + '%';
          barCosts.style.width = costPct + '%';
          if (barKeepLabel) {
            var spans = barKeepLabel.querySelectorAll('span');
            if (spans[0]) spans[0].textContent = 'You keep ' + keepPct + '%';
            if (spans[1]) spans[1].textContent = 'Costs ' + costPct + '%';
          }
        }
      }
    }

    $$('input', form).forEach(function (input) {
      input.addEventListener('input', debounce(calculate, 200));
    });

    // Auto-calculate on load with default values
    calculate();
  }


  /* ----------------------------------------
     Mortgage Calculator
     ---------------------------------------- */
  function initMortgageCalc() {
    var form = $('#mortgage-form');
    if (!form) return;

    var resultPanel = $('#mortgage-result');
    var amortToggle = $('#amort-toggle');
    var amortBody = $('#amort-body');
    var amortSection = $('#amort-section');
    var chartCanvas = $('#mortgage-chart');
    var chartInstance = null;

    function calculate() {
      var homePrice = parseNumericInput($('#mort-price') ? $('#mort-price').value : '0');
      var downPaymentVal = parseNumericInput($('#mort-down') ? $('#mort-down').value : '20');
      var downPaymentTypeEl = $('#mort-down-type');
      var downPaymentType = downPaymentTypeEl ? downPaymentTypeEl.value : 'percent';
      var loanTermEl = $('#mort-term');
      var loanTermYears = parseInt(loanTermEl ? loanTermEl.value : '30', 10);
      var interestRate = parseNumericInput($('#mort-rate') ? $('#mort-rate').value : '7') / 100;

      if (homePrice <= 0) return;

      var downPayment = downPaymentType === 'percent' ? homePrice * (downPaymentVal / 100) : downPaymentVal;
      var loanAmount = homePrice - downPayment;
      var monthlyRate = interestRate / 12;
      var totalPayments = loanTermYears * 12;

      var monthlyPI;
      if (monthlyRate === 0) {
        monthlyPI = loanAmount / totalPayments;
      } else {
        monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
          (Math.pow(1 + monthlyRate, totalPayments) - 1);
      }

      var monthlyTax = (homePrice * 0.0125) / 12;
      var monthlyInsurance = (homePrice * 0.004) / 12;
      var totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;

      if (resultPanel) {
        resultPanel.style.display = 'block';
        setText($('#res-total-monthly', resultPanel), formatCurrencyDecimals(totalMonthly));
        setText($('#res-pi', resultPanel), formatCurrencyDecimals(monthlyPI));
        setText($('#res-tax', resultPanel), formatCurrencyDecimals(monthlyTax));
        setText($('#res-insurance', resultPanel), formatCurrencyDecimals(monthlyInsurance));
        setText($('#res-loan-amount', resultPanel), formatCurrency(loanAmount));
      }

      // Donut chart
      if (chartCanvas && typeof Chart !== 'undefined') {
        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(chartCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Principal & Interest', 'Taxes', 'Insurance'],
            datasets: [{
              data: [monthlyPI, monthlyTax, monthlyInsurance],
              backgroundColor: ['#1e3a5f', '#c9a84c', '#64748b'],
              borderWidth: 0,
              hoverOffset: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 16,
                  usePointStyle: true,
                  font: { family: 'DM Sans', size: 13 },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.label + ': ' + formatCurrencyDecimals(context.raw);
                  },
                },
              },
            },
          },
        });
      }

      // Amortization table (built with safe DOM methods)
      if (amortBody) {
        while (amortBody.firstChild) {
          amortBody.removeChild(amortBody.firstChild);
        }

        var balance = loanAmount;
        for (var i = 1; i <= totalPayments; i++) {
          var interestPayment = balance * monthlyRate;
          var principalPayment = monthlyPI - interestPayment;
          balance -= principalPayment;
          if (balance < 0) balance = 0;

          var row = createElement('tr');
          row.appendChild(createElement('td', null, String(i)));
          row.appendChild(createElement('td', null, formatCurrencyDecimals(monthlyPI)));
          row.appendChild(createElement('td', null, formatCurrencyDecimals(principalPayment)));
          row.appendChild(createElement('td', null, formatCurrencyDecimals(interestPayment)));
          row.appendChild(createElement('td', null, formatCurrency(balance)));
          amortBody.appendChild(row);
        }
      }
    }

    $$('input, select', form).forEach(function (input) {
      input.addEventListener('input', debounce(calculate, 200));
      input.addEventListener('change', debounce(calculate, 200));
    });

    // Amortization toggle
    if (amortToggle && amortSection) {
      amortToggle.addEventListener('click', function () {
        var isHidden = amortSection.style.display === 'none' || !amortSection.style.display;
        amortSection.style.display = isHidden ? 'block' : 'none';
        amortToggle.textContent = isHidden ? 'Hide Amortization Schedule' : 'Show Amortization Schedule';
      });
    }

    // Run initial calculation
    calculate();
  }


  /* ----------------------------------------
     Smooth Scroll for Anchor Links
     ---------------------------------------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          var top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }


  /* ----------------------------------------
     Lazy Load Images (fallback)
     ---------------------------------------- */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    var images = $$('img[loading="lazy"]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(function (img) { observer.observe(img); });
  }


  /* ----------------------------------------
     Initialize Everything on DOM Ready
     ---------------------------------------- */
  function init() {
    initNav();
    initScrollReveal();
    initCountUp();
    initCarousel();
    initAccordion();
    initFormValidation();
    initFloatingCTA();
    initExitIntent();
    initListingsFilter();
    initHeroSearch();
    initPropertyGallery();
    initValuationTool();
    initProceedsCalc();
    initMortgageCalc();
    initSmoothScroll();
    initLazyLoad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
