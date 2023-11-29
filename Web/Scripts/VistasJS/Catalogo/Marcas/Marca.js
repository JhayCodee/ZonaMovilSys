(function ($) {

    const MarcaContainer = {
        Url: '/Marca',
        Index: $('#Index-Marca'),
        Form: $('#Form-Marca'),
        Table: $('#tblMarca')
    };

    $(function () {
        loadMarcasDataTable();

        $("#btnGuardarMarca").click(guardarMarca);
        $("#btnRegresarMarca").click(ocultarFormulario);

        MarcaContainer.Table.on('click', '.edit-button', function () {
            const id = $(this).data("id");
            cargarMarca(id);
        });

        MarcaContainer.Table.on('click', '.delete-button', function () {
            const id = $(this).data("id");
            eliminarMarca(id);
        });
    });

    function loadMarcasDataTable() {
        if ($.fn.DataTable.isDataTable(MarcaContainer.Table)) {
            MarcaContainer.Table.DataTable().destroy();
        }

        MarcaContainer.Table.DataTable({
            ajax: {
                url: MarcaContainer.Url + "/GetMarcas",
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
                    Swal.fire('Error', 'Error al cargar las marcas', 'error');
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
                                        data-id="${row.IdMarca}"
                                        title="Editar Marca">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" 
                                        data-id="${row.IdMarca}"
                                        title="Eliminar Marca">
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
        MarcaContainer.Index.hide();
        MarcaContainer.Form.show();
    }

    function ocultarFormulario() {
        limpiarFormulario();
        MarcaContainer.Form.hide();
        MarcaContainer.Index.show();
    }

    function cargarMarca(id) {
        $.ajax({
            url: MarcaContainer.Url + '/GetMarcaById',
            type: 'POST',
            data: { idMarca: id },
            success: function (response) {
                if (response.status) {
                    $('#idMarca').val(response.data.IdMarca);
                    $('#inputNombreMarca').val(response.data.Nombre);
                    mostrarFormulario();
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'Error al cargar la marca', 'error');
            }
        });
    }

    function guardarMarca(e) {
        e.preventDefault();

        var nombreMarca = $.trim($('#inputNombreMarca').val());
        if (nombreMarca.length < 3) {
            Swal.fire('Error', 'El nombre de la marca debe tener al menos 3 caracteres.', 'error');
            return;
        }

        var marca = {
            IdMarca: $('#idMarca').val(),
            Nombre: nombreMarca
        };

        var esNuevaMarca = !marca.IdMarca;
        var url = MarcaContainer.Url + (esNuevaMarca ? '/CreateMarca' : '/UpdateMarca');

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
                    data: JSON.stringify(marca),
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Guardado', 'Marca guardada exitosamente.', 'success');
                            ocultarFormulario();
                            loadMarcasDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al guardar la marca', 'error');
                    }
                });
            }
        });
    }

    function eliminarMarca(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar esta marca?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: MarcaContainer.Url + '/DeleteMarca',
                    type: 'POST',
                    data: { idMarca: id },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Eliminado', 'Marca eliminada exitosamente.', 'success');
                            loadMarcasDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al eliminar la marca', 'error');
                    }
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#frmMarca')[0].reset();
        $('#idMarca').val('');
    }

})(jQuery);
