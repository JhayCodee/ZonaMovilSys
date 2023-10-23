(function ($) {

    let isUpdate = false;
    let activeValue = true;

    $(function () {
      
        showTableUsers();
        loadRoles();

        $('#backUsers').on('click', () => {
            $("#UserForm")[0].reset();
            UsersContainer.Form.hide();
            UsersContainer.Index.show();
        });

        $tblUsers.on('click', '.edit-button', function () {
            let userId = $(this).data('id');
            activeValue = $(this).data("activo");
            isUpdate = true;
            $('#Contrasena').hide();
            $('#lblPass').hide();


            $.ajax({
                type: "POST",
                url: UsersContainer.Url + "/GetUserById",
                data: { userId: userId },
                dataType: "json",
                success: function (response) {
                    if (response.status && response.data) {
                        fillUserData(response.data);
                        UsersContainer.Index.hide();
                        UsersContainer.Form.show();
                    } else {
                        // Muestra un mensaje de error si algo va mal.
                        alert("Error: " + response.errorMessage);
                    }
                },
                error: function (error) {
                    alert("Error al conectar con el servidor.");
                }
            });
        });

        $tblUsers.on('click', '.activate-button', function () {
            let userId = $(this).data('id');

            swal.fire({
                title: '¿Estás seguro?',
                text: "¿Quieres activar este usuario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, ¡activar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post(UsersContainer.Url + "/ActivateUser", { userId: userId }, function (response) {
                        if (response.status) {
                            swal.fire(
                                '¡Activado!',
                                'El usuario ha sido activado con éxito.',
                                'success'
                            ).then(() => {
                                showTableUsers();
                            });
                        } else {
                            swal.fire('Error', response.errorMessage, 'error');
                        }
                    });
                }
            });
        });

        $tblUsers.on('click', '.delete-button', function () {
            let userId = $(this).data('id');

            swal.fire({
                title: '¿Estás seguro?',
                text: "¿Quieres eliminar este usuario?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, ¡eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.post(UsersContainer.Url + "/DeleteUser", { userId: userId }, function (response) {
                        if (response.status) {
                            swal.fire(
                                '¡Eliminado!',
                                'El usuario ha sido eliminado con éxito.',
                                'success'
                            ).then(() => {
                                showTableUsers();
                            });
                        } else {
                            swal.fire('Error', response.errorMessage, 'error');
                        }
                    });
                }
            });
        });


        $("#saveUser").click(function (e) {
            e.preventDefault();

            if ($("#UserForm").valid()) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Confirma para guardar los cambios.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        getUserData();  
                    }
                });
            }
        });


    });

    const UsersContainer = {
        Url: '/Usuarios',
        Index: $('#Index-User'),
        Form: $('#Form-User')
    };

    const $tblUsers = $('#tblUsers');

    function showTableUsers() {

        if ($.fn.DataTable.isDataTable($tblUsers))
            $tblUsers.DataTable().destroy();

        $tblUsers.DataTable({
            ajax: {
                url: UsersContainer.Url + "/GetUsers",
                type: 'POST',
                datatype: 'json',
                dataSrc: function (json) {
                    if (!json.status) {
                        return [];
                    }
                    return json.data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(textStatus, errorThrown);
                }
            },
            columns: [
                { data: "NombreUsuario" },
                { data: "Rol" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `${row.Nombre} ${row.Apellidos}`;
                    }
                },
                { data: "Correo" },
                {
                    data: null,
                    render: function (data, type, row) {
                        if (row.Activo) {

                            return '<span class="badge bg-label-success">Activo</span>';
                        } else {
                            return '<span class="badge bg-label-danger">Inactivo</span>';
                        }
                    }
                },
                {
                    data: null,
                    width: "20%",
                    render: function (data, type, row) {
                        let buttons = `
                                    <div class="d-flex justify-content-center gap-2">
                                        <button class="btn btn-warning btn-sm edit-button" 
                                                data-id="${row.IdUsuario}" 
                                                data-rol="${row.NombreRol}"
                                                data-activo="${row.Activo}"
                                                title="Editar Usuario">
                                            <i class='bx bx-edit'></i>
                                        </button>
                        `;

                        if (row.Activo) {
                            buttons += `
                                        <button class="btn btn-danger btn-sm delete-button" 
                                                data-id="${row.IdUsuario}"
                                                title="Eliminar Usuario">
                                            <i class='bx bx-trash'></i>
                                        </button>
                             `;
                        } else { 
                            buttons += `
                                        <button class="btn btn-success btn-sm activate-button" 
                                                data-id="${row.IdUsuario}"
                                                title="Activar Usuario">
                                            <i class='bx bx-check-circle'></i>
                                        </button>
                            `;
                        }

                        buttons += `</div>`;
                        return buttons;
                    }
                }
            ],
            buttons: [
                {
                    text: 'Nuevo',
                    className: 'btn btn-primary',
                    action: function (e, dt, node, config) {
                        UsersContainer.Index.hide();
                        UsersContainer.Form.show();
                        $('#Contrasena').show();
                        $('#lblPass').show();
                        $('#IdRol').val(null).trigger('change');
                        isUpdate = false;
                    }
                }
            ]
        });
    }

    function loadRoles() {
        $.ajax({
            type: "POST",
            url: UsersContainer.Url + "/GetRoles", 
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    $.each(response.data, function (index, item) {
                        $("#IdRol").append($("<option></option>").val(item.Id).text(item.Value));
                    });
                } else {
                    alert("Error al cargar los roles: " + response.errorMessage);
                }
            },
            error: function (error) {
                alert("Error al conectar con el servidor.");
            }
        });
    }

    function getUserData() {

        if (isUpdate) {
            activoValue = activeValue;
        }
        else {
            activoValue = true;
        }

        const User = {
            IdUsuario: $('#IdUsuario').val(),
            Nombre: $('#Nombre').val(),
            Apellidos: $('#Apellidos').val(),
            NombreUsuario: $('#NombreUsuario').val(),
            Correo: $('#Correo').val(),
            Contrasena: $('#Contrasena').val(),
            IdRol: $('#IdRol').val(),
            Activo: activoValue
        }

        console.log(User);

        // Determinar la URL basándose en la bandera isUpdate
        let requestUrl = isUpdate ? UsersContainer.Url + "/UpdateUser" : UsersContainer.Url + "/CreateUser";

        // Mostrar loader
        Swal.fire({
            title: 'Guardando...',
            html: 'Por favor espera',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Enviar solicitud AJAX
        $.ajax({
            type: "POST",
            url: requestUrl,
            data: User,
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        title: '¡Guardado con éxito!',
                        text: 'Los cambios han sido guardados.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Limpiar formulario y otras operaciones después de guardar
                        isUpdate = false;
                        $("#UserForm")[0].reset();
                        UsersContainer.Form.hide();
                        UsersContainer.Index.show();
                        showTableUsers();
                    });
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function (error) {
                Swal.fire('Error', 'Error al conectar con el servidor.', 'error');
            }
        });
    }

    function fillUserData(user) {

        $('#IdUsuario').val(user.IdUsuario);
        $('#Nombre').val(user.Nombre);
        $('#Apellidos').val(user.Apellidos);
        $('#NombreUsuario').val(user.NombreUsuario);
        $('#Correo').val(user.Correo);
        $('#Contrasena').val(user.Contrasena);
        $('#IdRol').val(user.IdRol).trigger('change');
    }


})(jQuery);
