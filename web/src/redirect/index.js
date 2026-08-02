function initRedirect( config ) {
    const { icon, title, url, message } = config;

    const container = document.getElementById('redirect-container');
    if ( ! container ) return;

    // Brand class from icon
    const brandClass = icon
        .replace('fa-brands fa-', 'brand-')
        .replace('fa-solid fa-', 'brand-');

    container.innerHTML = `
        <div class="redirect-container">
            <div class="redirect-icon-wrapper ${brandClass}">
                <i class="${icon}"></i>
            </div>
            <h1>${title}</h1>
            <p>${message || 'Du wirst automatisch weitergeleitet. Falls nicht, klicke auf den Link unten.'}</p>
            <a href="${url}" class="redirect-link" target="_blank">
                ${title.replace('Weiterleitung zu ', 'Öffne ').replace('...', '')}
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    `;

    // Fallback redirect in case meta refresh is blocked
    window.location.replace( url );
}
