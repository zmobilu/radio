async function loadComponent(targetId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Chyba pri načítaní ${filePath}: ${response.status}`);
        }
        const html = await response.text();
        const container = document.getElementById(targetId);
        if (container) {
            container.innerHTML = html;
        }
    } catch (err) {
        console.error(`Modul ${filePath} sa nepodarilo načítať:`, err);
    }
}
