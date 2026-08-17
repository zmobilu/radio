
const DATABASE = [
    { id: "slovensko", name: "Slovensko", url: "https://icecast.stv.livebox.sk/slovensko_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoSRo.png", style: "background:#00547E;", category: "Verejnoprávne" },
    { id: "fm", name: "Rádio_FM", url: "https://icecast.stv.livebox.sk/fm_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioFM.png", style: "background:#111;", category: "Verejnoprávne" },
    { id: "regina", name: "Regina", url: "https://icecast.stv.livebox.sk/regina-ba_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioReginaZ.png", style: "background:#111;", category: "Verejnoprávne" },
    { id: "devin", name: "Devín", url: "https://icecast.stv.livebox.sk/devin_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioDevin.png", style: "background:#111;", category: "Verejnoprávne" },
    { id: "junior", name: "Junior", url: "https://icecast.stv.livebox.sk/junior_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioJunior.png", style: "background:#111;", category: "Verejnoprávne" },
    { id: "litera", name: "Litera", url: "https://icecast.stv.livebox.sk/litera_128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioLitera.png", style: "background:#111;", category: "Verejnoprávne" },
    
    { id: "fun", name: "Fun Radio", url: "https://stream.funradio.sk/fun192.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoFunRadio.png", style: "background:#fff;", category: "Fun Kontajner" },
    { id: "funchill", name: "Fun Chill", url: "https://stream.funradio.sk/chill128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoFunChill.png", style: "background:#111;", category: "Fun Kontajner" },
    { id: "fun8090", name: "Fun 80-90", url: "https://stream.funradio.sk/80-90-128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoFun8090.png", style: "background:#111;", category: "Fun Kontajner" },
    { id: "funczsk", name: "Fun CZ-SK", url: "https://stream.funradio.sk/cs128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoFunCZSK.png", style: "background:#111;", category: "Fun Kontajner" },
    { id: "milenialky", name: "Milenialky", url: "https://stream.funradio.sk/milenialky128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoFun2000.png", style: "background:#111;", category: "Fun Kontajner" },
    
    { id: "rock", name: "Radio rock", url: "https://stream.bauermedia.sk/rock-hi.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoAntenaROCK.png", style: "background:#000000;", category: "Komerčné & Ostatné" },
    { id: "blanik", name: "Blaník", url: "https://ice.abradio.cz/blanikcz128.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoBlanik.png", style: "background:#005ea6;", category: "Komerčné & Ostatné" },
    { id: "expres", name: "Expres", url: "https://stream.bauermedia.sk/expres-hi.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoExpress.png", style: "background:#111;", category: "Komerčné & Ostatné" },
    { id: "europa2", name: "Europa 2", url: "https://stream.bauermedia.sk/europa2-hi.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoEuropa2.png", style: "background:#111;", category: "Komerčné & Ostatné" },
    { id: "melody", name: "Melody", url: "https://stream.bauermedia.sk/melody-hi.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoMelody.png", style: "background:#111;", category: "Komerčné & Ostatné" },
    { id: "vlna", name: "Rádio Vlna", url: "https://stream.radiovlna.sk/vlna-hi.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoVlna.png", style: "background:#111;", category: "Komerčné & Ostatné" },
    { id: "topolcany", name: "Rádio TO", url: "https://stream.radioto.sk:8443/radioto.mp3", img: "https://raw.githubusercontent.com/zmobilu/assets/main/LogoRadioTO.png", style: "background:#111;", category: "Komerčné & Ostatné" },
    
    { id: "S-techno", name: "Techno", url: "https://stream.sunshine-live.de/techno/mp3-192/", icon: "fa-solid fa-bolt", color: "#307CEB", style: "background:#111;", category: "Techno scéna" },
    { id: "schranz", name: "Schranz", url: "https://stream.sunshine-live.de/schranz/mp3-192/", icon: "fa-solid fa-triangle-exclamation", color: "#fff", style: "background:#111;", category: "Techno scéna" },
    { id: "melodic", name: "Melodic Beats", url: "https://stream.sunshine-live.de/melodic_beats/mp3-192/", icon: "fa-solid fa-wave-square", color: "#fff", style: "background:#111;", category: "Techno scéna" },
    { id: "h-techno", name: "Hard Techno", url: "https://stream.sunshine-live.de/hardtechno/mp3-192", icon: "fa-solid fa-circle-radiation", color: "#fff", style: "background:#111;", category: "Techno scéna" },
    { id: "Drumcode", name: "Drumcode", url: "https://stream.sunshine-live.de/drumbass/mp3-192", icon: "fa-solid fa-volume-high", color: "#fff", style: "background:#111;", category: "Techno scéna" },
    
    { id: "spotify", name: "Spotify", url: "https://open.spotify.com", icon: "fa-brands fa-spotify", color: "#1DB954", style: "background:#111;", category: "Externé Aplikácie" },
    { id: "applemusic", name: "Apple Music", url: "https://music.apple.com", icon: "fa-solid fa-music", color: "#FA243C", style: "background:#111;", category: "Externé Aplikácie" },
    { id: "youtube", name: "YT Music", url: "https://music.youtube.com", icon: "fa-brands fa-youtube", color: "#FF0000", style: "background:#111;", category: "Externé Aplikácie" },
    { id: "tidal", name: "Tidal", url: "https://tidal.com", icon: "fa-solid fa-wave-square", color: "#00FFFF", style: "background:#111;", category: "Externé Aplikácie" },
    { id: "soundcloud", name: "SoundCloud", url: "https://soundcloud.com", icon: "fa-brands fa-soundcloud", color: "#FF5500", style: "background:#111;", category: "Externé Aplikácie" },

    { id: "sp1", name: "Ach TucTuc", embedUrl: "https://open.spotify.com/embed/playlist/1mv2iWdWfEfffZfa8kOBFs?utm_source=generator", icon: "fa-brands fa-spotify", color: "#1DB954", style: "background:#111;", category: "Súkromne playlisty" }, 
    { id: "sp2", name: "Ah Rock", embedUrl: "https://open.spotify.com/embed/playlist/2xLrXn0HleL3pJvnRWnRcJ?utm_source=generator", icon: "fa-brands fa-spotify", color: "#1DB954", style: "background:#111;", category: "Súkromne playlisty" }
];

const RODINA = ['Dominik', 'Janka', 'Patrik', 'Martin', 'Andrea', 'Roman', 'Emília', 'Ján', 'Mária', 'Juraj', 'Tatiana', 'Rastislav', 'Viktor', 'Adela', 'Linda', 'Michal', 'Ondrej', 'Jana', 'Viliam', 'Nataša', 'Kristína', 'Tibor', 'Ema'];
const KOLEGOVIA = ['Ivana', 'Mária', 'Iveta', 'Nina', 'Adriana', 'Jaroslava', 'Eva', 'Jana', 'Jozef', 'Marcel', 'Karol', 'Anna', 'Petra', 'Dominika'];
const SPOLUZIACI = ['Claudia', 'Bibiana','Zuzana', 'Kristína','Hana', 'Amanda','Viktória', 'Karin','Alexandra', 'Vanesa','Tamara', 'Zoe','Ela', 'Ema','Sebastian', 'Barbora','Jakub', 'Paulína', 'Timothy', 'Maximilián','Adam', 'Milica','Alica', 'Linda', 'Róbert', 'Daniel','Laura', 'Lili', 'Oskar', 'Tomáš','Samuel','Maxim','Alex','Erik','Oliver'];
const MOJE_MENA = ['Peter', 'Lenka', 'Daniel', 'Hana', 'Lucia', 'Katarína', 'Andrej', 'Zuzana', 'Radoslav', 'Martina', 'Róbert', 'Milan', 'Juraj', 'Ladislav', 'Pavol']; 

const VOLUME_MAP = { 'slovensko': 0.5, 'fm': 0.5, 'devin': 0.5, 'litera': 0.5, 'junior': 0.5, 'regina': 0.5, 'rock': 0.5, 'fun': 1.0, 'funchill': 0.5, 'funczsk': 0.5, 'fun8090': 0.5, 'milenialky': 0.5, 'expres': 1.0, 'europa2': 1.0, 'melody': 1.0, 'vlna': 1.0, 'blanik': 0.5, 'topolcany': 0.5, 'h-techno': 1.0 };
