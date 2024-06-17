(function ($) {

    const GarantiaContainer = {
        Url: '/Garantias',
        Index: $('#Index-Garantia'),
        Form: $('#Form-Garantia'),
        Table: $('#tblGarantia')
    };

    $(function () {
        loadGarantiaDataTable();
    });

    function loadGarantiaDataTable() {
        if ($.fn.DataTable.isDataTable(GarantiaContainer.Table)) {
            GarantiaContainer.Table.DataTable().destroy();
        }

        GarantiaContainer.Table.DataTable({
            ajax: {
                url: GarantiaContainer.Url + "/GetGarantias",
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
                { data: "NumeroFactura" },
                { data: "Cliente" },
                { data: "NombreProducto" },
                { data: "IMEI" },
                {
                    data: "FechaFin",
                    render: function (data, type, row) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        if (row.Estado == 1) {
                            return '<span class="badge bg-label-success">Activo</span>';
                        }
                        else if (row.Estado == 0) {
                            return '<span class="badge bg-label-warning">Reparación</span>';
                        }
                        else if (row.Estado == 3) {
                            return '<span class="badge bg-label-secondary">Reparado</span>';
                        }
                        else if (row.Estado === 2) {
                            return '<span class="badge bg-label-danger">Vencido</span>';
                        }
                    }
                },
                {
                    data: "FechaEstimadaEntrega",
                    render: function (data, type, row) {
                        if (data) {
                            return moment(data).format('DD/MM/YYYY');
                        } else {
                            return '';
                        }
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        if (row.Estado === 1) { // Estado activo
                            return `
                                <button class="btn btn-warning btn-sm reclamar-garantia-button" 
                                        data-id="${row.IdGarantia}" title="Reclamar Garantía">
                                    <i class='bx bx-error'></i>
                                </button>
                                <button class="btn btn-danger btn-sm finalizar-garantia-button" 
                                        data-id="${row.IdGarantia}" title="Finalizar Garantía">
                                    <i class='bx bx-x-circle'></i>
                                </button>`;
                        } else if (row.Estado === 0) { // En reparación
                            return `
                                <button class="btn btn-success btn-sm entregar-garantia-button" 
                                        data-id="${row.IdGarantia}" title="Entregar Garantía">
                                    <i class='bx bx-check-circle'></i>
                                </button>`;
                        } else if (row.Estado === 3) { // Entregado
                            return `
                                <span class="badge bg-label-secondary">Entregado</span>
                                <button class="btn btn-primary btn-sm extender-garantia-button" 
                                        data-id="${row.IdGarantia}" title="Extender Garantía">
                                    <i class='bx bx-time-five'></i>
                                </button>`;
                        } else if (row.Estado === 2) { // Vencido
                            return `
                                    <span class="badge bg-label-danger">Vencido</span>
                                    <button class="btn btn-primary btn-sm extender-garantia-button"
                                        data-id="${row.IdGarantia}" title="Extender Garantía">
                                    <i class='bx bx-time-five'></i>
                                  `;
                        }
                    }
                }
            ],
            buttons: [
                {
                    text: '',
                    className: 'btn',
                    action: function (e, dt, node, config) {
                        limpiarFormulario();
                        mostrarFormulario();
                    }
                }
            ],
        });
    }

    // Función para mostrar el modal de reclamo de garantía
    function mostrarModalReclamoGarantia(idGarantia) {
        $('#btnReclamarGarantia').attr('data-id', idGarantia);
        $('#reclamarGarantiaModal').modal('show');
    }

    // Evento para el botón de reclamar garantía
    GarantiaContainer.Table.on('click', '.reclamar-garantia-button', function () {
        limpiarFormularioGarantia();
        var idGarantia = $(this).data('id');
        mostrarModalReclamoGarantia(idGarantia);
    });

    GarantiaContainer.Table.on('click', '.finalizar-garantia-button', function () {
        var idGarantia = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro?',
            text: "Está a punto de finalizar esta garantía.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: GarantiaContainer.Url + '/FinalizarGarantia', 
                    type: 'POST',
                    data: { idGarantia: idGarantia },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Realizado', 'La garantía ha sido finalizada.', 'success');
                            loadGarantiaDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire('Error', 'Ocurrió un error al intentar finalizar la garantía.', 'error');
                    }
                });
            }
        });
    });

    GarantiaContainer.Table.on('click', '.entregar-garantia-button', function () {
        var idGarantia = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro?',
            text: "Está a punto de entregar esta garantía.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, entregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: GarantiaContainer.Url + '/EntregarGarantia', 
                    type: 'POST',
                    data: { idGarantia: idGarantia },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Realizado', 'La garantía ha sido entregada.', 'success');
                            // Recargar la tabla o actualizar la fila correspondiente
                            loadGarantiaDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire('Error', 'Ocurrió un error al intentar entregar la garantía.', 'error');
                    }
                });
            }
        });
    });

    GarantiaContainer.Table.on('click', '.extender-garantia-button', function () {
        var idGarantia = $(this).data('id');
        var today = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD

        Swal.fire({
            title: 'Extender Garantía',
            html: `
            <div class="form-group">
                <label for="nuevaFechaFin" class="form-label">Ingrese la nueva fecha de fin:</label>
                <input type="date" id="nuevaFechaFin" class="form-control" min="${today}" required>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Extender',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const nuevaFechaFin = Swal.getPopup().querySelector('#nuevaFechaFin').value;
                if (!nuevaFechaFin || new Date(nuevaFechaFin) < new Date(today)) {
                    Swal.showValidationMessage('Debe ingresar una fecha válida que no sea menor a la fecha actual');
                    return false;
                }
                return $.ajax({
                    url: GarantiaContainer.Url + '/ExtenderGarantia',
                    type: 'POST',
                    data: { idGarantia: idGarantia, nuevaFechaFin: nuevaFechaFin },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Realizado', 'La garantía ha sido extendida.', 'success');
                            // Recargar la tabla o actualizar la fila correspondiente
                            loadGarantiaDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire('Error', 'Ocurrió un error al intentar extender la garantía.', 'error');
                    }
                });
            }
        });
    });
    $('#btnReclamarGarantia').on('click', function () {
        var idGarantia = $(this).data('id');
        var razonReclamo = $('#razonReclamo').val().trim();
        var fechaEstimadaEntrega = $('#fechaEstimadaEntrega').val();

        var isValid = true;

        // Validar Razón del Reclamo
        if (razonReclamo.length < 20) {
            $('#errorRazonReclamo').text('La razón del reclamo debe tener al menos 20 caracteres.').show();
            isValid = false;
        } else {
            $('#errorRazonReclamo').hide();
        }

        // Validar Fecha Estimada de Entrega
        if (!fechaEstimadaEntrega) {
            $('#errorFechaEstimadaEntrega').text('Por favor, ingrese una fecha estimada de entrega.').show();
            isValid = false;
        } else {
            $('#errorFechaEstimadaEntrega').hide();
        }

        if (isValid) {
            $('#reclamarGarantiaModal').modal('hide');

            // Confirmar acción de reclamo
            Swal.fire({
                title: '¿Está seguro?',
                text: "Está a punto de reclamar esta garantía.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, reclamar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí tu lógica para enviar los datos al backend
                    var garantia = {
                        IdGarantia: idGarantia,
                        RazonReclamo: razonReclamo,
                        FechaEstimadaEntrega: fechaEstimadaEntrega
                    };
                    $.post(GarantiaContainer.Url + '/ReclamarGarantia', garantia, function (response) {
                        if (response.status) {
                            Swal.fire('Realizado', 'La garantía ha sido reclamada.', 'success');
                            loadGarantiaDataTable();
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                        $('#reclamarGarantiaModal').modal('hide');
                    });
                }
            });
        }

    });

    function limpiarFormularioGarantia() {
        // Limpiar los campos del formulario
        $('#razonReclamo').val('');
        $('#fechaEstimadaEntrega').val('');

        // Ocultar mensajes de error
        $('#errorRazonReclamo').hide();
        $('#errorFechaEstimadaEntrega').hide();
    }

    function establecerFechaMinima() {
        var fechaActual = new Date().toISOString().split('T')[0];
        $('#fechaEstimadaEntrega').attr('min', fechaActual);
    }

    // Llamar a esta función cada vez que se abre el modal
    $('#reclamarGarantiaModal').on('show.bs.modal', function () {
        establecerFechaMinima();
    });


    GarantiaContainer.Table.on('click', '.entregar-garantia-button', function () {
        var idGarantia = $(this).data('id');

        Swal.fire({
            title: '¿Está seguro?',
            text: "Confirmar la entrega de la garantía.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, entregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.post(GarantiaContainer.Url + '/EntregarGarantia', { id: idGarantia }, function (response) {
                    if (response.status) {
                        Swal.fire('Completado', 'La garantía ha sido entregada.', 'success');
                        loadGarantiaDataTable();
                    } else {
                        Swal.fire('Error', response.errorMessage, 'error');
                    }
                });
            }
        });
    });


})(jQuery);