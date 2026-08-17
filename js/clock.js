function spustiVelkeHodiny() {
    function aktualizuj() {
        const now = new Date();
        let h = String(now.getHours()).padStart(2, '0');
        let m = String(now.getMinutes()).padStart(2, '0');

        let h_display = h;
        if (h[0] === '1') {
            h_display = `<span class="blue-digit">1</span>${h.substring(1)}`;
        } else if (h[0] === '2') {
            h_display = `<span class="red-digit">2</span>${h.substring(1)}`;
        }

        const hEl = document.getElementById('h-part-large');
        const mEl = document.getElementById('m-part-large');

        if (hEl) hEl.innerHTML = h_display;
        if (mEl) mEl.textContent = m;
    }

    aktualizuj();
    setInterval(aktualizuj, 1000);
}
