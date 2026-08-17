
let slotFavorites = JSON.parse(localStorage.getItem('kiosk_slots_v2')) || ["slovensko", "funchill", "rock", "blanik", "fun", "spotify"];
const audio = document.getElementById('audioPlayer') || new Audio();

let currentPlayingType = "";
let metadataController = null;
let bauerIntervalId = null;
let globalPauseToStopTimeout = null;
const CAS_PRE_HARD_STOP = 5 * 60 * 1000;

function renderSidebarFavorites() {
    const container = document.getElementById('favSidebarContainer');
    if(!container) return;
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const id = slotFavorites[i];
        const item = DATABASE.find(d => d.id === id);
        const card = document.createElement('div');
        
        if (item && id !== null) {
            card.className = "fav-card";
            if (currentPlayingType === item.id && !audio.paused) {
                card.classList.add("playing");
            }
            card.onclick = () => handleFavCardClick(item);

            if (item.img) {
                card.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
            } else if (item.icon) {
                card.innerHTML = `<i class="${item.icon}" style="color:${item.color}"></i><span>${item.name}</span>`;
            }
        } else {
            card.className = "fav-card empty";
            card.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        }
        container.appendChild(card);
    }
}

function handleFavCardClick(item) {
    if (typeof isSettingsModeActive !== 'undefined' && isSettingsModeActive) return;

    const spotifyContainer = document.getElementById('spotifyPlayerContainer');
    const spotifyIframe = document.getElementById('spotifyIframe');
    const weatherBlock = document.querySelector('.main-weather-container');

    if (item.embedUrl || (item.id && item.id.startsWith('sp'))) {
        audio.pause();
        audio.src = "";

        if (currentPlayingType === item.id && spotifyContainer && spotifyContainer.style.display === 'block') {
            spotifyContainer.style.display = 'none';
            spotifyIframe.src = "about:blank";
            if (weatherBlock) weatherBlock.style.display = 'flex';
            currentPlayingType = "";
            document.getElementById("player-now-playing").innerText = "";
        } else {
            if (weatherBlock) weatherBlock.style.display = 'none';
            if (spotifyContainer && spotifyIframe) {
                spotifyIframe.src = item.embedUrl;
                spotifyContainer.style.display = 'block';
            }
            currentPlayingType = item.id;
            document.getElementById("player-now-playing").innerText = "Playlist: " + item.name;
        }
        renderSidebarFavorites();
        return;
    }

    if (spotifyContainer && spotifyContainer.style.display === 'block') {
        spotifyContainer.style.display = 'none';
        if (spotifyIframe) spotifyIframe.src = "about:blank";
        if (weatherBlock) weatherBlock.style.display = 'flex';
    }

    if (item.url) {
        if (currentPlayingType === item.id) {
            audio.pause(); 
            document.getElementById("player-now-playing").innerText = "";
            renderSidebarFavorites(); 
        } else {
            playRadio(item.url, item.id);
        }
    }
}

function playRadio(url, id) {
    audio.src = url;
    audio.load();
    sledujStreamMetadat(url);
    currentPlayingType = id;
    localStorage.setItem('kiosk_last_radio_url', url);
    localStorage.setItem('kiosk_last_radio_type', id);
    audio.volume = VOLUME_MAP[id] !== undefined ? VOLUME_MAP[id] : 1.0;
    
    audio.play().then(() => {
        if (typeof noSleep !== 'undefined') {
            noSleep.enable().catch(e => console.log("WakeLock chyba:", e));
        }
        renderSidebarFavorites();
        if (typeof runClockEngine === 'function') runClockEngine(); 
        aktualizujZamknutuObrazovku(id);
        aktualizujNochnyPrehravacVizual();
    }).catch((e) => console.log("Stream offline", e));
}

function toggleNightPlayPause() {
    if (!currentPlayingType || currentPlayingType === "") return;
    if (audio.paused) {
        audio.play().catch(e => console.log("Chyba nočného prebudenia prúdu:", e));
    } else {
        audio.pause();
    }
}

function aktualizujNochnyPrehravacVizual() {
    const pBox = document.getElementById('nightPlayer');
    const pInfo = document.getElementById('nightStationInfo');
    const pBtn = document.getElementById('nightPlayPauseBtn');
    if (!pBox) return;

    if (currentPlayingType && currentPlayingType !== "") {
        const item = DATABASE.find(d => d.id === currentPlayingType);
        if (item && item.url && !item.url.includes('music.apple.com') && !item.url.includes('music.youtube.com')) {
            pBox.classList.add('active-playing');
            let imgHtml = item.img ? `<img src="${item.img}">` : `<i class="${item.icon || 'fa-solid fa-radio'}"></i>`;
            if(pInfo) pInfo.innerHTML = `${imgHtml} <span>${item.name}</span>`;
            if(pBtn) {
                pBtn.innerHTML = audio.paused ? `<i class="fa-solid fa-circle-play"></i>` : `<i class="fa-solid fa-circle-pause"></i>`;
            }
            return;
        }
    }
    pBox.classList.remove('active-playing');
}

function aktualizujZamknutuObrazovku(idRadia) {
    if ('mediaSession' in navigator) {
        const hrajuceRadio = DATABASE.find(d => d.id === idRadia);
        const nazovRadia = hrajuceRadio ? hrajuceRadio.name : idRadia.toUpperCase();
        const ikonaRadia = hrajuceRadio && hrajuceRadio.img ? hrajuceRadio.img : "https://raw.githubusercontent.com/zmobilu/assets/main/kiosk-ikona.png";

        navigator.mediaSession.metadata = new MediaMetadata({
            title: nazovRadia,
            artist: 'Živé vysielanie',
            album: 'Meteo 📻',
            artwork: [ { src: ikonaRadia, sizes: '512x512', type: 'image/png' } ]
        });

        navigator.mediaSession.setActionHandler('play', () => { audio.play(); });
        navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); });
        navigator.mediaSession.setActionHandler('nexttrack', () => { spustiDalsieRadio('vpred'); });
        navigator.mediaSession.setActionHandler('previoustrack', () => { spustiDalsieRadio('vzad'); });
    }
}

function spustiDalsieRadio(smer) {
    if (!currentPlayingType || currentPlayingType === "") return;
    let currentIndex = slotFavorites.indexOf(currentPlayingType);
    if (currentIndex === -1) return;

    let novyIndex = currentIndex;
    let najdeneRadio = null;

    for (let i = 0; i < 6; i++) {
        novyIndex = (smer === 'vpred') ? (novyIndex + 1) % 6 : (novyIndex - 1 + 6) % 6;
        const idKandidata = slotFavorites[novyIndex];
        if (!idKandidata) continue;

        const item = DATABASE.find(d => d.id === idKandidata);
        if (item && item.url) {
            najdeneRadio = item;
            break;
        }
    }

    if (najdeneRadio) {
        playRadio(najdeneRadio.url, najdeneRadio.id);
    }
}

async function sledujStreamMetadat(streamUrl) {
    const textElement = document.getElementById("player-now-playing");
    if(!textElement) return;
    textElement.innerText = ""; 

    if (metadataController) { metadataController.abort(); metadataController = null; }
    if (bauerIntervalId) { clearInterval(bauerIntervalId); bauerIntervalId = null; }
    
    metadataController = new AbortController();
    const localSignal = metadataController.signal;

    if (currentPlayingType === 'rock') {
        const nacitajRockPiesen = async () => {
            if (localSignal.aborted || currentPlayingType !== 'rock') return;
            try {
                const targetUrl = encodeURIComponent('https://www.radia.sk/radia/rock/playlist');
                const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`, { signal: localSignal });
                const data = await res.json();
                if (data && data.contents) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data.contents, 'text/html');
                    const prvyRiadok = doc.querySelector('#playlist_table .row.data');
                    if (prvyRiadok) {
                        const artist = prvyRiadok.querySelector('.interpret')?.textContent.trim() || '';
                        const song = prvyRiadok.querySelector('.titul')?.textContent.trim() || '';
                        textElement.innerText = (artist || song) ? `${artist} - ${song}` : "";
                        return;
                    }
                }
            } catch (e) {}
        };
        await nacitajRockPiesen();
        bauerIntervalId = setInterval(nacitajRockPiesen, 30000);
        return;
    }

    const sroMap = {
        'slovensko': { domain: 'slovensko.stvr.sk', channel: 12 },
        'fm':        { domain: 'fm.stvr.sk',        channel: 5 },
        'devin':     { domain: 'devin.stvr.sk',     channel: 3 },
        'regina':    { domain: 'reginazapad.stvr.sk', channel: 1 }
    };
    
    if (sroMap[currentPlayingType]) {
        const stanica = sroMap[currentPlayingType];
        const spustenaStanicaType = currentPlayingType;
        const nacitajSroPlaylist = async () => {
            if (localSignal.aborted || currentPlayingType !== spustenaStanicaType) return;
            try {
                const playlistUrl = `https://${stanica.domain}/json/snippet/radio_playlist.json?channel=${stanica.channel}`;
                const targetUrl = encodeURIComponent(playlistUrl);
                const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`, { signal: localSignal });
                const data = await res.json();
                if (data && data.contents) {
                    const jsonData = JSON.parse(data.contents);
                    const htmlSnippet = jsonData.snippets?.['snippet-playlist'];
                    if (htmlSnippet) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlSnippet, 'text/html');
                        const firstItem = doc.querySelector('li.list');
                        if (firstItem) {
                            const artist = firstItem.querySelector('.title')?.textContent.trim() || '';
                            const song = firstItem.querySelector('.song')?.textContent.trim() || '';
                            textElement.innerText = (artist || song) ? `${artist} - ${song}` : "";
                            return;
                        }
                    }
                }
            } catch (e) {}
        };
        await nacitajSroPlaylist();
        bauerIntervalId = setInterval(nacitajSroPlaylist, 30000);
        return;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (localSignal.aborted) return;

        const response = await fetch(streamUrl, { headers: { 'Icy-Metadata': '1' }, signal: localSignal });
        const metaInt = parseInt(response.headers.get('icy-metaint'));
        if (!metaInt) return;

        const reader = response.body.getReader();
        let buffer = new Uint8Array();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let newBuffer = new Uint8Array(buffer.length + value.length);
            newBuffer.set(buffer);
            newBuffer.set(value, buffer.length);
            buffer = newBuffer;

            while (buffer.length > metaInt) {
                const metaLength = buffer[metaInt] * 16;
                if (buffer.length >= metaInt + 1 + metaLength) {
                    if (metaLength > 0) {
                        const metaBytes = buffer.subarray(metaInt + 1, metaInt + 1 + metaLength);
                        const metaString = new TextDecoder('utf-8').decode(metaBytes);
                        const match = metaString.match(/StreamTitle='(.*?)';/);
                        if (match && match[1]) {
                            textElement.innerText = match[1].trim();
                        }
                    }
                    buffer = buffer.subarray(metaInt + 1 + metaLength);
                } else {
                    break;
                }
            }
        }
    } catch (e) {}
}

audio.addEventListener('play', () => {
    clearTimeout(globalPauseToStopTimeout); 
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
    renderSidebarFavorites();
    aktualizujNochnyPrehravacVizual();
});

audio.addEventListener('pause', () => {
    const el = document.getElementById("player-now-playing");
    if(el) el.innerText = "";
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
    renderSidebarFavorites();
    aktualizujNochnyPrehravacVizual();

    clearTimeout(globalPauseToStopTimeout);
    globalPauseToStopTimeout = setTimeout(() => {
        audio.src = "";
        audio.load();
        currentPlayingType = "";
        if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
        renderSidebarFavorites();
        if (typeof runClockEngine === 'function') runClockEngine();
        aktualizujNochnyPrehravacVizual();
    }, CAS_PRE_HARD_STOP);
});
