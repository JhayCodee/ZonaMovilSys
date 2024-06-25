document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const modoToggle = document.getElementById('modoToggle');
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');

    const modos = {
        claro: 'modo-claro',
        oscuro: 'modo-oscuro'
    };

    const fontSizes = ['font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge'];
    let currentFontSizeIndex = 1; // Índice inicial para tamaño de fuente medio

    const cambiarModo = () => {
        if (body.classList.contains(modos.claro)) {
            body.classList.remove(modos.claro);
            body.classList.add(modos.oscuro);
            localStorage.setItem('modo', 'oscuro');
        } else {
            body.classList.remove(modos.oscuro);
            body.classList.add(modos.claro);
            localStorage.setItem('modo', 'claro');
        }
    };

    const ajustarTamañoFuente = (incremento) => {
        currentFontSizeIndex += incremento;
        if (currentFontSizeIndex < 0) {
            currentFontSizeIndex = 0;
        } else if (currentFontSizeIndex > fontSizes.length - 1) {
            currentFontSizeIndex = fontSizes.length - 1;
        }

        fontSizes.forEach((size, index) => {
            body.classList.remove(size);
        });

        body.classList.add(fontSizes[currentFontSizeIndex]);
        localStorage.setItem('fontSize', fontSizes[currentFontSizeIndex]);
    };

    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado) {
        body.classList.add(modoGuardado === 'oscuro' ? modos.oscuro : modos.claro);
    } else {
        body.classList.add(modos.claro);
    }

    const fontSizeGuardado = localStorage.getItem('fontSize');
    if (fontSizeGuardado) {
        body.classList.add(fontSizeGuardado);
        currentFontSizeIndex = fontSizes.indexOf(fontSizeGuardado);
    } else {
        body.classList.add('font-size-medium');
    }

    modoToggle.addEventListener('click', cambiarModo);
    fontIncrease.addEventListener('click', () => ajustarTamañoFuente(1));
    fontDecrease.addEventListener('click', () => ajustarTamañoFuente(-1));
});
