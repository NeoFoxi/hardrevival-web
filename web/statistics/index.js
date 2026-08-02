let allPlayers = [];
let currentPlayer = null;

const ePlayerList = document.getElementById('playerList');
const eSearchInput = document.getElementById('searchInput');
const eTotalPlayersCount = document.getElementById('totalPlayersCount');
const eSelectedPlayerName = document.getElementById('selectedPlayerName');
const eRefreshBtn = document.getElementById('refreshBtn');

const eStateIndicator = document.getElementById('stateIndicator');
const eStatsDashboard = document.getElementById('statsDashboard');

const eValKills = document.getElementById('valKills');
const eValRevives = document.getElementById('valRevives');
const eValDeaths = document.getElementById('valDeaths');
const eValRevivedBy = document.getElementById('valRevivedBy');

const eListKills = document.getElementById('listKills');
const eListRevives = document.getElementById('listRevives');
const eListDeaths = document.getElementById('listDeaths');
const eListRevivedBy = document.getElementById('listRevivedBy');

async function init() {
    await loadPlayerList();

    eSearchInput.addEventListener('input', (e) => {
        renderPlayerList(e.target.value);
    });

    eRefreshBtn.addEventListener('click', async () => {
        const icon = eRefreshBtn.querySelector('i');
        if (icon.classList.contains('fa-spin')) return;

        icon.classList.add('fa-spin');

        if (currentPlayer) {
            await loadPlayerData(currentPlayer);
        } else {
            await loadPlayerList();
        }

        setTimeout(() => icon.classList.remove('fa-spin'), 500);
    });

    setupSidebarResize();
    setupMobileSidebar();
}

async function loadPlayerList() {
    try {
        const response = await fetch("https://api.hardrevival.net/v1/players/lists");
        if (!response.ok) throw new Error("Fehler");
        const players = await response.json();

        allPlayers = players.sort((a, b) => a.localeCompare(b));
        eTotalPlayersCount.innerText = allPlayers.length;
        renderPlayerList(eSearchInput.value);
    } catch (err) {
        console.error("Fehler beim Laden der Spielerliste:", err);
        allPlayers = [];
        eTotalPlayersCount.innerText = "0";
    }
}

function renderPlayerList(filterText) {
    ePlayerList.innerHTML = '';
    const lowerFilter = filterText.toLowerCase();

    const filtered = allPlayers.filter(p => p.toLowerCase().includes(lowerFilter));

    if (filtered.length === 0 && allPlayers.length > 0) {
        ePlayerList.innerHTML = `<li style="padding: 1rem; color: var(--text-muted); text-align: center;">Keine Treffer gefunden</li>`;
        return;
    }

    filtered.forEach(player => {
        const li = document.createElement('li');
        li.className = 'player-item';
        if (player === currentPlayer) {
            li.classList.add('active');
        }

        let initial = player.charAt(0).toUpperCase();

        li.innerHTML = `
            <div class="player-avatar">${initial}</div>
            <div class="player-name">${player}</div>
        `;

        li.addEventListener('click', () => {
            selectPlayer(player);
            document.querySelectorAll('.player-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
        });

        ePlayerList.appendChild(li);
    });
}

async function selectPlayer(username) {
    currentPlayer = username;
    eSelectedPlayerName.innerHTML = `<i class="fa-solid fa-user-astronaut"></i> ${username}`;

    showLoading();

    try {
        await loadPlayerData(username);
    } catch (err) {
        console.error("Fehler beim Laden der Spielerdaten:", err);
        eStateIndicator.innerHTML = `
            <div class="icon-container" style="color: var(--accent-kills); background: rgba(239,68,68,0.1)">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3>Fehler beim Laden</h3>
            <p>Die Daten für ${username} konnten nicht geladen werden.</p>
        `;
    }
}

async function loadPlayerData(username) {
    const response = await fetch("https://api.hardrevival.net/v1/players/datas?username=" + encodeURIComponent(username));

    if (!response.ok) throw new Error(`HTTP Fehler: ${response.status}`);

    const data = await response.json();

    const kills = data.killed_players || [];
    const revives = data.revived_players || [];
    const deaths = data.killed_by_players || [];
    const revivedBys = data.revived_by_players || [];

    eValKills.innerText = kills.length;
    eValRevives.innerText = revives.length;
    eValDeaths.innerText = deaths.length;
    eValRevivedBy.innerText = revivedBys.length;

    renderDetailList(eListKills, kills);
    renderDetailList(eListRevives, revives);
    renderDetailList(eListDeaths, deaths);
    renderDetailList(eListRevivedBy, revivedBys);

    showDashboard();
}

function renderDetailList(containerEle, arr) {
    containerEle.innerHTML = '';

    if (!arr || arr.length === 0) {
        containerEle.innerHTML = `
            <li class="detail-item">
                <span class="name" style="color: var(--text-muted); font-style: italic;">Keine Einträge vorhanden</span>
            </li>
        `;
        return;
    }

    const counts = {};
    arr.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    sorted.forEach(([name, count]) => {
        const li = document.createElement('li');
        li.className = 'detail-item';

        let counterBadge = '';
        if (count > 1) {
            counterBadge = `<span class="count-badge">x${count}</span>`;
        }

        li.innerHTML = `
            <span class="name">${name}</span>
            ${counterBadge}
        `;
        containerEle.appendChild(li);
    });
}

function showLoading() {
    eStateIndicator.innerHTML = `
        <div class="icon-container is-pulse">
            <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <h3>Daten werden geladen...</h3>
        <p>Statistiken von ${currentPlayer} werden abgerufen.</p>
    `;
    eStateIndicator.classList.remove('hidden');
    eStatsDashboard.classList.add('hidden');
}

function showDashboard() {
    eStateIndicator.classList.add('hidden');
    eStatsDashboard.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);

/* ─── Sidebar drag-to-resize (Desktop) ─── */
function setupSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const handle = document.getElementById('sidebarResizeHandle');
    let isResizing = false;

    function onStart(e) {
        if (window.innerWidth <= 768) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    }

    function onMove(e) {
        if (!isResizing) return;
        const containerRect = sidebar.parentElement.getBoundingClientRect();
        let newWidth = e.clientX - containerRect.left;
        newWidth = Math.max(200, Math.min(500, newWidth));
        sidebar.style.width = newWidth + 'px';
        mainContent.style.marginLeft = newWidth + 'px';
    }

    function onStop() {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }

    handle.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onStop);

    /* Touch support */
    handle.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768) return;
        isResizing = true;
        document.body.style.userSelect = 'none';
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        const touch = e.touches[0];
        const containerRect = sidebar.parentElement.getBoundingClientRect();
        let newWidth = touch.clientX - containerRect.left;
        newWidth = Math.max(200, Math.min(500, newWidth));
        sidebar.style.width = newWidth + 'px';
        mainContent.style.marginLeft = newWidth + 'px';
    }, { passive: true });
    document.addEventListener('touchend', onStop);
}

/* ─── Mobile sidebar toggle (animiert via CSS Transition) ─── */
function setupMobileSidebar() {
    const container = document.querySelector('.dashboard-container');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const overlay = document.getElementById('sidebarOverlay');

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function openSidebar() {
        sidebar.classList.remove('collapsed');
        overlay.classList.add('visible');
        toggleBtn.querySelector('i').className = 'fa-solid fa-xmark';
    }

    function closeSidebar() {
        sidebar.classList.add('collapsed');
        overlay.classList.remove('visible');
        toggleBtn.querySelector('i').className = 'fa-solid fa-users';
    }

    function toggleSidebar() {
        if (sidebar.classList.contains('collapsed')) {
            openSidebar();
        } else {
            closeSidebar();
        }
    }

    /* Init on mobile */
    if (isMobile()) {
        container.classList.add('mobile-layout-active');
        sidebar.classList.add('collapsed');
        toggleBtn.classList.add('visible');
    }

    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    /* Auto-collapse on player select on mobile */
    const origSelect = selectPlayer;
    selectPlayer = async function(username) {
        await origSelect.call(this, username);
        if (isMobile()) {
            closeSidebar();
        }
    };

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sidebar.classList.contains('collapsed') && isMobile()) {
            closeSidebar();
        }
    });

    /* Viewport-Wechsel: nur Klassen togglen, CSS transition macht den Rest */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const nowMobile = window.innerWidth <= 768;
            const hasMobileLayout = container.classList.contains('mobile-layout-active');

            if (nowMobile && !hasMobileLayout) {
                /* Desktop → Mobile: Sidebar fährt aus, main-content dehnt sich */
                container.classList.add('mobile-layout-active');
                sidebar.classList.add('collapsed');
                toggleBtn.classList.add('visible');
            } else if (!nowMobile && hasMobileLayout) {
                /* Mobile → Desktop: Sidebar fährt ein, main-content weicht */
                container.classList.remove('mobile-layout-active');
                sidebar.classList.remove('collapsed');
                toggleBtn.classList.remove('visible');
                overlay.classList.remove('visible');
            }
        }, 50);
    });
}
