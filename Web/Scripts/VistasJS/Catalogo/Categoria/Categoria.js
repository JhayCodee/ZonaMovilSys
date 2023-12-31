﻿(function ($) {

    // Configuración inicial
    const CategoriaContainer = {
        Url: '/Categorias',
        Index: $('#Index-Categoria'),
        Form: $('#Form-Categoria')
    };

    $(function () {
        // Cargar DataTable al iniciar
        loadCategoriasDataTable();

        // Eventos de botones
        $("#btnGuardarCategoria").click(guardarCategoria);
        $("#btnRegresarCategoria").click(ocultarFormulario);

        $('#tblCategoria').on('click', '.edit-button', function () {
            const id = $(this).data("id");
            cargarCategoria(id);
        });

        $('#tblCategoria').on('click', '.delete-button', function () {
            const id = $(this).data("id");
            eliminarCategoria(id);
        });
    });

    function loadCategoriasDataTable() {
        var $tblCategoria = $('#tblCategoria');

        if ($.fn.DataTable.isDataTable($tblCategoria)) {
            $tblCategoria.DataTable().destroy();
        }

        $tblCategoria.DataTable({
            ajax: {
                url: CategoriaContainer.Url + "/GetCategoria",
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
                    Swal.fire('Error', 'Error al cargar las categorías', 'error');
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
                                        data-id="${row.IdCategoria}"
                                        title="Editar Categoría">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" 
                                        data-id="${row.IdCategoria}"
                                        title="Eliminar Categoría">
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
                        CategoriaContainer.Index.hide();
                        limpiarFormulario();
                        CategoriaContainer.Form.show();
                    }
                }
            ]
        });
    }

    function mostrarFormulario() {
        CategoriaContainer.Index.hide();
        CategoriaContainer.Form.show();
    }

    function ocultarFormulario() {
        limpiarFormulario();
        CategoriaContainer.Form.hide();
        CategoriaContainer.Index.show();
    }

    function cargarCategoria(id) {
        $.ajax({
            url: CategoriaContainer.Url + '/GetCategoriaById',
            type: 'POST',
            data: { idCategoria: id },
            success: function (response) {
                if (response.status) {
                    $('#idCategoria').val(response.data.IdCategoria);
                    $('#inputNombre').val(response.data.Nombre);
                    mostrarFormulario();
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'Error al cargar la categoría', 'error');
            }
        });
    }

    function guardarCategoria(e) {
        e.preventDefault();

        var nombreCategoria = $.trim($('#inputNombre').val()); // Eliminando espacios en blanco al inicio y final

        // Validación del nombre de la categoría
        if (nombreCategoria.length < 3) {
            Swal.fire('Error', 'El nombre de la categoría debe tener al menos 3 caracteres.', 'error');
            return;
        }

        var categoria = {
            IdCategoria: $('#idCategoria').val(),
            Nombre: nombreCategoria
        };

        var esNuevaCategoria = !categoria.IdCategoria;
        var url = CategoriaContainer.Url + (esNuevaCategoria ? '/CreateCategoria' : '/UpdateCategoria');

        // Diálogo de confirmación antes de guardar
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
                    data: JSON.stringify(categoria),
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Guardado', 'Categoría guardada exitosamente.', 'success');
                            ocultarFormulario();
                            loadCategoriasDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al guardar la categoría', 'error');
                    }
                });
            }
        });
    }

    function eliminarCategoria(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar esta categoría?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: CategoriaContainer.Url + '/DeleteCategoria',
                    type: 'POST',
                    data: { idCategoria: id },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Eliminado', 'Categoría eliminada exitosamente.', 'success');
                            loadCategoriasDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'Error al eliminar la categoría', 'error');
                    }
                });
            }
        });
    }

    function limpiarFormulario() {
        $('#frmCategoria')[0].reset();
        $('#idCategoria').val('');
    }

})(jQuery);
