/* ============================================
   JavaScript — DevOps Pipeline Animations
   ============================================ */

// ---- Particle Background ----
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const COUNT = 80;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();


// ---- Typing Effect ----
(function initTypingEffect() {
    const phrases = [
        'GitHub Actions',
        'CI/CD Pipelines',
        'Infrastructure as Code',
        'Container Orchestration',
        'Automated Testing',
    ];
    const el = document.querySelector('.typed-text');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pauseEnd = 0;

    function tick() {
        const now = Date.now();
        if (now < pauseEnd) { requestAnimationFrame(tick); return; }

        const current = phrases[phraseIndex];

        if (!deleting) {
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                deleting = true;
                pauseEnd = now + 2000;
            }
        } else {
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }
        const speed = deleting ? 40 : 80;
        setTimeout(() => requestAnimationFrame(tick), speed);
    }
    tick();
})();


// ---- Terminal Animation ----
(function initTerminal() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    const lines = [
        { type: 'command', text: 'git push origin main' },
        { type: 'output', text: 'Enumerating objects: 42, done.' },
        { type: 'output', text: 'Compressing objects: 100% (38/38)' },
        { type: 'success', text: '✓ Push successful — triggering Actions...' },
        { type: 'command', text: 'gh workflow run ci.yml' },
        { type: 'output', text: 'Workflow "CI/CD Pipeline" dispatched' },
        { type: 'success', text: '✓ Build passed (2m 14s)' },
        { type: 'success', text: '✓ Tests passed — 47/47 specs' },
        { type: 'success', text: '✓ Docker image pushed to registry' },
        { type: 'success', text: '✓ Deployed to production 🚀' },
    ];

    // Clear initial placeholder
    body.innerHTML = '';

    let i = 0;
    function addLine() {
        if (i >= lines.length) {
            // Restart after a pause
            setTimeout(() => {
                body.innerHTML = '';
                i = 0;
                addLine();
            }, 4000);
            return;
        }

        const line = lines[i];
        const div = document.createElement('div');
        div.className = 'terminal-line';
        div.style.animationDelay = '0s';

        if (line.type === 'command') {
            div.innerHTML = `<span class="prompt">$</span><span class="command">${line.text}</span>`;
        } else {
            const cls = line.type === 'success' ? 'success' : 'output';
            div.innerHTML = `<span class="${cls}">${line.text}</span>`;
        }

        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        i++;

        const delay = line.type === 'command' ? 800 : 400;
        setTimeout(addLine, delay);
    }

    // Start after initial page load animation
    setTimeout(addLine, 2000);
})();


// ---- Scroll Reveal (Intersection Observer) ----
(function initScrollReveal() {
    const options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Stagger animations within a group
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe feature cards, pipeline steps, and tech items
    document.querySelectorAll('.feature-card, .pipeline-step, .tech-item').forEach(el => {
        observer.observe(el);
    });
})();


// ---- Card Tilt Effect ----
(function initTiltEffect() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();


// ---- Smooth scroll for nav links ----
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// ---- Explore Button ripple ----
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        const features = document.getElementById('features');
        if (features) features.scrollIntoView({ behavior: 'smooth' });
    });
}
