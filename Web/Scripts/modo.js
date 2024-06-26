// modo.js
$(document).ready(function () {
    // Define una función para cambiar entre el modo claro y oscuro
    function cambiarModo() {
        var cuerpo = document.body;
        // Alternar clases para cambiar los estilos entre el modo claro y oscuro
        cuerpo.classList.toggle('modo-claro');
        cuerpo.classList.toggle('modo-oscuro');
    }

    // Agrega un evento de clic al icono para cambiar el modo
    $('#modoIcono').on('click', function () {
        cambiarModo();
    });
});