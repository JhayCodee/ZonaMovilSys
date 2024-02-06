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
                                </button>`;
                        } else if (row.Estado === 0) { // En reparación
                            return `
                                <button class="btn btn-success btn-sm entregar-garantia-button" 
                                        data-id="${row.IdGarantia}" title="Entregar Garantía">
                                    <i class='bx bx-check-circle'></i>
                                </button>`;
                        }
                        else if (row.Estado === 3) {
                            return '<span class="badge bg-label-secondary">Entregado</span>';
                        }
                        else if ( row.Estado === 2) {
                            return '<span class="badge bg-label-danger">Vencido</span>';
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