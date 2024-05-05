$(document).ready(function () {
    // Aplicar la mascarada al campo de cédula
    $('#inputCedula').mask('000-000000-0000A', {
        translation: {
            '0': { pattern: /[0-9]/ },
            'A': { pattern: /[A-Za-z]/, optional: true }
        },
        placeholder: "___-______-____A"
    });

    // Aplicar mascara de telefono
    $('#inputTelefono').mask('0000-0000', {
        translation: {
            '0': { pattern: /[0-9]/ }
        },
        placeholder: "____-____"
    });

    // Método personalizado para la validación de expresiones regulares
    $.validator.addMethod("regex", function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, "Por favor, verifique su entrada.");

    // Validaciones con jQuery Validation
    $('#frmClientes').validate({
        rules: {
            inputNombres: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputApellidos: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputCedula: {
                required: true,
                regex: /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Za-z]$/,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputCorreo: {
                required: true,
                regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,                
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputTelefono: {
                required: true,
                regex: /^[0-9]{4}-[0-9]{4}$/,              
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputDepartamento: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            inputNombres: {
                required: "Los nombres son obligatorios.",
                minlength: "Debe contener al menos 2 caracteres."
            },
            inputApellidos: {
                required: "Los apellidos son obligatorios.",
                minlength: "Debe contener al menos 2 caracteres."
            },
            inputCedula: {
                required: "La cédula es obligatoria.",
                regex: "Formato de cédula no válido."
            },
            inputCorreo: {
                required: "El correo es obligatorio.",
                email: "Debe ser una dirección de correo válida."
            },
            inputTelefono: {
                required: "El teléfono es obligatorio.",                
            },
            InputDepartamento: {
                required: "El departamento es obligatorio.",                
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.mb-3').append(error);
        },
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        }
    });
});
