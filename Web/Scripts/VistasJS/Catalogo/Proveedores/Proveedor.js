(function ($) {

    // Configuración inicial
    const ProveedorContainer = {
        Url: '/Proveedores',
        Index: $('#Index-Proveedores'),
        Form: $('#Form-Proveedores')
    };

    $(function () {
        // Cargar DataTable al iniciar
        loadProveedoresDataTable();

        // Eventos de botones
        $("#btnGuardarProveedor").click(guardarProveedor);
        $("#btnRegresarProveedor").click(ocultarFormulario);

        $('#tblProveedores').on('click', '.edit-button', function () {
            const id = $(this).data("id");
            cargarProveedor(id);
        });

        $('#tblProveedores').on('click', '.delete-button', function () {
            const id = $(this).data("id");
            eliminarProveedor(id);
        });

        // Validación del formulario
        $("#frmProveedores").validate({
            rules: {
                inputNombre: {
                    required: true,
                    minlength: 3
                },
                inputTelefono: {
                    required: true,
                    digits: true,
                    minlength: 8,
                    maxlength: 8
                },
                inputCorreo: {
                    required: true,
                    email: true
                }
            },
            messages: {
                inputNombre: {
                    required: "El nombre es requerido.",
                    minlength: "El nombre debe tener al menos 3 caracteres."
                },
                inputTelefono: {
                    required: "El teléfono es requerido.",
                    digits: "Ingrese solo números.",
                    minlength: "El teléfono debe tener 8 dígitos.",
                    maxlength: "El teléfono debe tener 8 dígitos."
                },
                inputCorreo: {
                    required: "El correo es requerido.",
                    email: "Ingrese un correo válido."
                }
            }
        });
    });

    function loadProveedoresDataTable() {
        var $tblProveedores = $('#tblProveedores');

        if ($.fn.DataTable.isDataTable($tblProveedores)) {
            $tblProveedores.DataTable().destroy();
        }

        $tblProveedores.DataTable({
            ajax: {
                url: ProveedorContainer.Url + "/GetProveedores",
                type: 'POST',
                datatype: 'json',
                dataSrc: function (json) {
                    if (!json.status) {
                        Swal.fire('Error', json.errorMessage, 'error');
                        return [];
                    }
                    return json.data;
                }
            },
            columns: [
                { data: "Nombre" },
                { data: "Telefono" },
                { data: "Correo" },
                { data: "Direccion" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-warning btn-sm edit-button" 
                                        data-id="${row.IdProveedor}"
                                        title="Editar Proveedor">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" 
                                        data-id="${row.IdProveedor}"
                                        title="Eliminar Proveedor">
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
                    action: function (e, dt, node, config) {
                        mostrarFormulario();
                        limpiarFormulario();
                    }
                }
            ]
        });
    }

    function mostrarFormulario() {
        ProveedorContainer.Index.hide();
        ProveedorContainer.Form.show();
    }

    function ocultarFormulario() {
        limpiarFormulario();
        ProveedorContainer.Form.hide();
        ProveedorContainer.Index.show();
    }

    function cargarProveedor(id) {
        $.ajax({
            url: ProveedorContainer.Url + '/GetProveedorById',
            type: 'POST',
            data: { idProveedor: id },
            success: function (response) {
                if (response.status) {
                    $('#idProveedor').val(response.data.IdProveedor);
                    $('#inputNombre').val(response.data.Nombre);
                    $('#inputTelefono').val(response.data.Telefono);
                    $('#inputCorreo').val(response.data.Correo);
                    $('#inputDireccion').val(response.data.Direccion);
                    mostrarFormulario();
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'Error al cargar el proveedor', 'error');
            }
        });
    }

    function guardarProveedor(e) {
        e.preventDefault();

        // Validar el formulario antes de enviar la solicitud
        if (!$("#frmProveedores").valid()) return;

        var nombreTrimmed = $.trim($('#inputNombre').val());
        if (nombreTrimmed === '') {
            Swal.fire('Error', 'El campo Nombre no puede estar vacío o contener solo espacios en blanco.', 'error');
            return;
        }

        var proveedor = {
            IdProveedor: $('#idProveedor').val(),
            Nombre: $.trim($('#inputNombre').val()),
            Telefono: $.trim($('#inputTelefono').val()),
            Correo: $.trim($('#inputCorreo').val()),
            Direccion: $.trim($('#inputDireccion').val())
        };
        
        var esNuevoProveedor = !proveedor.IdProveedor;
        var url = ProveedorContainer.Url + (esNuevoProveedor ? '/CreateProveedor' : '/UpdateProveedor');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Confirma para guardar los cambios.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(proveedor),
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Guardado', 'Proveedor guardado exitosamente.', 'success');
                            ocultarFormulario();
                            loadProveedoresDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al guardar el proveedor', 'error');
                    }
                });
            }
        });
    }

    function eliminarProveedor(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar este proveedor?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: ProveedorContainer.Url + '/DeleteProveedor',
                    type: 'POST',
                    data: { idProveedor: id },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Eliminado', 'Proveedor eliminado exitosamente.', 'success');
                            loadProveedoresDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al eliminar el proveedor', 'error');
                    }
                });
            }
        });
    }

    function limpiarFormulario() {
        // Resetear el formulario a valores iniciales
        $('#frmProveedores')[0].reset();
        $('#idProveedor').val('');

        // Limpiar mensajes de error de jQuery Validate
        var validator = $("#frmProveedores").validate();
        validator.resetForm();

        // Eliminar las clases 'is-invalid' si jQuery Validate las ha añadido
        $("#frmProveedores").find('.is-invalid').removeClass('is-invalid');
    }


})(jQuery);
