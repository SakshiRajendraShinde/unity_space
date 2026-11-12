/* =========================================================
   UNITY SPACE WEBSITE — COMPLETE JAVASCRIPT
   Navbar + Router + Theme + Media + Projects + Team
   Flight Test Responsive Image Viewer
   ========================================================= */

(function() {
    "use strict";

    // =====================================================
    // SECTION 1: SITE SETUP — PAGE SWITCHING AND NAVBAR
    // =====================================================

    var PAGES = [
        'home',
        'media',
        'partners',
        'projects',
        'about',
        'team',
        'flightlog',
        'contact'
    ];

    var mobileMenu = document.getElementById('mp');
    var mobileBtn = document.getElementById('mb');
    var header = document.getElementById('hd');
    var unfold = document.getElementById('unf');
    var ham = document.getElementById('ham');

    // Show one page and hide all others
    function show(page) {
        if (PAGES.indexOf(page) < 0) return;

        document.querySelectorAll('.view').forEach(function(v) {
            v.hidden = v.id !== 'v-' + page;
        });

        if (header) {
            header.classList.toggle('hm', page === 'home');
        }

        document.querySelectorAll(
            '.links a,.mpanel a,.unfl a'
        ).forEach(function(a) {
            a.classList.toggle(
                'on',
                a.getAttribute('href') === '#' + page
            );
        });

        if (mobileMenu) mobileMenu.classList.remove('open');

        if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
        }

        if (unfold) unfold.classList.remove('open');

        if (ham) {
            ham.setAttribute('aria-expanded', 'false');
        }

        window.scrollTo(0, 0);

        if (page === 'media') {
            var activeFilter = document.querySelector('.mf.on');

            if (activeFilter) {
                filterMedia(activeFilter.dataset.f);
            }
        }

        var video = document.getElementById('hv');

        if (video && video.play) {
            if (page === 'home') {
                var p = video.play();

                if (p && p.catch) {
                    p.catch(function() {});
                }
            } else {
                video.pause();
            }
        }

        updateHeader();
    }


    // Handle navbar links and mobile menu
    document.addEventListener('click', function(e) {

        var target = e.target;
        var a = target.closest ?
            target.closest('a[href^="#"]') :
            null;

        if (a) {
            var id = a.getAttribute('href').slice(1);

            if (id === 'top') {
                e.preventDefault();
                window.scrollTo(0, 0);
            } else if (id === 'sponsor-form') {
                e.preventDefault();

                var sponsorForm = document.getElementById('sponsor-form');

                if (sponsorForm) {
                    sponsorForm.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (
                ['chetak', 'delta', 'helix'].indexOf(id) >= 0
            ) {
                e.preventDefault();
                goProject(id);
            } else if (id === 'explore') {
                e.preventDefault();
                goExplore();
            } else if (PAGES.indexOf(id) >= 0) {
                e.preventDefault();
                show(id);
            } else {
                // Leave unrelated hash links to normal browser behaviour
                return;
            }

            return;
        }

        // Mobile hamburger menu
        if (target.closest && target.closest('#mb')) {

            if (!mobileMenu || !mobileBtn) return;

            var open = mobileMenu.classList.toggle('open');

            mobileBtn.setAttribute('aria-expanded', open);

            return;
        }

        // Close mobile menu when clicking outside
        if (
            mobileMenu &&
            !(target.closest && target.closest('#mp'))
        ) {
            mobileMenu.classList.remove('open');

            if (mobileBtn) {
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });


    // Remove images that fail to load in selected sections
    document.addEventListener('error', function(e) {

        var i = e.target;

        if (
            i.tagName === 'IMG' &&
            i.closest('.fi,.gi,.th,.vimg,.abimg,.tp-wide')
        ) {
            i.remove();
        }

    }, true);


    // Helpers for pop-ups
    function imgTag(src, alt) {
        return '<img class="isr" src="' + src +
            '" alt="' + String(alt).replace(/"/g, '&quot;') +
            '" loading="lazy" decoding="async">';
    }

    function esc(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;');
    }


    // =====================================================
    // SECTION 2: NAVBAR — EXPLORE AND HEADER SCROLL
    // =====================================================

    function goExplore() {

        var homePage = document.getElementById('v-home');

        if (homePage && homePage.hidden) {
            show('home');
        }

        setTimeout(function() {

            var explore = document.getElementById('xp');

            if (explore) {
                explore.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

        }, 40);
    }


    function updateHeader() {

        if (!header) return;

        header.classList.toggle(
            'sc',
            window.scrollY > window.innerHeight * 0.6
        );
    }

    window.addEventListener('scroll', updateHeader, {
        passive: true
    });

    updateHeader();


    // Three-line unfolding menu
    if (ham && unfold) {

        ham.addEventListener('click', function() {

            var open = unfold.classList.toggle('open');

            ham.setAttribute('aria-expanded', open);

            ham.setAttribute(
                'aria-label',
                open ? 'Close navigation' : 'Open navigation'
            );

        });

        document.addEventListener('click', function(e) {

            if (!(e.target.closest && e.target.closest('#unf'))) {
                unfold.classList.remove('open');

                ham.setAttribute('aria-expanded', 'false');
            }

        });
    }


    // =====================================================
    // SECTION 3: HERO BACKGROUND VIDEO
    // =====================================================

    (function() {

        var v = document.getElementById('hv');

        if (
            v &&
            window.matchMedia &&
            window.matchMedia(
                '(prefers-reduced-motion:reduce)'
            ).matches
        ) {
            v.removeAttribute('autoplay');
            v.pause();
        }

    })();


    // =====================================================
    // SECTION 4: UPCOMING EVENTS SLIDER
    // =====================================================

    (function() {

        var track = document.getElementById('evTrack');

        var dots = document.querySelectorAll('#evDots button');

        var count = dots.length;
        var current = 0;
        var timer;

        if (!track || !count) return;


        function go(i) {

            current = (i + count) % count;

            track.style.transform =
                'translateX(-' + (current * 100) + '%)';

            dots.forEach(function(d, k) {
                d.classList.toggle('on', k === current);
            });
        }


        function start() {

            clearInterval(timer);

            timer = setInterval(function() {
                go(current + 1);
            }, 2000);
        }


        dots.forEach(function(d, k) {

            d.addEventListener('click', function() {

                go(k);

                clearInterval(timer);

                start();

            });

        });


        if (!window.matchMedia ||
            !window.matchMedia(
                '(prefers-reduced-motion:reduce)'
            ).matches
        ) {
            start();
        }

    })();


    // =====================================================
    // SECTION 5: DAY / NIGHT THEME TOGGLE
    // =====================================================

    var themeButtons = document.querySelectorAll('.tgl');


    function setTheme(dark) {

        document.documentElement.setAttribute(
            'data-theme',
            dark ? 'dark' : 'light'
        );

        themeButtons.forEach(function(b) {

            b.setAttribute('aria-pressed', dark);

            b.setAttribute(
                'aria-label',
                dark ?
                'Switch to light mode' :
                'Switch to dark mode'
            );

        });
    }


    themeButtons.forEach(function(b) {

        b.addEventListener('click', function() {

            setTheme(
                document.documentElement.getAttribute(
                    'data-theme'
                ) !== 'dark'
            );

        });

    });

    // Website opens in dark mode
    setTheme(true);


    // =====================================================
    // SECTION 6: EXPLORE — VIDEO TILES AND VIDEO PLAYER
    // =====================================================

    var videoBox = document.getElementById('vm');
    var videoImg = document.getElementById('vsv');


    function closeVideo() {

        if (!videoBox || !videoImg) return;

        videoBox.hidden = true;

        videoImg.classList.remove('hasv');

        videoImg.innerHTML = '';
    }


    var videoTiles = document.getElementById('vids');

    if (videoTiles) {

        videoTiles.addEventListener('click', function(e) {

            var tile = e.target.closest('.vt');

            if (!tile || !videoBox || !videoImg) return;

            var title = document.getElementById('vtt');

            if (title) {
                title.textContent = tile.dataset.title || '';
            }

            videoImg.classList.add('hasv');

            videoImg.innerHTML =
                '<video src="' + tile.dataset.video +
                '" controls autoplay playsinline preload="auto"></video>';

            videoBox.hidden = false;

            var close = videoBox.querySelector('.mx');

            if (close) close.focus();

        });

    }


    if (videoBox) {

        videoBox.addEventListener('click', function(e) {

            if (
                e.target === videoBox ||
                (e.target.closest && e.target.closest('.mx'))
            ) {
                closeVideo();
            }

        });

    }


    // =====================================================
    // SECTION 7: GALLERY MOSAIC
    // =====================================================

    function mosaic(tiles) {

        var rows = [
            [4, 5, 3],
            [5, 4, 3],
            [3, 5, 4]
        ];

        var i = 0;
        var r = 0;

        while (i < tiles.length) {

            var left = tiles.length - i;

            var row = left >= 3 ?
                rows[r % 3] :
                (left === 2 ? [7, 5] : [12]);

            for (var k = 0; k < row.length; k++) {

                if (tiles[i + k]) {
                    tiles[i + k].style.gridColumn =
                        'span ' + row[k];
                }

            }

            i += row.length;
            r++;
        }
    }


    mosaic(
        [].slice.call(
            document.querySelectorAll('#gal figure')
        )
    );


    // =====================================================
    // SECTION 8: MEDIA — FLIGHT TEST FRAME SLIDER
    // =====================================================

    var frames = document.getElementById('ftt');


    function openFrame(frame) {

        if (!frames || !frame) return;

        frames.querySelectorAll('.fta').forEach(function(item) {

            item.classList.toggle('on', item === frame);

        });
    }


    if (frames) {

        // Remove broken frame images
        frames.querySelectorAll('img').forEach(function(img) {

            img.addEventListener('error', function() {
                img.remove();
            });

        });


        // Laptop hover and keyboard focus
        ['mouseover', 'focusin'].forEach(function(eventName) {

            frames.addEventListener(eventName, function(e) {

                var frame = e.target.closest('.fta');

                if (frame) {
                    openFrame(frame);
                }

            });

        });

    }


    // =====================================================
    // SECTION 9: MEDIA PAGE — FILTERS
    // =====================================================

    var mediaGrid = document.getElementById('mg');


    function filterMedia(category) {

        if (!mediaGrid) return;

        var n = 0;

        mediaGrid.querySelectorAll('.mc').forEach(function(c) {

            var match =
                category === 'all' ||
                c.dataset.c === category;

            if (match) {

                n++;

                c.hidden = false;

                c.classList.remove('outc', 'inc');

                void c.offsetWidth;

                c.style.animationDelay = (n * 60) + 'ms';

                c.classList.add('inc');

            } else {

                c.classList.remove('inc');

                c.classList.add('outc');

                setTimeout(function() {

                    if (c.classList.contains('outc')) {
                        c.hidden = true;
                    }

                }, 300);

            }

        });


        var noResults = document.getElementById('mnr');

        if (noResults) {
            noResults.hidden = n > 0;
        }


        mosaic(
            [].filter.call(
                mediaGrid.querySelectorAll('.mc'),
                function(c) {
                    return (
                        category === 'all' ||
                        c.dataset.c === category
                    );
                }
            )
        );
    }


    var mediaFilterButtons = document.querySelector('.mfb');

    if (mediaFilterButtons) {

        mediaFilterButtons.addEventListener('click', function(e) {

            var b = e.target.closest('.mf');

            if (!b) return;

            document.querySelectorAll('.mf').forEach(function(x) {

                var on = x === b;

                x.classList.toggle('on', on);

                x.setAttribute('aria-selected', on);

            });

            filterMedia(b.dataset.f);

        });

    }


    // =====================================================
    // SECTION 10: PROJECTS — CARDS AND POP-UP
    // =====================================================

    var projectBox = document.getElementById('pl');


    function goProject(id) {

        show('projects');

        setTimeout(function() {

            var project = document.getElementById('p-' + id);

            if (project) {

                project.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }

        }, 40);
    }


    function openProject(card) {

        if (!card || !projectBox) return;

        var d = card.dataset;


        // Project image URLs
        var projectImages = {

            'CHETAK|CHETAK 1': {
                isr: 'assets/flight_chetak-1.png',
                un: ''
            },

            'CHETAK|CHETAK 2': {
                isr: 'assets/chetak-2.png',
                un: ''
            },

            'CHETAK|CHETAK 3': {
                isr: 'assets/chetak-3.png',
                un: ''
            },

            'HELIX|Flight Demonstration': {
                isr: 'assets/chetak-3.png',
                un: ''
            },

            'HELIX|CAD Render': {
                isr: 'assets/rocket_CAD.png',
                un: ''
            }

        };


        var selected =
            projectImages[d.progname + '|' + d.title];


        if (selected) {

            d.isr = selected.isr;

            d.un = selected.un;

        }


        var more = (

                d.focus ?
                '<b>Engineering focus:</b> ' +
                esc(d.focus) +
                '<br><b>Development &amp; testing:</b> ' +
                esc(d.dev) + '<br>' :
                ''

            ) +

            '<b>Program vision:</b> ' +
            esc(d.vision) +

            '<br><b>Program mission:</b> ' +
            esc(d.mission);


        // Video or image pop-up
        var projectImage = document.getElementById('pli');

        if (projectImage) {

            projectImage.innerHTML = d.video

                ?
                '<video src="' + d.video +
                '" controls autoplay playsinline></video>'

            : imgTag(d.isr, d.title) +
                '<img src="' + d.un +
                '" alt="' + d.title.replace(/"/g, '&quot;') +
                '" loading="lazy" decoding="async">';

        }


        var projectGroup = document.getElementById('plg');
        var projectLabel = document.getElementById('plk');
        var projectTitle = document.getElementById('plt');
        var projectDescription = document.getElementById('pld');
        var projectExtra = document.getElementById('ple');


        if (projectGroup) projectGroup.textContent = d.progname || '';
        if (projectLabel) projectLabel.textContent = d.label || '';
        if (projectTitle) projectTitle.textContent = d.title || '';
        if (projectDescription) projectDescription.textContent = d.text || '';
        if (projectExtra) projectExtra.innerHTML = more;


        projectBox.hidden = false;

        var close = projectBox.querySelector('.mx');

        if (close) close.focus();
    }


    function closeProject() {

        if (!projectBox) return;

        projectBox.hidden = true;

        var projectImage = document.getElementById('pli');

        if (projectImage) {
            projectImage.innerHTML = '';
        }
    }


    var projectsPage = document.getElementById('v-projects');

    if (projectsPage) {

        projectsPage.addEventListener('click', function(e) {

            var card = e.target.closest('.pc');

            if (card) {
                openProject(card);
            }

        });


        projectsPage.addEventListener('keydown', function(e) {

            var card = e.target.closest('.pc');

            if (
                card &&
                (e.key === 'Enter' || e.key === ' ')
            ) {

                e.preventDefault();

                openProject(card);

            }

        });

    }


    if (projectBox) {

        projectBox.addEventListener('click', function(e) {

            if (
                e.target === projectBox ||
                (e.target.closest && e.target.closest('.mx'))
            ) {
                closeProject();
            }

        });

    }


    // =====================================================
    // SECTION 11: PARTNERS AND CONTACT — FORMS
    // =====================================================

    document.querySelectorAll('form.cf').forEach(function(form) {

        form.addEventListener('submit', function(e) {

            e.preventDefault();

            var mailElement = document.getElementById('mail');

            var to = mailElement ?
                mailElement.textContent.trim() :
                '';

            var status = form.querySelector('.fs');

            var button = form.querySelector('button');

            var data = {};


            new FormData(form).forEach(function(value, key) {
                data[key] = value;
            });


            if (button) button.disabled = true;

            if (status) status.textContent = 'Sending...';


            fetch(
                'https://formsubmit.co/ajax/' + to, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },

                    body: JSON.stringify(data)
                }
            )

            .then(function(r) {

                if (!r.ok) throw new Error('Message failed');

                form.reset();

                if (status) {
                    status.textContent =
                        'Thank you. Your message has been sent.';
                }

            })

            .catch(function() {

                // Fallback: open the visitor's email application
                if (status) {

                    status.textContent =
                        'Opening your e-mail app so you can send it to ' +
                        to + '...';

                }

                window.location.href =
                    'mailto:' + to +
                    '?subject=' +
                    encodeURIComponent(data._subject || 'Website message') +
                    '&body=' +
                    encodeURIComponent(
                        'Name: ' +
                        (data.first_name || '') +
                        ' ' +
                        (data.last_name || '') +
                        '\nEmail: ' +
                        (data.email || '') +
                        '\n\n' +
                        (data.message || '')
                    );

            })

            .then(function() {

                if (button) button.disabled = false;

            });

        });

    });


    // =====================================================
    // SECTION 12: TEAM PAGE — PHOTO FALLBACK AND FILTERS
    // =====================================================

    var teamGrid = document.getElementById('tg');


    if (teamGrid) {

        // Real photo -> fallback portrait -> initials
        teamGrid.addEventListener('error', function(e) {

            var img = e.target;

            if (img.tagName !== 'IMG') return;

            if (img.dataset.fb && !img.dataset.t) {

                img.dataset.t = 1;

                img.src = img.dataset.fb;

            } else {

                img.remove();

            }

        }, true);

    }


    function filterTeam(dept) {

        if (!teamGrid) return;

        var n = 0;

        teamGrid.querySelectorAll('.tm2').forEach(function(c) {

            var match =
                dept === 'all' ||
                c.dataset.t === dept;

            if (match) {

                n++;

                c.hidden = false;

                c.classList.remove('outc', 'inc');

                void c.offsetWidth;

                c.style.animationDelay = (n * 50) + 'ms';

                c.classList.add('inc');

            } else {

                c.classList.remove('inc');

                c.classList.add('outc');

                setTimeout(function() {

                    if (c.classList.contains('outc')) {
                        c.hidden = true;
                    }

                }, 300);

            }

        });

    }


    var teamFilters = document.querySelector('.tf');

    if (teamFilters) {

        teamFilters.addEventListener('click', function(e) {

            var b = e.target.closest('.tfb');

            if (!b) return;

            document.querySelectorAll('.tfb').forEach(function(x) {

                var on = x === b;

                x.classList.toggle('on', on);

                x.setAttribute('aria-pressed', on);

            });

            filterTeam(b.dataset.t);

        });

    }


    // =====================================================
    // SECTION 13: ESCAPE KEY — CLOSE OPEN POP-UPS
    // =====================================================

    document.addEventListener('keydown', function(e) {

        if (e.key !== 'Escape') return;

        closeVideo();

        closeProject();

        // Close Flight Test viewer if it is open
        closeFlightViewer();

        if (mobileMenu) {
            mobileMenu.classList.remove('open');
        }

        if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
        }

        if (unfold) {
            unfold.classList.remove('open');
        }

        if (ham) {
            ham.setAttribute('aria-expanded', 'false');
        }

    });


    // =====================================================
    // SECTION 14: FLIGHT TEST — RESPONSIVE IMAGE VIEWER
    // Laptop + Tablet + Mobile
    // =====================================================

    var flightViewer = null;

    var flightPreview = null;

    var flightCaption = null;

    var flightCloseButton = null;

    var lastFocusedFrame = null;


    // Create the viewer
    function createFlightViewer() {

        if (flightViewer) return;

        flightViewer = document.createElement('div');

        flightViewer.className = 'flight-image-modal';

        flightViewer.setAttribute('role', 'dialog');

        flightViewer.setAttribute('aria-modal', 'true');

        flightViewer.setAttribute('aria-hidden', 'true');

        flightViewer.setAttribute(
            'aria-label',
            'Flight Test image viewer'
        );


        flightViewer.innerHTML = `
            <button
                class="flight-image-close"
                type="button"
                aria-label="Close image viewer">
                &times;
            </button>

            <img src="" alt="Flight Test frame">

            <p class="flight-image-caption"></p>
        `;


        document.body.appendChild(flightViewer);


        flightPreview = flightViewer.querySelector('img');

        flightCaption =
            flightViewer.querySelector('.flight-image-caption');

        flightCloseButton =
            flightViewer.querySelector('.flight-image-close');


        // Close button
        flightCloseButton.addEventListener(
            'click',
            closeFlightViewer
        );


        // Clicking outside the image closes viewer
        flightViewer.addEventListener('click', function(e) {

            if (e.target === flightViewer) {
                closeFlightViewer();
            }

        });

    }


    // Set active frame
    function activateFlightFrame(frame) {

        if (!frames || !frame) return;

        frames.querySelectorAll('.fta').forEach(function(item) {

            item.classList.toggle('on', item === frame);

        });

    }


    // Open full-size image
    function openFlightViewer(frame) {

        if (!frame) return;

        var image = frame.querySelector('img');

        if (!image) return;

        var imageURL = image.currentSrc || image.src;

        if (!imageURL) return;


        createFlightViewer();


        lastFocusedFrame = frame;


        var title = frame.querySelector('.cap b');

        var description = frame.querySelector('.cap small');

        var number = frame.querySelector('.num');


        flightPreview.src = imageURL;

        flightPreview.alt =
            image.alt || 'Flight Test image';


        flightCaption.textContent = [

            number ? number.textContent.trim() : '',

            title ? title.textContent.trim() : '',

            description ? description.textContent.trim() : ''

        ].filter(Boolean).join(' — ');


        activateFlightFrame(frame);


        flightViewer.classList.add('is-open');

        flightViewer.setAttribute('aria-hidden', 'false');

        document.body.classList.add('image-viewer-open');


        flightCloseButton.focus();

    }


    // Close full-size image
    function closeFlightViewer() {

        if (!flightViewer ||
            !flightViewer.classList.contains('is-open')
        ) {
            return;
        }


        flightViewer.classList.remove('is-open');

        flightViewer.setAttribute('aria-hidden', 'true');

        document.body.classList.remove('image-viewer-open');


        flightPreview.removeAttribute('src');


        if (
            lastFocusedFrame &&
            document.contains(lastFocusedFrame)
        ) {
            lastFocusedFrame.focus();
        }

    }


    // Set up Flight Test frame cards
    function setupFlightFrames() {

        if (!frames) return;


        var frameCards = Array.from(
            frames.querySelectorAll('.fta')
        );


        frameCards.forEach(function(frame, index) {

            // Keyboard accessibility
            frame.setAttribute('tabindex', '0');

            frame.setAttribute('role', 'button');

            frame.setAttribute(
                'aria-label',
                'Open Flight Test frame ' + (index + 1)
            );


            if (index === 0) {
                frame.classList.add('on');
            }


            // Laptop hover expansion
            frame.addEventListener('mouseenter', function() {

                activateFlightFrame(frame);

            });


            // Keyboard focus expansion
            frame.addEventListener('focus', function() {

                activateFlightFrame(frame);

            });


            // Keyboard activation
            frame.addEventListener('keydown', function(e) {

                if (
                    e.key === 'Enter' ||
                    e.key === ' '
                ) {

                    e.preventDefault();

                    openFlightViewer(frame);

                }

            });

        });


        /*
         * Capture click before other frame handlers.
         * This ensures the viewer opens on all devices.
         */
        frames.addEventListener(
            'click',
            function(e) {

                var frame = e.target.closest('.fta');

                if (!frame || !frames.contains(frame)) {
                    return;
                }


                e.preventDefault();

                e.stopPropagation();

                e.stopImmediatePropagation();


                openFlightViewer(frame);

            },
            true
        );

    }


    // Initialize Flight Test frames
    if (frames) {

        setupFlightFrames();

    }


    // Close viewer when browser tab is hidden
    document.addEventListener('visibilitychange', function() {

        if (document.hidden) {
            closeFlightViewer();
        }

    });


    // =====================================================
    // END OF UNITY SPACE JAVASCRIPT
    // =====================================================

})();


/* MOBILE: Automatically fill card accent color on scroll */
document.addEventListener("DOMContentLoaded", () => {
    const mobileView = window.matchMedia(
        "(max-width: 900px), (hover: none)"
    );

    const cardSelectors = [
        "#v-home #gal figure",
        "#v-projects .pg .pc",
        "#v-flightlog .fl .fc"
    ];

    const cards = document.querySelectorAll(cardSelectors.join(","));

    if (!("IntersectionObserver" in window) || !mobileView.matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle(
                "is-scroll-active",
                entry.isIntersecting
            );
        });
    }, {
        threshold: 0.75
    });

    cards.forEach(card => observer.observe(card));
});