(function ($) {

    let isEditing = false;

    $(function () {
        loadClientsDataTable();

        $("#btnGuardarCliente").click(function (e) {
            e.preventDefault();

            if ($("#frmClientes").valid()) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Confirma para guardar los cambios.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveClient();
                    }
                });
            }
        });

        $('#tblClientes').on('click', '.edit-button', function () {
            isEditing = true;
            const id = $(this).data("id");

            $.ajax({
                url: '/Clientes/GetClienteById',
                type: 'POST',
                data: { idCliente: id },
                dataType: 'json',
                success: function (response) {
                    if (response.status && response.data) {
                        populateClientForm(response.data);
                        $('#Form-Clientes').show();
                        $('#Index-Clientes').hide();
                    } else {
                        Swal.fire('Error', response.errorMessage, 'error');
                    }
                },
                error: function (err) {
                    Swal.fire('Error', 'Error al obtener el cliente', 'error');
                }
            });
        });

        $('#tblClientes').on('click', '.delete-button', function () {
            const id = $(this).data("id");

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas eliminar este cliente?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/Clientes/DeleteCliente',
                        type: 'POST',
                        data: { idCliente: id },
                        success: function (response) {
                            if (response.status) {
                                Swal.fire('Eliminado', 'El cliente ha sido eliminado exitosamente.', 'success').then(() => {
                                    loadClientsDataTable();
                                });
                            } else {
                                Swal.fire('Error', `Error al eliminar: ${response.errorMessage}`, 'error');
                            }
                        },
                        error: function (err) {
                            Swal.fire('Error', 'Error al realizar la petición al servidor.', 'error');
                        }
                    });
                }
            });
        });

        $("#btnRegresarCliente").click(function (e) {
            $('#Form-Clientes').hide();
            $('#Index-Clientes').show();
            clearFormClient();
        });
    });

    function loadClientsDataTable() {
        var $tblClients = $('#tblClientes');

        if ($.fn.DataTable.isDataTable($tblClients)) {
            $tblClients.DataTable().destroy();
        }

        $tblClients.DataTable({
            ajax: {
                url: '/Clientes/GetClientesActivos',
                type: 'POST',
                datatype: 'json',
                dataSrc: function (json) {
                    if (!json.status) {
                        Swal.fire('Error', json.errorMessage, 'error');
                        return [];
                    }
                    return json.clientes;
                }
            },
            columns: [
                { data: "Nombres" },
                { data: "Apellidos" },
                { data: "Cedula" },
                { data: "Correo" },
                { data: "Telefono" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <div class="text-center gap-2">
                                <button class="btn btn-warning btn-sm edit-button" data-id="${row.IdCliente}" title="Editar Cliente">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" data-id="${row.IdCliente}" title="Eliminar Cliente">
                                    <i class='bx bx-trash'></i>
                                </button>
                            </div>`;
                    }
                }
            ],
            buttons: [
                {
                    text: 'Nuevo',
                    className: 'btn btn-primary',
                    action: function () {
                        isEditing = false;
                        $('#Index-Clientes').hide();
                        $('#Form-Clientes').show();
                    }
                }
            ],
            responsive: true
        });
    }

    function saveClient() {
        var client = {
            IdCliente: $("#idCliente").val() ? parseInt($("#idCliente").val()) : 0,
            Nombres: $.trim($("#inputNombres").val()),
            Apellidos: $.trim($("#inputApellidos").val()),
            Cedula: $.trim($("#inputCedula").val()),
            Correo: $.trim($("#inputCorreo").val()),
            Telefono: $.trim($("#inputTelefono").val()),
            IdDepartamento: $("#inputDepartamento").val()
        };

        var url = '/Clientes/' + (isEditing ? 'UpdateCliente' : 'CreateCliente');

        Swal.fire({
            title: 'Por favor espera',
            text: 'Guardando cliente...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        $.ajax({
            url: url,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(client),
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    Swal.fire('Éxito', 'Cliente guardado exitosamente', 'success').then(() => {
                        $('#Form-Clientes').hide();
                        $('#Index-Clientes').show();
                        clearFormClient();
                        loadClientsDataTable();
                    });
                } else {
                    Swal.fire('Error', response.errorMessage || 'Hubo un error al guardar el cliente', 'error');
                }
            },
            error: function (err) {
                Swal.fire('Error', 'Hubo un error al guardar el cliente', 'error');
            }
        });
    }

    function populateClientForm(client) {
        $("#idCliente").val(client.IdCliente);
        $("#inputNombres").val(client.Nombres);
        $("#inputApellidos").val(client.Apellidos);
        $("#inputCedula").val(client.Cedula);
        $("#inputCorreo").val(client.Correo);
        $("#inputTelefono").val(client.Telefono);
    }

    function clearFormClient() {
        // Resetear el formulario a valores iniciales
        $("#frmClientes")[0].reset();

        // Limpiar mensajes de error de jQuery Validate
        let validator = $("#frmClientes").validate();
        validator.resetForm();

        // Eliminar las clases 'is-invalid' si jQuery Validate las ha añadido
        $("#frmClientes").find('.is-invalid').removeClass('is-invalid');

        // Si estás utilizando Select2 o cualquier otro plugin que modifique los campos, también deberías restablecerlos
        $("#frmClientes .select2").val(null).trigger('change');
    }


})(jQuery);
