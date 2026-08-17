// --- NASTAVENIA NOČNÉHO REŽIMU & SNOOZE ---
let cfgNightFrom = localStorage.getItem('kiosk_night_from') || "20:00";
let cfgNightTo = localStorage.getItem('kiosk_night_to') || "05:20";
let cfgNightColor = localStorage.getItem('kiosk_night_color') || "#ffa500";
let cfgSnoozeMin = parseInt(localStorage.getItem('kiosk_snooze_min')) || 1;

let isManualNightMode = false;
let snoozeUntilTimestamp = 0;
let meninyDataCSV = "";

document.documentElement.style.setProperty('--night-color', cfgNightColor);

// --- NAČÍTANIE MIESTNYCH MENÍN ---
async function naciatMeninyCSV() {
    try {
        const res = await fetch('meniny.csv');
        if (res.ok) {
            meninyDataCSV = await res.text();
            runClockEngine();
        }
    } catch (e) {
        console.log("Meniny CSV sa nepodarilo nacitat:", e);
    }
}

function ziskajDnesneMeniny(dateObj) {
    if (!meninyDataCSV) return "---";
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hladanyDatum = `${mm}${dd}`;

    const riadky = meninyDataCSV.split(/\r?\n/);
    for (let r of riadky) {
        if (!r.trim()) continue;
        const stlpce = r.split(';');
        if (stlpce.length >= 2 && stlpce[0].trim() === hladanyDatum) {
            return stlpce[1].trim();
        }
    }
    return "---";
}

// --- HLAVNÝ MOTOR HODÍN & NOC / DEŇ ---
function runClockEngine() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');

    const bigH = document.getElementById('bigHours');
    const bigM = document.getElementById('bigMinutes');
    if (bigH) bigH.innerText = h;
    if (bigM) bigM.innerText = m;

    // Dátum
    const dni = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
    const denNazov = dni[now.getDay()];
    const dateStr = `${denNazov} ${now.getDate()}. ${now.getMonth() + 1}.`;
    
    const bigDateEl = document.getElementById('bigDate');
    if (bigDateEl) bigDateEl.innerText = dateStr;

    // Meniny
    const meninyText = ziskajDnesneMeniny(now);
    const bigNameEl = document.getElementById('bigNameday');
    if (bigNameEl) bigNameEl.innerText = meninyText;

    // Vyhodnotenie nočného režimu
    const currentTimeVal = now.getHours() * 60 + now.getMinutes();
    const [fH, fM] = cfgNightFrom.split(':').map(Number);
    const [tH, tM] = cfgNightTo.split(':').map(Number);
    const fromVal = fH * 60 + fM;
    const toVal = tH * 60 + tM;

    let isAutoNightWindow = false;
    if (fromVal > toVal) {
        isAutoNightWindow = (currentTimeVal >= fromVal || currentTimeVal < toVal);
    } else {
        isAutoNightWindow = (currentTimeVal >= fromVal && currentTimeVal < toVal);
    }

    const isSnoozed = (Date.now() < snoozeUntilTimestamp);
    const shouldBeNight = (isAutoNightWindow || isManualNightMode) && !isSnoozed;

    if (shouldBeNight) {
        document.body.classList.add('full-night-mode');
    } else {
        document.body.classList.remove('full-night-mode');
    }

    // Aktualizácia spodného nočného riadka
    const nightBottom = document.getElementById('nightBottomInfo');
    const mainTemp = document.getElementById('mainBigTemp') ? document.getElementById('mainBigTemp').innerText : '--°C';
    const mainIcon = document.getElementById('mainBigIcon') ? document.getElementById('mainBigIcon').innerText : '☀️';

    if (nightBottom) {
        nightBottom.innerHTML = `<span>${meninyText}</span> <span style="color:var(--night-color); opacity:0.3;">•</span> <span>${dateStr}</span> <span style="color:var(--night-color); opacity:0.3;">•</span> <span>${mainIcon} ${mainTemp}</span>`;
    }

    if (typeof aktualizujNochnyPrehravacVizual === 'function') {
        aktualizujNochnyPrehravacVizual();
    }
}

// Interakcia kliknutím na hodiny
function handleBigClockClick() {
    const now = new Date();
    const currentTimeVal = now.getHours() * 60 + now.getMinutes();
    const [fH, fM] = cfgNightFrom.split(':').map(Number);
    const [tH, tM] = cfgNightTo.split(':').map(Number);
    const fromVal = fH * 60 + fM;
    const toVal = tH * 60 + tM;

    let isAutoNightWindow = false;
    if (fromVal > toVal) {
        isAutoNightWindow = (currentTimeVal >= fromVal || currentTimeVal < toVal);
    } else {
        isAutoNightWindow = (currentTimeVal >= fromVal && currentTimeVal < toVal);
    }

    if (isAutoNightWindow) {
        // Ak sme v noci, dotyk zapne Snooze (prebudenie na nastavený čas)
        snoozeUntilTimestamp = Date.now() + (cfgSnoozeMin * 60 * 1000);
    } else {
        // Cez deň kliknutie manuálne prepína nočný režim
        isManualNightMode = !isManualNightMode;
    }
    runClockEngine();
}

// Spustenie časovača
naciatMeninyCSV();
setInterval(runClockEngine, 1000);
