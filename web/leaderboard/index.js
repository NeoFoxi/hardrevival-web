const DOM_ELEMENTS = {
    loader: document.getElementById('loader'),
    tableWrapper: document.getElementById('tableWrapper'),
    leaderboardBody: document.getElementById('leaderboardBody')
};

async function fetchLeaderboardData() {
    try {
        const listRes = await fetch("https://api.hardrevival.net/v1/players/lists");
        if (!listRes.ok) throw new Error("Fehler beim Laden der Spielerliste");
        const players = await listRes.json();

        const playerStatsPromises = players.map(async (username) => {
            const dataRes = await fetch("https://api.hardrevival.net/v1/players/datas?username=" + encodeURIComponent(username));
            if (!dataRes.ok) return null;
            
            const data = await dataRes.json();
            if (data === "404") return null;

            return {
                username,
                kills: data.killed_players ? data.killed_players.length : 0,
                revives: data.revived_players ? data.revived_players.length : 0,
                deaths: data.killed_by_players ? data.killed_by_players.length : 0,
            };
        });

        let playersData = await Promise.all(playerStatsPromises);
        playersData = playersData.filter(p => p !== null);

        playersData.sort((a, b) => {
            if (b.kills !== a.kills) return b.kills - a.kills;
            if (b.revives !== a.revives) return b.revives - a.revives;
            return a.deaths - b.deaths;
        });

        renderLeaderboard(playersData);

    } catch (e) {
        console.error(e);
        DOM_ELEMENTS.loader.innerHTML = `
            <i class="fa-solid fa-circle-exclamation"></i>
            <p>Fehler beim Laden der Rangliste</p>
        `;
    }
}

function renderLeaderboard(data) {
    if (data.length === 0) {
        DOM_ELEMENTS.leaderboardBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Noch niemand hat Blut vergossen.</td></tr>`;
    } else {
        DOM_ELEMENTS.leaderboardBody.innerHTML = data.map((player, index) => {
            const rank = index + 1;
            let rankClass = '';
            if (rank === 1) rankClass = 'rank-1';
            else if (rank === 2) rankClass = 'rank-2';
            else if (rank === 3) rankClass = 'rank-3';

            return `
                <tr class="${rankClass}">
                    <td class="rank-col">
                        <div class="rank-badge">${rank}</div>
                    </td>
                    <td>
                        <span class="player-name">${player.username}</span>
                    </td>
                    <td class="stat-col"><span class="stat-value kills-value">${player.kills}</span></td>
                    <td class="stat-col"><span class="stat-value revives-value">${player.revives}</span></td>
                    <td class="stat-col"><span class="stat-value deaths-value">${player.deaths}</span></td>
                </tr>
            `;
        }).join('');
    }

    DOM_ELEMENTS.loader.classList.add('hidden');
    DOM_ELEMENTS.tableWrapper.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', fetchLeaderboardData);
