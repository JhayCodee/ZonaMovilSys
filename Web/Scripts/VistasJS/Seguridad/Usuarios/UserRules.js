$(document).ready(function () {

    // Inicialización de jQuery Validation
    $("#UserForm").validate({
        rules: {
            Nombre: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            Apellidos: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            NombreUsuario: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            Correo: {
                required: true,
                email: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            IdRol: {
                required: true
            },
            Contrasena: {
                required: true,
                minlength: 5,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            Nombre: {
                required: "Por favor, ingresa tu nombre",
                minlength: "El nombre debe tener al menos 2 caracteres"
            },
            Apellidos: {
                required: "Por favor, ingresa tus apellidos",
                minlength: "Los apellidos deben tener al menos 2 caracteres"
            },
            NombreUsuario: {
                required: "Por favor, ingresa un nombre de usuario",
                minlength: "El nombre de usuario debe tener al menos 2 caracteres"
            },
            Correo: {
                required: "Por favor, ingresa tu correo electrónico",
                email: "Por favor, ingresa un correo electrónico válido"
            },
            IdRol: {
                required: "Por favor, selecciona un rol"
            },
            Contrasena: {
                required: "Por favor, ingresa una contraseña",
                minlength: "La contraseña debe tener al menos 5 caracteres" 
            }
        },
        submitHandler: function (form) {
            form.submit();
        }
    });
});