async function loadNavbar() {
    try {
        const response = await fetch('/src/menue/index.html');
        if (!response.ok) throw new Error('Navbar konnte nicht geladen werden');
        const navbarHtml = await response.text();
        document.getElementById('navbar-container').innerHTML = navbarHtml;

        // Create overlay for mobile menu
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.id = 'navOverlay';
        document.body.appendChild(overlay);

        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        const links = document.querySelectorAll('.nav-links a');
        
        links.forEach(link => {
            const href = link.getAttribute('href').replace(/\/$/, '') || '/';
            if (currentPath === href) {
                link.classList.add('active');
            }
        });

        // Toggle handler
        const toggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const navOverlay = document.getElementById('navOverlay');

        function closeMenu() {
            toggle.classList.remove('open');
            navLinks.classList.remove('open');
            navOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function openMenu() {
            toggle.classList.add('open');
            navLinks.classList.add('open');
            navOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        toggle.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navOverlay.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });

    } catch (error) {
        console.error('Fehler beim Laden der Navbar:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);
