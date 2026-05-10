const header = document.querySelector('#site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const progress = document.querySelector('#scroll-progress');
const backTop = document.querySelector('#back-top');
const typewriter = document.querySelector('#typewriter');
const canvas = document.querySelector('#cyber-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const roles = [
    'secure web applications',
    'AI security research',
    'RAG poisoning defense',
    'real-time phishing detection',
    'REST API engineering',
    'authorized red team operations'
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    if (!typewriter) return;
    const word = roles[roleIndex];
    typewriter.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
        charIndex += 1;
        setTimeout(typeLoop, 58);
        return;
    }

    if (!deleting && charIndex === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
    }

    if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 34);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeLoop, 240);
}

function updateScrollState() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    header?.classList.toggle('scrolled', scrollTop > 24);
    if (progress) progress.style.width = `${percent}%`;

    let active = 'home';
    document.querySelectorAll('main section[id]').forEach((section) => {
        if (scrollTop >= section.offsetTop - 160) active = section.id;
    });

    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
    });
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('open');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

function animateCounter(counter) {
    const target = Number(counter.dataset.target || 0);
    const decimal = String(counter.dataset.target || '').includes('.');
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
        const progressValue = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progressValue, 3);
        const value = target * eased;
        counter.textContent = decimal ? value.toFixed(1) : Math.round(value);
        if (progressValue < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');

        entry.target.querySelectorAll?.('.skill-row').forEach((row) => {
            row.style.setProperty('--level', `${row.dataset.level || 0}%`);
        });

        entry.target.querySelectorAll?.('.counter').forEach((counter) => {
            if (!counter.dataset.done) {
                counter.dataset.done = 'true';
                animateCounter(counter);
            }
        });

        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.16, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll('.counter');
counters.forEach((counter) => revealObserver.observe(counter.closest('.reveal') || counter));

const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card) => revealObserver.observe(card));

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -5;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const subject = `Portfolio inquiry from ${name}`;
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:rajeshchandrappa999@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
}

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', resizeCanvas);

let particles = [];
function resizeCanvas() {
    if (!canvas || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(90, Math.max(36, Math.floor(window.innerWidth / 18)));
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6
    }));
}

function drawParticles() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = index % 3 === 0 ? 'rgba(255,16,84,0.65)' : 'rgba(0,255,240,0.55)';
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distance = Math.hypot(dx, dy);
            if (distance < 110) {
                ctx.strokeStyle = `rgba(0,255,240,${0.12 * (1 - distance / 110)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
typeLoop();
updateScrollState();

window.addEventListener('hashchange', () => {
    window.setTimeout(updateScrollState, 80);
});

window.addEventListener('load', () => {
    window.setTimeout(updateScrollState, 120);
});
