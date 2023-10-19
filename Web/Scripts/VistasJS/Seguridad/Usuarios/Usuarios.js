(function ($) {

    $(function () {

        showTableUsers();
        loadRoles();

        $('#backUsers').on('click', () => {
            UsersContainer.Form.hide();
            UsersContainer.Index.show();
        });

        $("#saveUser").click(function (e) {
            e.preventDefault();  

            if ($("#UserForm").valid()) {
                getUserData();
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
                    console.log(json.data);
                    return json.data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(textStatus, errorThrown);
                }
            },
            columns: [
                { data: "NombreUsuario" },
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
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-warning btn-sm edit-button" data-id="${row.IdRol}" data-rol="${row.NombreRol}">
                                    <i class='bx bx-edit'></i>
                                </button>
                            </div>
                        `;
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

        const User = {
            IdUsuario: $('#IdUsuario').val(),
            Nombre: $('#Nombre').val(),
            Apellidos: $('#Apellidos').val(),
            NombreUsuario: $('#NombreUsuario').val(),
            Correo: $('#Correo').val(),
            IdRol: $('#IdRol').val(),
        }

        console.log(User);
    }

})(jQuery);
