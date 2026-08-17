async function loadComponent(targetId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Nepodarilo sa načítať modul ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        const element = document.getElementById(targetId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Chyba pri spájaní modulu [${filePath}]:`, error);
    }
}
