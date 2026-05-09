/* ==============================================
   Portfolio Script — Jhonatan Alcantara
   Three.js + GSAP + Typed.js + VanillaTilt
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initScrollProgress();
    initNavbar();
    initThreeJS();
    initTyped();
    initTilt();
    initScrollReveal();
    initSkillBars();
    initCounters();
});

/* ================================
   Loader
   ================================ */
function initLoader() {
    const loader = document.getElementById('loader');
    // Wait for progress bar animation + slight delay, then fade out
    setTimeout(() => {
        loader.classList.add('hidden');
        // Hero entrance after loader fades
        setTimeout(runHeroEntrance, 600);
    }, 1900);
}

function runHeroEntrance() {
    const items = document.querySelectorAll('.fade-in-item');
    items.forEach((el, i) => {
        setTimeout(() => {
            el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, i * 130);
    });

    // Counter trigger after hero is visible
    setTimeout(animateCounters, items.length * 130 + 400);
}

/* ================================
   Custom Cursor
   ================================ */
function initCursor() {
    const dot     = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;

    let mx = 0, my = 0, ox = 0, oy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Outline trails with lerp
    (function lerpOutline() {
        ox += (mx - ox) * 0.13;
        oy += (my - oy) * 0.13;
        outline.style.left = ox + 'px';
        outline.style.top  = oy + 'px';
        requestAnimationFrame(lerpOutline);
    })();

    // Hover expand
    document.querySelectorAll('a, button, [data-tilt], .skill-card, .contact-card').forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
    });
}

/* ================================
   Scroll Progress Bar
   ================================ */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const total   = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (window.scrollY / total) * 100;
        bar.style.width = percent + '%';
    }, { passive: true });
}

/* ================================
   Navbar
   ================================ */
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const overlay   = document.getElementById('navOverlay');
    const links     = document.querySelectorAll('.nav-link');
    const sections  = document.querySelectorAll('section[id]');

    // Scroll: scrolled class + active link highlight
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 220) current = sec.id;
        });
        links.forEach(link => {
            const isActive = link.getAttribute('href') === '#' + current;
            link.classList.toggle('active', isActive);
        });
    }, { passive: true });

    // Hamburger toggle
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('show');
    }
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        overlay.classList.toggle('show', isOpen);
    });
    overlay.addEventListener('click', closeMobileMenu);
    links.forEach(link => link.addEventListener('click', closeMobileMenu));

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}

/* ================================
   Three.js — Particle Network
   ================================ */
function initThreeJS() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 280;

    /* --- Particles --- */
    const COUNT = window.innerWidth < 768 ? 60 : 110;
    const posArr = new Float32Array(COUNT * 3);
    const velArr = [];

    for (let i = 0; i < COUNT; i++) {
        const x = (Math.random() - 0.5) * 750;
        const y = (Math.random() - 0.5) * 550;
        const z = (Math.random() - 0.5) * 300;
        posArr[i * 3]     = x;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = z;
        velArr.push({
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28
        });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

    const pMat = new THREE.PointsMaterial({
        color: 0x00ffd4,
        size: 2.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* --- Connection Lines --- */
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ffd4,
        transparent: true,
        opacity: 0.06
    });
    let linesMesh = null;
    const MAX_DIST = 140;

    function rebuildLines() {
        if (linesMesh) { scene.remove(linesMesh); linesMesh.geometry.dispose(); }
        const verts = [];
        for (let i = 0; i < COUNT; i++) {
            for (let j = i + 1; j < COUNT; j++) {
                const dx = posArr[i*3]   - posArr[j*3];
                const dy = posArr[i*3+1] - posArr[j*3+1];
                const dz = posArr[i*3+2] - posArr[j*3+2];
                if ((dx*dx + dy*dy + dz*dz) < MAX_DIST * MAX_DIST) {
                    verts.push(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
                    verts.push(posArr[j*3], posArr[j*3+1], posArr[j*3+2]);
                }
            }
        }
        const lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
        linesMesh = new THREE.LineSegments(lGeo, lineMat);
        scene.add(linesMesh);
    }

    /* --- Mouse Parallax --- */
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* --- Resize --- */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* --- Render Loop --- */
    let frame = 0;
    function animate() {
        requestAnimationFrame(animate);
        frame++;

        // Move particles
        for (let i = 0; i < COUNT; i++) {
            posArr[i*3]   += velArr[i].vx;
            posArr[i*3+1] += velArr[i].vy;
            if (Math.abs(posArr[i*3])   > 380) velArr[i].vx *= -1;
            if (Math.abs(posArr[i*3+1]) > 280) velArr[i].vy *= -1;
        }
        pGeo.attributes.position.needsUpdate = true;

        // Rebuild lines every 4 frames for performance
        if (frame % 4 === 0) rebuildLines();

        // Camera parallax
        camera.position.x += (mouseX * 25 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 18 - camera.position.y) * 0.04;

        // Slow self-rotation
        points.rotation.z += 0.0004;

        renderer.render(scene, camera);
    }
    animate();
}

/* ================================
   Typed.js
   ================================ */
function initTyped() {
    if (typeof Typed === 'undefined') return;
    new Typed('#typed-text', {
        strings: [
            'Desenvolvedor Web',
            'Designer Criativo',
            'Full Stack Developer',
            'Solucionador de Problemas'
        ],
        typeSpeed: 55,
        backSpeed: 35,
        backDelay: 2200,
        loop: true,
        cursorChar: '_'
    });
}

/* ================================
   VanillaTilt
   ================================ */
function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 12,
        speed: 450,
        glare: true,
        'max-glare': 0.18,
        scale: 1.02
    });
}

/* ================================
   Scroll Reveal (Intersection Observer)
   ================================ */
function initScrollReveal() {
    const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), idx * 70);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
}

/* ================================
   Skill Bars
   ================================ */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.getAttribute('data-width') || '0';
                setTimeout(() => { bar.style.width = width + '%'; }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
}

/* ================================
   Counter Animation
   ================================ */
function initCounters() {
    // Triggered once hero entrance finishes (called by runHeroEntrance)
}

function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        let current  = 0;
        const step   = target / 45;
        const timer  = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            counter.textContent = Math.floor(current);
        }, 28);
    });
}
