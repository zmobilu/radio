
// --- PREVENCIA USPANIA DISPLEJA (NoSleep) ---
const noSleep = new NoSleep();

document.addEventListener('click', function enableNoSleep() {
    noSleep.enable().then(() => { 
        console.log("WakeLock / NoSleep bol úspešne aktivovaný."); 
    }).catch(e => console.log("Čakám na prvý dotyk pre WakeLock:", e));
    document.removeEventListener('click', enableNoSleep);
}, false);


// --- CELOOBRAZOVKOVÝ REŽIM (FULLSCREEN) ---
function toggleFullscreenMode() {
    const doc = window.document;
    const docEl = doc.documentElement;
    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    const fsBtn = document.getElementById('fullscreenToggleBtn');
    const fsIcon = document.getElementById('fullscreenIcon');

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if (requestFullScreen) {
            requestFullScreen.call(docEl);
            if (fsBtn) fsBtn.classList.add('active');
            if (fsIcon) { fsIcon.classList.remove('fa-expand'); fsIcon.classList.add('fa-compress'); }
        }
    } else {
        if (cancelFullScreen) {
            cancelFullScreen.call(doc);
            if (fsBtn) fsBtn.classList.remove('active');
            if (fsIcon) { fsIcon.classList.remove('fa-compress'); fsIcon.classList.add('fa-expand'); }
        }
    }
}


// --- PRECHOD MEDZI VERZIAMI DASHBOARDU ---
function prejdiNaVerziu1() {
    localStorage.setItem('dashboard_version', 'v1');
    window.location.href = 'index.html';
}


// --- SPRIEVODCA APLIKÁCIOU (INTRO TOUR) ---
const tourKroky = [
    {
        element: "#favSidebarContainer",
        title: "📻 Obľúbené stanice",
        desc: "Kliknutím na rádio okamžite spustíte živý stream. Opätovným kliknutím ho vypnete."
    },
    {
        element: ".big-clock-time",
        title: "⏰ Hodiny a Nočný režim",
        desc: "Kliknutím na hodiny manuálne prepnete dashboard do šetriča/nočného režimu. Opätovným dotykom ho prebudíte."
    },
    {
        element: ".main-weather-container",
        title: "☀️ Počasie a Predpoveď",
        desc: "Kliknutím na sekciu počasia otvoríte podrobný hodinový graf. Názov mesta vás presmeruje na živú mapu Windy."
    },
    {
        element: "#settingsToggleBtn",
        title: "⚙️ Nastavenia & Prispôsobenie",
        desc: "Tu si môžete zmeniť farbu nočného režimu, nastaviť čas spánku alebo upraviť poradie staníc."
    }
];

let aktualnyKrokTour = 0;
let tourTimer = null;
let tourOdskratka = 6; 
let tourPocitadlo = tourOdskratka;

function spustiTourAkJePrvykrat() {
    if (!localStorage.getItem('kiosk_tour_done')) {
        localStorage.setItem('kiosk_tour_done', 'true');
        setTimeout(() => {
            const overlay = document.getElementById('tour-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
                aktualnyKrokTour = 0;
                zobrazKrokTour(0);
            }
        }, 1000);
    }
}

function zobrazKrokTour(index) {
    clearInterval(tourTimer);
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    if (index >= tourKroky.length) {
        ukonciTour();
        return;
    }

    const krok = tourKroky[index];
    const el = document.querySelector(krok.element);

    if (el) el.classList.add('tour-highlight');

    const badge = document.getElementById('tour-step-badge');
    const title = document.getElementById('tour-title');
    const desc = document.getElementById('tour-desc');

    if (badge) badge.textContent = `Krok ${index + 1} / ${tourKroky.length}`;
    if (title) title.textContent = krok.title;
    if (desc) desc.textContent = krok.desc;

    tourPocitadlo = tourOdskratka;
    aktualizujTextTlacidla(index);

    tourTimer = setInterval(() => {
        tourPocitadlo--;
        if (tourPocitadlo > 0) {
            aktualizujTextTlacidla(index);
        } else {
            clearInterval(tourTimer);
            dalsiKrokTour();
        }
    }, 1000);
}

function aktualizujTextTlacidla(index) {
    const btnNext = document.getElementById('tour-next-btn');
    if (!btnNext) return;
    
    if (index === tourKroky.length - 1) {
        btnNext.textContent = `Rozumiem (${tourPocitadlo}s)`;
    } else {
        btnNext.textContent = `Ďalej (${tourPocitadlo}s)`;
    }
}

function dalsiKrokTour() {
    clearInterval(tourTimer);
    aktualnyKrokTour++;
    if (aktualnyKrokTour < tourKroky.length) {
        zobrazKrokTour(aktualnyKrokTour);
    } else {
        ukonciTour();
    }
}

function ukonciTour() {
    clearInterval(tourTimer);
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    const overlay = document.getElementById('tour-overlay');
    if (overlay) overlay.style.display = 'none';
    localStorage.setItem('kiosk_tour_done', 'true');
}

function spustiTourZnova() {
    localStorage.removeItem('kiosk_tour_done');
    location.reload();
}
