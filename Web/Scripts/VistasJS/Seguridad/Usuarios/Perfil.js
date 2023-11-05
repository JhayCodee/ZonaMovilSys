$(document).ready(function () {

    $('.btn-menu').on('click', function () {
        $('#Form-User, #Form-Password').hide();

        $('.btn-menu').removeClass('active');
        $(this).addClass('active');

        var targetForm = $(this).data('target');
        $(targetForm).fadeIn();
    });

    // Activa y muestra por defecto el formulario de "Editar información personal"
    $('.btn-menu[data-target="#Form-User"]').trigger('click');

    loadUserData();

    $("#guardarInfoPerfil").on('click', function (e) {
        e.preventDefault();

        if ($("#UserForm").valid()) { // Verificar que el formulario es válido
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Quieres guardar la información?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Introduce tu contraseña',
                        input: 'password',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Enviar',
                        showLoaderOnConfirm: true,
                        preConfirm: (password) => {
                            if (!password) {
                                Swal.showValidationMessage('La contraseña no puede estar vacía.');
                                return;
                            }
                            return password;
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    }).then((passwordResult) => {
                        if (passwordResult.value) {

                            // Construyendo el objeto usuario basado en el modelo Usuario_VM
                            var usuario = {
                                IdUsuario: parseInt($('#IdUsuario').val()),
                                Nombre: $.trim($('#Nombre').val()),
                                Apellidos: $.trim($('#Apellidos').val()),
                                NombreUsuario: $.trim($('#NombreUsuario').val()),
                                Correo: $.trim($('#Correo').val()),
                                Activo: true,
                                IdRol: parseInt($('#IdRol').val()),
                                Contrasena: passwordResult.value 
                            };

                            $.ajax({
                                url: '/Usuarios/UpdateUserInfo', 
                                method: 'POST',
                                data: JSON.stringify(usuario),
                                contentType: "application/json; charset=utf-8",
                                dataType: 'json',
                                success: function (response) {
                                    if (response.status) {
                                        Swal.fire({
                                            title: 'Guardado',
                                            text: 'La información ha sido guardada.',
                                            icon: 'success'
                                        }).then(() => {
                                            location.reload(); 
                                        });
                                    } else {
                                        Swal.fire('Error', 'Error al guardar la información: ' + response.errorMessage, 'error');
                                    }
                                },
                                error: function () {
                                    Swal.fire('Error', 'Error al hacer la petición al servidor.', 'error');
                                }
                            });
                        }
                    });
                }
            });
        }

    });

    $("#guardarPassPerfil").on('click', function (e) {
        e.preventDefault();

        if ($("#PasswordForm").valid()) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Quieres cambiar la contraseña?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    // Construyendo el objeto para la solicitud AJAX
                    var currentPassword = $('#CurrentPassword').val();
                    var newPassword = $('#NewPassword').val();
                    var confirmNewPassword = $('#ConfirmPassword').val();
                    var idPass = parseInt($('#IdUsuario').val());

                    $.ajax({
                        url: '/Usuarios/UpdateUserPassword',
                        method: 'POST',
                        data: {
                            currentPassword: currentPassword,
                            newPassword: newPassword,
                            confirmNewPassword: confirmNewPassword,
                            userId: idPass
                        },
                        dataType: 'json',
                        success: function (response) {
                            if (response.status) {

                                Swal.fire({
                                    title: 'Cambiada',
                                    text: 'La contraseña ha sido cambiada exitosamente.',
                                    icon: 'success'
                                }).then(() => {
                                    $('#CurrentPassword').val('');
                                    $('#NewPassword').val('');
                                    $('#ConfirmPassword').val('');
                                });

                            } else {
                                Swal.fire('Error', 'Error al cambiar la contraseña: ' + response.errorMessage, 'error');
                            }
                        },
                        error: function () {
                            Swal.fire('Error', 'Error al hacer la petición al servidor.', 'error');
                        }
                    });
                }
            });
        }
    });

});


function loadUserData() {
    var userId = $('#IdUsuario').val();

    $.ajax({
        url: '/Usuarios/GetUserById',
        method: 'POST',
        data: { userId: userId },
        dataType: 'json',
        success: function (response) {
            if (response.status) {
                var user = response.data;
                $('#Nombre').val(user.Nombre);
                $('#Apellidos').val(user.Apellidos);
                $('#NombreUsuario').val(user.NombreUsuario);
                $('#Correo').val(user.Correo);
            } else {
                alert('Error al cargar la información del usuario: ' + response.errorMessage);
            }
        },
        error: function () {
            alert('Error al hacer la petición al servidor.');
        }
    });
}