async function loadFooter() {
    try {
        const response = await fetch('/src/footer/index.html');
        if (!response.ok) throw new Error('Footer konnte nicht geladen werden');
        const footerHtml = await response.text();

        const footerContainer = document.createElement('div');
        footerContainer.id = 'footer-container';
        document.body.appendChild(footerContainer);
        footerContainer.innerHTML = footerHtml;

    } catch (error) {
        console.error('Fehler beim Laden des Footers:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadFooter);
