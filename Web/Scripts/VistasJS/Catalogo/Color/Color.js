(function ($) {

    const ColorContainer = {
        Url: '/Colores',
        Index: $('#Index-Color'),
        Form: $('#Form-Color'),
        Table: $('#tblColor')
    };

    $(function () {
        loadColoresDataTable();

        $("#btnGuardarColor").click(guardarColor);
        $("#btnRegresarColor").click(ocultarFormulario);

        ColorContainer.Table.on('click', '.edit-button', function () {
            const id = $(this).data("id");
            cargarColor(id);
        });

        ColorContainer.Table.on('click', '.delete-button', function () {
            const id = $(this).data("id");
            eliminarColor(id);
        });
    });

    function loadColoresDataTable() {
        if ($.fn.DataTable.isDataTable(ColorContainer.Table)) {
            ColorContainer.Table.DataTable().destroy();
        }

        ColorContainer.Table.DataTable({
            ajax: {
                url: ColorContainer.Url + "/GetColores",
                type: 'POST',
                datatype: 'json',
                dataSrc: function (json) {
                    if (!json.status) {
                        Swal.fire('Error', json.errorMessage, 'error');
                        return [];
                    }
                    return json.data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Swal.fire('Error', 'Error al cargar los colores', 'error');
                }
            },
            columns: [
                { data: "Nombre" },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn btn-warning btn-sm edit-button" 
                                        data-id="${row.IdColor}"
                                        title="Editar Color">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" 
                                        data-id="${row.IdColor}"
                                        title="Eliminar Color">
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
                        limpiarFormulario();
                        mostrarFormulario();
                    }
                }
            ],
        });
    }

    function mostrarFormulario() {
        ColorContainer.Index.hide();
        ColorContainer.Form.show();
    }

    function ocultarFormulario() {
        limpiarFormulario();
        ColorContainer.Form.hide();
        ColorContainer.Index.show();
    }

    function cargarColor(id) {
        $.ajax({
            url: ColorContainer.Url + '/GetColorById',
            type: 'POST',
            data: { idColor: id },
            success: function (response) {
                if (response.status) {
                    console.log(response.data);
                    $('#idColor').val(response.data.IdColor);
                    $('#inputNombreColor').val(response.data.Nombre);
                    mostrarFormulario();
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'Error al cargar el color', 'error');
            }
        });
    }

    function guardarColor(e) {
        e.preventDefault();

        var nombreColor = $.trim($('#inputNombreColor').val());
        if (nombreColor.length < 3) {
            Swal.fire('Error', 'El nombre del color debe tener al menos 3 caracteres.', 'error');
            return;
        }

        var color = {
            IdColor: $('#idColor').val(),
            Nombre: nombreColor
        };

        var esNuevoColor = !color.IdColor;
        var url = ColorContainer.Url + (esNuevoColor ? '/CreateColor' : '/UpdateColor');

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
                    data: JSON.stringify(color),
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Guardado', 'Color guardado exitosamente.', 'success');
                            ocultarFormulario();
                            loadColoresDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al guardar el color', 'error');
                    }
                });
            }
        });
    }

    function eliminarColor(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar este color?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: ColorContainer.Url + '/DeleteColor',
                    type: 'POST',
                    data: { idColor: id },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Eliminado', 'Color eliminado exitosamente.', 'success');
                            loadColoresDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al eliminar el color', 'error');
                    }
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#frmColor')[0].reset();
        $('#idColor').val('');
    }

})(jQuery);