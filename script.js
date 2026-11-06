// HOW TO FIND CODE: search this file for "SECTION:" to jump to the script of each part of the website.
// NOTE: all page content (cards, galleries, team, logos...) lives in index.html. This file only adds behaviour.
(function() {

    // ===== SECTION: SITE SETUP: page switching (router) and navbar menus =====
    var PAGES = ['home', 'media', 'partners', 'projects', 'about', 'team', 'flightlog', 'contact'],
        mobileMenu = document.getElementById('mp'),
        mobileBtn = document.getElementById('mb'),
        header = document.getElementById('hd'),
        unfold = document.getElementById('unf'),
        ham = document.getElementById('ham');

    // Show one page (view) and hide the others
    function show(page) {
        if (PAGES.indexOf(page) < 0) return;
        document.querySelectorAll('.view').forEach(function(v) { v.hidden = v.id !== 'v-' + page });
        header.classList.toggle('hm', page === 'home');
        document.querySelectorAll('.links a,.mpanel a,.unfl a').forEach(function(a) { a.classList.toggle('on', a.getAttribute('href') === '#' + page) });
        mobileMenu.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        unfold.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        window.scrollTo(0, 0);
        if (page === 'media') filterMedia(document.querySelector('.mf.on').dataset.f);
        var video = document.getElementById('hv');
        if (video && video.play) { if (page === 'home') { var p = video.play(); if (p && p.catch) p.catch(function() {}) } else video.pause() }
        updateHeader();
    }

    // Every link that starts with "#" is handled here (no page reloads)
    document.addEventListener('click', function(e) {
        var a = e.target.closest('a[href^="#"]');
        if (a) {
            e.preventDefault();
            var id = a.getAttribute('href').slice(1);
            if (id === 'top') window.scrollTo(0, 0);
            else if (id === 'sponsor-form') document.getElementById('sponsor-form').scrollIntoView({ behavior: 'smooth' });
            else if (['chetak', 'delta', 'helix'].indexOf(id) >= 0) goProject(id);
            else if (id === 'explore') goExplore();
            else show(id);
            return;
        }
        if (e.target.closest('#mb')) {
            var open = mobileMenu.classList.toggle('open');
            mobileBtn.setAttribute('aria-expanded', open);
            return
        }
        if (!e.target.closest('#mp')) mobileMenu.classList.remove('open');
    });

    // Images that fail to load are removed, so the gradient behind them shows instead
    document.addEventListener('error', function(e) { var i = e.target; if (i.tagName === 'IMG' && i.closest('.fi,.gi,.th,.vimg,.abimg,.tp-wide')) i.remove() }, true);

    // Small helpers used by the pop-ups
    function imgTag(src, alt) { return '<img class="isr" src="' + src + '" alt="' + String(alt).replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">' }

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') }

    // Escape closes any open pop-up and the mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideo();
            closeProject();
            closeFlight();
            mobileMenu.classList.remove('open')
        }
    });

    // ===== SECTION: FIRST PAGE: unfolding 3-line menu, scroll to Explore, header on scroll =====
    function goExplore() {
        if (document.getElementById('v-home').hidden) show('home');
        setTimeout(function() { document.getElementById('xp').scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 40);
    }

    function updateHeader() { header.classList.toggle('sc', window.scrollY > window.innerHeight * .6) }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
    ham.addEventListener('click', function() {
        var open = unfold.classList.toggle('open');
        ham.setAttribute('aria-expanded', open);
        ham.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#unf')) {
            unfold.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false')
        }
    });

    // ===== SECTION: FIRST PAGE: hero background video =====
    // Visitors who prefer reduced motion get the still poster image instead of the moving video
    (function() {
        var v = document.getElementById('hv');
        if (v && window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) {
            v.removeAttribute('autoplay');
            v.pause()
        }
    })();

    // ===== SECTION: FIRST PAGE: upcoming events slider (changes slide every 2 seconds) =====
    (function() {
        var track = document.getElementById('evTrack'),
            dots = document.querySelectorAll('#evDots button'),
            count = dots.length,
            current = 0,
            timer;

        function go(i) {
            current = (i + count) % count;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function(d, k) { d.classList.toggle('on', k === current) });
        }

        function start() { timer = setInterval(function() { go(current + 1) }, 2000) }
        dots.forEach(function(d, k) {
            d.addEventListener('click', function() {
                go(k);
                clearInterval(timer);
                start()
            })
        });
        // visitors who prefer reduced motion get a still card (they can still use the dots)
        if (!(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches)) start();
    })();

    // ===== SECTION: DAY / NIGHT TOGGLE =====
    var themeButtons = document.querySelectorAll('.tgl');

    function setTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        themeButtons.forEach(function(b) {
            b.setAttribute('aria-pressed', dark);
            b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
        });
    }
    themeButtons.forEach(function(b) { b.addEventListener('click', function() { setTheme(document.documentElement.getAttribute('data-theme') !== 'dark') }) });
    setTheme(true); // the site opens in dark mode

    // ===== SECTION: EXPLORE CONTENT: video tiles and player =====
    var videoBox = document.getElementById('vm'),
        videoImg = document.getElementById('vsv');

    function closeVideo() {
        videoBox.hidden = true;
        videoImg.classList.remove('hasv');
        videoImg.innerHTML = ''
    }
    document.getElementById('vids').addEventListener('click', function(e) {
        var tile = e.target.closest('.vt');
        if (!tile) return;
        document.getElementById('vtt').textContent = tile.dataset.title;
        videoImg.classList.add('hasv');
        videoImg.innerHTML = '<video src="' + tile.dataset.video + '" controls autoplay playsinline preload="auto"></video>';
        videoBox.hidden = false;
        videoBox.querySelector('.mx').focus();
    });
    videoBox.addEventListener('click', function(e) { if (e.target === videoBox || e.target.closest('.mx')) closeVideo() });

    // ===== SECTION: GALLERY MOSAIC (Explore gallery + Media filters) =====
    // Lays tiles out in rows that always add up to 12 columns (3 tiles per row, different widths)
    function mosaic(tiles) {
        var rows = [
                [4, 5, 3],
                [5, 4, 3],
                [3, 5, 4]
            ],
            i = 0,
            r = 0;
        while (i < tiles.length) {
            var left = tiles.length - i,
                row = left >= 3 ? rows[r % 3] : (left === 2 ? [7, 5] : [12]);
            for (var k = 0; k < row.length; k++) tiles[i + k].style.gridColumn = 'span ' + row[k];
            i += row.length;
            r++;
        }
    }
    mosaic([].slice.call(document.querySelectorAll('#gal figure')));



    // ===== SECTION: MEDIA PAGE: UNITY SPACE frames =====
    var frames = document.getElementById('ftt');
    frames.querySelectorAll('img').forEach(function(i) { i.addEventListener('error', function() { i.remove() }) });

    function openFrame(f) { frames.querySelectorAll('.fta').forEach(function(x) { x.classList.toggle('on', x === f) }) }
    ['mouseover', 'focusin'].forEach(function(ev) { frames.addEventListener(ev, function(e) { var f = e.target.closest('.fta'); if (f) openFrame(f) }) });
    frames.addEventListener('click', function(e) {
        var f = e.target.closest('.fta');
        if (f && !f.classList.contains('on')) {
            e.preventDefault();
            openFrame(f)
        }
    });

    // ===== SECTION: MEDIA PAGE: cards and filters =====
    var mediaGrid = document.getElementById('mg');

    function filterMedia(category) {
        var n = 0;
        mediaGrid.querySelectorAll('.mc').forEach(function(c) {
            var match = category === 'all' || c.dataset.c === category;
            if (match) {
                n++;
                c.hidden = false;
                c.classList.remove('outc', 'inc');
                void c.offsetWidth;
                c.style.animationDelay = (n * 60) + 'ms';
                c.classList.add('inc')
            } else {
                c.classList.remove('inc');
                c.classList.add('outc');
                setTimeout(function() { if (c.classList.contains('outc')) c.hidden = true }, 300)
            }
        });
        document.getElementById('mnr').hidden = n > 0;
        mosaic([].filter.call(mediaGrid.querySelectorAll('.mc'), function(c) { return category === 'all' || c.dataset.c === category }));
    }
    document.querySelector('.mfb').addEventListener('click', function(e) {
        var b = e.target.closest('.mf');
        if (!b) return;
        document.querySelectorAll('.mf').forEach(function(x) {
            var on = x === b;
            x.classList.toggle('on', on);
            x.setAttribute('aria-selected', on)
        });
        filterMedia(b.dataset.f);
    });

    // ===== SECTION: PROJECTS PAGE: cards and focus pop-up =====
    var projectBox = document.getElementById('pl');
    // "View project" links jump to that program's block on the Projects page
    function goProject(id) {
        show('projects');
        setTimeout(function() { document.getElementById('p-' + id).scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 40);
    }
    // Card -> focus pop-up (text comes from the card's data-* attributes in index.html)
    function openProject(card) {
        var d = card.dataset;

        // PROJECT IMAGE URLS
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

        var selected = projectImages[d.progname + '|' + d.title];

        if (selected) {
            d.isr = selected.isr;
            d.un = selected.un;
        }

        var more = (d.focus ? '<b>Engineering focus:</b> ' + esc(d.focus) +
                '<br><b>Development &amp; testing:</b> ' + esc(d.dev) + '<br>' : '') +
            '<b>Program vision:</b> ' + esc(d.vision) +
            '<br><b>Program mission:</b> ' + esc(d.mission);
        // a card with a video (data-video) plays it in the pop-up, other cards show their picture
        document.getElementById('pli').innerHTML = d.video ?
            '<video src="' + d.video + '" controls autoplay playsinline></video>' :
            imgTag(d.isr, d.title) + '<img src="' + d.un + '" alt="' + d.title.replace(/"/g, '&quot;') + '" loading="lazy" decoding="async">';
        document.getElementById('plg').textContent = d.progname;
        document.getElementById('plk').textContent = d.label;
        document.getElementById('plt').textContent = d.title;
        document.getElementById('pld').textContent = d.text;
        document.getElementById('ple').innerHTML = more;
        projectBox.hidden = false;
        projectBox.querySelector('.mx').focus();
    }

    function closeProject() {
        projectBox.hidden = true;
        document.getElementById('pli').innerHTML = ''
    }
    document.getElementById('v-projects').addEventListener('click', function(e) { var c = e.target.closest('.pc'); if (c) openProject(c) });
    document.getElementById('v-projects').addEventListener('keydown', function(e) {
        var c = e.target.closest('.pc');
        if (c && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openProject(c)
        }
    });
    projectBox.addEventListener('click', function(e) { if (e.target === projectBox || e.target.closest('.mx')) closeProject() });

    // ===== SECTION: PARTNERS + CONTACT: forms (messages go to the e-mail shown in the footer) =====
    document.querySelectorAll('form.cf').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var to = document.getElementById('mail').textContent.trim(), // the footer e-mail address
                status = form.querySelector('.fs'),
                button = form.querySelector('button'),
                data = {};
            new FormData(form).forEach(function(value, key) { data[key] = value });
            button.disabled = true;
            status.textContent = 'Sending...';
            fetch('https://formsubmit.co/ajax/' + to, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
                .then(function(r) {
                    if (!r.ok) throw 0;
                    form.reset();
                    status.textContent = 'Thank you. Your message has been sent.'
                })
                .catch(function() {
                    // fallback: open the visitor's e-mail app with the message already written
                    status.textContent = 'Opening your e-mail app so you can send it to ' + to + '...';
                    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(data._subject || 'Website message') +
                        '&body=' + encodeURIComponent('Name: ' + data.first_name + ' ' + data.last_name + '\nEmail: ' + data.email + '\n\n' + data.message);
                })
                .then(function() { button.disabled = false });
        });
    });

    // ===== SECTION: TEAM PAGE: photo fallback and department filters =====
    var teamGrid = document.getElementById('tg');
    // real photo -> example portrait (data-fb) -> coloured initials
    teamGrid.addEventListener('error', function(e) {
        var i = e.target;
        if (i.tagName !== 'IMG') return;
        if (i.dataset.fb && !i.dataset.t) {
            i.dataset.t = 1;
            i.src = i.dataset.fb
        } else i.remove();
    }, true);

    function filterTeam(dept) {
        var n = 0;
        teamGrid.querySelectorAll('.tm2').forEach(function(c) {
            var match = dept === 'all' || c.dataset.t === dept;
            if (match) {
                n++;
                c.hidden = false;
                c.classList.remove('outc', 'inc');
                void c.offsetWidth;
                c.style.animationDelay = (n * 50) + 'ms';
                c.classList.add('inc')
            } else {
                c.classList.remove('inc');
                c.classList.add('outc');
                setTimeout(function() { if (c.classList.contains('outc')) c.hidden = true }, 300)
            }
        });
    }
    document.querySelector('.tf').addEventListener('click', function(e) {
        var b = e.target.closest('.tfb');
        if (!b) return;
        document.querySelectorAll('.tfb').forEach(function(x) {
            var on = x === b;
            x.classList.toggle('on', on);
            x.setAttribute('aria-pressed', on)
        });
        filterTeam(b.dataset.t);
    });

})();