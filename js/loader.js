async function loadComponent(elementId, componentPath) {
    const container = document.getElementById(elementId);
    if (!container) return;

    try {
        const response = await fetch(componentPath);
        if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
        } else {
            console.error(`Chyba pri načítaní komponentu: ${componentPath}`);
        }
    } catch (error) {
        console.error(`Chyba pri spájaní súboru ${componentPath}:`, error);
    }
}
