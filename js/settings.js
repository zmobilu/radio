
let isSettingsModeActive = false;
let settingsTimeout = null;

function toggleSettingsMode() {
    isSettingsModeActive = !isSettingsModeActive;
    const btn = document.getElementById('settingsToggleBtn');
    const placeholder = document.getElementById('rightPlaceholder');
    const gridView = document.getElementById('settingsGridView');
    const weatherView = document.getElementById('weatherDetailView');

    if (isSettingsModeActive) {
        if (btn) btn.classList.add('active');
        if (placeholder) placeholder.style.display = 'none';
        if (weatherView) weatherView.style.display = 'none';
        if (gridView) {
            gridView.style.display = 'grid';
            renderSettingsGrid();
        }
        resetSettingsTimer();
    } else {
        clearTimeout(settingsTimeout);
        if (btn) btn.classList.remove('active');
        if (placeholder) placeholder.style.display = 'flex';
        if (gridView) gridView.style.display = 'none';
        if (weatherView) weatherView.style.display = 'none';
    }
}

function resetSettingsTimer() {
    if (!isSettingsModeActive) return;
    clearTimeout(settingsTimeout);
    settingsTimeout = setTimeout(() => {
        if (isSettingsModeActive) toggleSettingsMode();
    }, 10000);
}

function renderSettingsGrid() {
    const grid = document.getElementById('settingsGridView');
    if (!grid) return;

    const nightPanel = grid.querySelector('.settings-night-panel');
    while (grid.lastChild && grid.lastChild !== nightPanel) {
        grid.removeChild(grid.lastChild);
    }

    let currentCategory = "";

    DATABASE.forEach(item => {
        if (item.category !== currentCategory) {
            currentCategory = item.category;
            const separator = document.createElement('div');
            separator.className = "settings-label-separator";
            separator.textContent = currentCategory;
            grid.appendChild(separator);
        }

        const card = document.createElement('div');
        card.className = "cfg-mini-card";
        
        const isSelected = slotFavorites.includes(item.id);
        if (isSelected) card.classList.add("selected");

        card.onclick = (e) => { 
            handleChannelSelectionToggle(item.id); 
            e.stopPropagation(); 
        };

        if (item.img) {
            card.innerHTML = `<img src="${item.img}"><span>${item.name}</span>`;
        } else if (item.icon) {
            card.innerHTML = `<i class="${item.icon}" style="color:${item.color}"></i><span>${item.name}</span>`;
        }
        grid.appendChild(card);
    });

    inicializujPlochuNastaveni();
}

function handleChannelSelectionToggle(id) {
    const existingIndex = slotFavorites.indexOf(id);
    if (existingIndex !== -1) {
        slotFavorites[existingIndex] = null;
    } else {
        const freeSlotIndex = slotFavorites.indexOf(null);
        if (freeSlotIndex !== -1) {
            slotFavorites[freeSlotIndex] = id;
        } else {
            alert("Všetkých 6 pozícií je plných. Najprv kliknutím uvoľnite niektoré miesto.");
            return;
        }
    }
    localStorage.setItem('kiosk_slots_v2', JSON.stringify(slotFavorites));
    renderSidebarFavorites();
    renderSettingsGrid();
    resetSettingsTimer();
}

function inicializujPlochuNastaveni() {
    const elFrom = document.getElementById('set-night-from');
    const elTo = document.getElementById('set-night-to');
    const elSnooze = document.getElementById('set-snooze-time');
    
    if (elFrom) elFrom.textContent = cfgNightFrom;
    if (elTo) elTo.textContent = cfgNightTo;
    if (elSnooze) elSnooze.textContent = cfgSnoozeMin + " min";

    const btnCity = document.getElementById('set-weather-coords');
    if (btnCity) btnCity.textContent = `Mesto: ${cfgCityName}`;
}

function zmenNastavenieCasu(typ) {
    let povodny = (typ === 'od') ? cfgNightFrom : cfgNightTo;
    let novy = prompt(`Zadaj čas pre ${typ === 'od' ? 'ZAČIATOK' : 'KONIEC'} noci (HH:MM):`, povodny);
    if (novy && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(novy)) {
        if (novy.length === 4 && novy.indexOf(':') === 1) novy = "0" + novy;
        if (typ === 'od') { cfgNightFrom = novy; localStorage.setItem('kiosk_night_from', novy); } 
        else { cfgNightTo = novy; localStorage.setItem('kiosk_night_to', novy); }
        inicializujPlochuNastaveni();
        if (typeof runClockEngine === 'function') runClockEngine();
    }
    resetSettingsTimer();
}

function zmenDobuOdkladu() {
    let novaDoba = prompt("Zadaj dobu prebudenia hodín v minútach (Snooze):", cfgSnoozeMin);
    if (novaDoba && !isNaN(novaDoba) && parseInt(novaDoba) > 0) {
        cfgSnoozeMin = parseInt(novaDoba);
        localStorage.setItem('kiosk_snooze_min', cfgSnoozeMin);
        inicializujPlochuNastaveni();
    }
    resetSettingsTimer();
}

function nastavFarbuNoci(hexFarba, element) {
    cfgNightColor = hexFarba;
    localStorage.setItem('kiosk_night_color', hexFarba);
    document.documentElement.style.setProperty('--night-color', hexFarba);
    
    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active-color'));
    if (element) element.classList.add('active-color');
    
    if (typeof runClockEngine === 'function') runClockEngine();
    resetSettingsTimer();
}

function zmenNastavenieMesta() {
    let navrhMesta = prompt("Zadaj názov mesta (napr. Bratislava, Samorin, Senec):", cfgCityName);
    if (navrhMesta && navrhMesta.trim() !== "") {
        cfgCityName = navrhMesta.trim();
        localStorage.setItem('kiosk_geo_name', cfgCityName);
        if (typeof fetchWeatherData === 'function') fetchWeatherData();
        inicializujPlochuNastaveni();
    }
    resetSettingsTimer();
}
