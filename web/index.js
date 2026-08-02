document.addEventListener('DOMContentLoaded', function() {
    const countEl = document.getElementById('onlineCountFloat');
    const serverId = '1496801013212909588';

    fetch(`https://discord.com/api/guilds/${serverId}/widget.json`)
        .then(res => res.json())
        .then(data => {
            const online = data.presence_count || 0;
            let cur = 0;
            const step = Math.ceil(online / 40);
            const iv = setInterval(() => {
                cur += step;
                if (cur >= online) { cur = online; clearInterval(iv); }
                countEl.textContent = cur;
            }, 30);
        })
        .catch(() => {
            countEl.textContent = '?';
        });
});
