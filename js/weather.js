
let cfgLat = parseFloat(localStorage.getItem('kiosk_geo_lat')) || 48.1486;
let cfgLon = parseFloat(localStorage.getItem('kiosk_geo_lon')) || 17.1077;
let cfgCityName = localStorage.getItem('kiosk_geo_name') || "Bratislava";

let globalWeatherData = null;
let aktivnyIndexDna = 'teraz';

const HISTORIA_MIEST = [
    { name: "Bratislava", lat: 48.1486, lon: 17.1077 },
    { name: "Šamorín", lat: 48.0285, lon: 17.3097 },
    { name: "Senecké jazerá", lat: 48.2192, lon: 17.4162 },
    { name: "Mlynky", lat: 48.8541, lon: 20.4224 }
];

async function fetchWeatherData() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cfgLat}&longitude=${cfgLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) return;
        
        globalWeatherData = await res.json();
        vykresliPlochuPocasia();
    } catch (e) {
        console.log("Chyba načítania počasia:", e);
    }
}

function decodeWmoIcon(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '🌩️';
    return '🌡️';
}

function decodeWmoText(code) {
    if (code === 0) return 'Jasno';
    if (code === 1) return 'Prevažne jasno';
    if (code === 2) return 'Polooblačno';
    if (code === 3) return 'Zamračené';
    if (code >= 45 && code <= 48) return 'Hmla';
    if (code >= 51 && code <= 55) return 'Mrholenie';
    if (code >= 61 && code <= 65) return 'Daždivo';
    if (code >= 71 && code <= 75) return 'Sneženie';
    if (code >= 80 && code <= 82) return 'Prehánky';
    if (code >= 95) return 'Búrky';
    return 'Mierne počasie';
}

function vykresliPlochuPocasia() {
    if (!globalWeatherData) return;
    const curr = globalWeatherData.current;
    const daily = globalWeatherData.daily;

    const cityEl = document.getElementById('bigClockCity');
    if (cityEl) cityEl.innerText = cfgCityName;

    const mainTemp = document.getElementById('mainBigTemp');
    if (mainTemp) mainTemp.innerText = `${Math.round(curr.temperature_2m)}°C`;

    const mainIcon = document.getElementById('mainBigIcon');
    if (mainIcon) mainIcon.innerText = decodeWmoIcon(curr.weather_code);

    const mainApp = document.getElementById('mainApparent');
    if (mainApp) mainApp.innerText = `${Math.round(curr.apparent_temperature)}°`;

    const mainHum = document.getElementById('mainHumidity');
    if (mainHum) mainHum.innerText = `${curr.relative_humidity_2m}%`;

    const mainDesc = document.getElementById('mainWeatherDesc');
    if (mainDesc) {
        mainDesc.innerHTML = `${decodeWmoText(curr.weather_code)} <i class="fa-solid fa-satellite-dish" style="color: #ff9f0a; margin-left: 8px; font-size: 0.85em;"></i>`;
    }

    // Minikarty Dnes / Zajtra
    const fc0Icon = document.getElementById('mainFc0Icon');
    const fc0Temp = document.getElementById('mainFc0Temp');
    if (fc0Icon) fc0Icon.innerText = decodeWmoIcon(daily.weather_code[0]);
    if (fc0Temp) fc0Temp.innerText = `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`;

    const fc1Icon = document.getElementById('mainFc1Icon');
    const fc1Temp = document.getElementById('mainFc1Temp');
    if (fc1Icon) fc1Icon.innerText = decodeWmoIcon(daily.weather_code[1]);
    if (fc1Temp) fc1Temp.innerText = `${Math.round(daily.temperature_2m_max[1])}° / ${Math.round(daily.temperature_2m_min[1])}°`;
}

function prepniNaDalsieMesto(ev) {
    if (ev) ev.stopPropagation();
    let currentIndex = HISTORIA_MIEST.findIndex(m => m.name.toLowerCase() === cfgCityName.toLowerCase());
    let nextIndex = (currentIndex + 1) % HISTORIA_MIEST.length;
    const noveMesto = HISTORIA_MIEST[nextIndex];

    cfgCityName = noveMesto.name;
    cfgLat = noveMesto.lat;
    cfgLon = noveMesto.lon;

    localStorage.setItem('kiosk_geo_name', cfgCityName);
    localStorage.setItem('kiosk_geo_lat', cfgLat);
    localStorage.setItem('kiosk_geo_lon', cfgLon);

    fetchWeatherData();
}

function otvorGrafPreDen(ev, denIndex) {
    if (ev) ev.stopPropagation();
    aktivnyIndexDna = denIndex;
    vykresliGraf();
    const detailView = document.getElementById('weatherDetailView');
    if (detailView) detailView.style.display = 'flex';
}

function toggleWeatherView(ev) {
    if (ev) ev.stopPropagation();
    const detailView = document.getElementById('weatherDetailView');
    if (!detailView) return;

    if (detailView.style.display === 'flex') {
        detailView.style.display = 'none';
    } else {
        aktivnyIndexDna = 'teraz';
        vykresliGraf();
        detailView.style.display = 'flex';
    }
}

function vykresliGraf() {
    if (!globalWeatherData) return;
    
    const locText = document.getElementById('weather-location-text');
    if (locText) locText.innerText = cfgCityName;

    const sunRise = document.getElementById('sun-rise-val');
    const sunSet = document.getElementById('sun-set-val');
    if (sunRise) sunRise.innerText = globalWeatherData.daily.sunrise[0].split('T')[1];
    if (sunSet) sunSet.innerText = globalWeatherData.daily.sunset[0].split('T')[1];

    const chartContainer = document.getElementById('hourly-chart-container');
    if (!chartContainer) return;
    chartContainer.innerHTML = "";

    const terazIndex = new Date().getHours();
    const hourly = globalWeatherData.hourly;

    for (let i = terazIndex; i < terazIndex + 12; i++) {
        if (!hourly.time[i]) break;
        const cas = hourly.time[i].split('T')[1];
        const temp = Math.round(hourly.temperature_2m[i]);
        const pop = hourly.precipitation_probability[i];
        const icon = decodeWmoIcon(hourly.weather_code[i]);

        const col = document.createElement('div');
        col.className = 'hourly-col';
        col.innerHTML = `
            <span class="hourly-time">${cas}</span>
            <span class="hourly-icon">${icon}</span>
            <span class="hourly-temp">${temp}°C</span>
            <span class="hourly-pop">${pop > 0 ? pop + '%' : ''}</span>
        `;
        chartContainer.appendChild(col);
    }
}

// Obnovovať počasie každých 15 minút
fetchWeatherData();
setInterval(fetchWeatherData, 15 * 60 * 1000);
