$(document).ready(function () {

    var contenedorTabla = $("#Venta-Index");
    var contenedorFormulario = $("#Venta-Form");

    // Inicializar DataTable
    var tblFacturasVenta = $('#tblFacturasVenta').DataTable({
        ajax: {
            url: '/Ventas/GetFacturas',
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
            { data: 'NumeroFactura' },
            {
                data: 'Fecha',
                render: function (data, type, row) {
                    return moment(data).format('DD/MM/YYYY'); // Formato de fecha deseado
                }
            },
            { data: 'Cliente' }, // Asegúrate de que este dato esté disponible
            { data: 'Subtotal' },
            { data: 'Impuesto' },
            { data: 'Total' },
            {
                data: null,
                render: function (data, type, row) {
                    if (row.Activo) {

                        return '<span class="badge bg-label-success">Activo</span>';
                    } else {
                        return '<span class="badge bg-label-danger">Anulada</span>';
                    }
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    let printButton = `<button class="btn btn-secondary btn-sm print-button"
                                 data-id="${row.IdFacturaVenta}"
                                 title="Imprimir Factura">
                          <i class='bx bx-printer'></i>
                      </button>`;

                    let actionButton = row.Activo
                        ? `<button class="btn btn-danger btn-sm delete-button" 
                                  data-id="${row.IdFacturaVenta}"
                                  title="Anular Factura">
                              <i class='bx bx-trash'></i>
                          </button>`
                        : `<button class="btn btn-info btn-sm info-button" 
                                  data-id="${row.IdFacturaVenta}"
                                  title="Ver Factura Anulada">
                              <i class='bx bx-info-circle'></i>
                          </button>`;

                    return `<div class="d-flex justify-content-center gap-2">${printButton} ${actionButton}</div>`;
                }
            }
        ],
        buttons: [
            {
                text: 'Nuevo',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    contenedorTabla.hide();
                    contenedorFormulario.show();
                    limpiarFormularioVenta();
                }
            }
        ]
    });

    $('#tblFacturasVenta').on('click', '.print-button', function () {
        var facturaId = $(this).data('id');
        $.ajax({
            url: '/Ventas/ImprimirFactura',
            type: 'GET',
            data: { id: facturaId },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                a.download = 'Factura.pdf';
                document.body.append(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        });
    });

    $('#tblFacturasVenta').on('click', '.info-button', function () {
        var facturaId = $(this).data('id');

        $.ajax({
            url: '/Ventas/GetDetalleAnulacion',  // Asegúrate de que la URL coincida con la ruta de tu controlador
            type: 'POST',
            data: { productId: facturaId },
            success: function (response) {
                if (response.status) {
                    // Usamos SweetAlert2 para mostrar la alerta
                    Swal.fire({
                        title: 'Factura Anulada',
                        html: `<p><strong>Razón:</strong> ${response.data.RazonAnulamiento}</p>
                               <p><strong>Fecha:</strong> ${moment(response.data.FechaAnulacion).format('DD/MM/YYYY')}</p>
                               <p><strong>Anulado por:</strong> ${response.data.Empleado}</p>`,
                        icon: 'info'
                    });

                } else {
                    // Manejo de errores
                    Swal.fire({
                        title: 'Error',
                        text: response.errorMessage,
                        icon: 'error'
                    });
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                // Manejo de error de la petición AJAX
                Swal.fire({
                    title: 'Error de petición',
                    text: thrownError,
                    icon: 'error'
                });
            }
        });
    });


    $('#tblFacturasVenta').on('click', '.delete-button', function () {
        var facturaId = $(this).data('id');

        Swal.fire({
            title: 'Anular Factura',
            text: 'Por favor, introduce la razón para anular la factura:',
            input: 'textarea',
            inputAttributes: {
                required: true,
                minlength: 10
            },
            showCancelButton: true,
            confirmButtonText: 'Anular',
            cancelButtonText: 'Cancelar',
            preConfirm: (razonAnulamiento) => {
                if (!razonAnulamiento || razonAnulamiento.trim().length < 10) {
                    Swal.showValidationMessage('Por favor, introduce una razón válida (mínimo 10 caracteres).');
                    return false;
                }
                return razonAnulamiento.trim();
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                $.ajax({
                    url: '/Ventas/AnularFactura',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: facturaId,
                        razonAnulamiento: result.value
                    },
                    success: function (response) {
                        if (response.status) {
                            Swal.fire('Anulada', 'La factura ha sido anulada.', 'success');
                            tblFacturasVenta.ajax.reload(); // Recargar la tabla
                        } else {
                            Swal.fire('Error', response.errorMessage, 'error');
                        }
                    },
                    error: function () {
                        Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
                    }
                });
            }
        });
    });


    // Evento de clic para agregar un producto
    $('#btnAgregarProducto').click(function () {
        var productId = $('#productoSelect').val();
        if (productId) {
            if (!productoYaAgregado(productId)) {
                obtenerInfoProducto(productId);
            } else {
                alert('Este producto ya ha sido agregado.');
            }
        } else {
            alert('Por favor, selecciona un producto.');
        }
    });

    // Evento para eliminar producto de la tabla
    $('#tblProductosSeleccionados').on('click', '.btn-eliminar-producto', function () {
        $(this).closest('tr').remove();
        actualizarTotales();
    });

    // Evento para actualizar la cantidad
    $('#tblProductosSeleccionados').on('change', '.cantidad-producto', function () {
        var cantidad = parseInt($(this).val());
        var maxStock = parseInt($(this).attr('max'));

        if (cantidad <= 0 || cantidad > maxStock) {
            alert('Cantidad no válida. Asegúrate de que no exceda el stock disponible.');
            $(this).val(1);
        }
        actualizarTotales();
    });

    // Eventos para los botones de más y menos
    $('#tblProductosSeleccionados').on('click', '.mas-producto', function () {
        var inputCantidad = $(this).closest('tr').find('.cantidad-producto');
        var cantidadActual = Number(inputCantidad.val());
        var maxStock = Number(inputCantidad.attr('max'));

        if (cantidadActual < maxStock) {
            inputCantidad.val(cantidadActual + 1);
            ajustarCamposIMEI($(this).closest('tr'), cantidadActual + 1);
        }
        actualizarTotales();
    });

    $('#tblProductosSeleccionados').on('click', '.menos-producto', function () {
        var inputCantidad = $(this).closest('tr').find('.cantidad-producto');
        var cantidadActual = Number(inputCantidad.val());

        if (cantidadActual > 1) {
            inputCantidad.val(cantidadActual - 1);
            ajustarCamposIMEI($(this).closest('tr'), cantidadActual - 1);
        }
        actualizarTotales();
    });

    // Botón de facturar
    $('#btnFacturar').click(function () {
        var idCliente = $('#clienteSelect').val();

        // Validar los datos antes de enviar
        if (idCliente === '') {
            Swal.fire('Error', 'Por favor, selecciona un cliente.', 'error');
            return;
        }

        if ($('#tblProductosSeleccionados tbody tr').length === 0 || !validarCamposIMEI()) {
            Swal.fire('Error', 'Verifica que hayas agregado productos y que los campos IMEI sean válidos.', 'error');
            return;
        }

        // Preparar los datos de la factura
        var detallesFactura = obtenerDetallesFactura();

        var datosFactura = {
            NumeroFactura: '12345', // Generar o asignar un número de factura adecuado
            Fecha: new Date(),
            Subtotal: parseFloat($('#subtotalVenta').val()),
            Impuesto: parseFloat($('#impuestoVenta').val()),
            Total: parseFloat($('#totalVenta').val()),
            IdCliente: idCliente,
            CreadoPor: 1, // Reemplazar con el ID del usuario actual
            Detalles: detallesFactura
        };

        console.log(datosFactura);

        // Confirmación de facturación
        Swal.fire({
            title: '¿Estás seguro de querer facturar?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, facturar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar un loader mientras se envía la información
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Por favor espera.',
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        // Enviar información al servidor
                        enviarDatosFacturacion(datosFactura);
                    }
                });
            }
        });

    });

    // Evento para regresar a la vista de la tabla
    $('#btnRegresar').click(function () {
        contenedorFormulario.hide();
        contenedorTabla.show();
        limpiarFormularioVenta();
    });

    function ajustarCamposIMEI(fila, cantidad) {
        var columnaIMEI = fila.find('.imei-column');
        columnaIMEI.empty();

        // Solo ajustar los campos IMEI si la categoría es 'Celular'
        if (fila.data('producto-categoria') === 'Celular' && cantidad > 0) {
            for (var i = 0; i < cantidad; i++) {
                columnaIMEI.append('<input type="text" class="form-control imei-producto" placeholder="IMEI">');
            }
        }
    }

    function validarIMEI(imei) {
        // Ejemplo: Validar longitud de 15 dígitos y solo números
        var regexIMEI = /^\d{15}$/;
        return regexIMEI.test(imei);
    }

    function validarCamposIMEI() {
        var todosValidos = true;
        $('.imei-producto').each(function () {
            if (!validarIMEI($(this).val())) {
                todosValidos = false;
                return false;
            }
        });
        return todosValidos;
    }

    function obtenerDetallesFactura() {
        var detalles = [];
        $('#tblProductosSeleccionados tbody tr').each(function () {
            var idProducto = $(this).data('producto-id');
            var cantidad = parseInt($(this).find('.cantidad-producto').val());
            var precioUnitario = parseFloat($(this).find('td:eq(1)').text());
            var categoria = $(this).data('producto-categoria');

            if (categoria === 'Celular') {
                $(this).find('.imei-producto').each(function () {
                    var imei = $(this).val();
                    detalles.push({ IdProducto: idProducto, Cantidad: 1, PrecioUnitario: precioUnitario, IMEI: imei });
                });
            } else {
                detalles.push({ IdProducto: idProducto, Cantidad: cantidad, PrecioUnitario: precioUnitario, IMEI: '' });
            }
        });
        return detalles;
    }

    function enviarDatosFacturacion(datosFactura) {
        $.ajax({
            url: '/Ventas/Facturar', // URL del controlador de facturación
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datosFactura),
            success: function (response) {
                if (response.status) { 
                    Swal.fire('¡Facturado!', 'La factura ha sido creada con éxito.', 'success');
                    contenedorFormulario.hide();
                    contenedorTabla.show();
                    tblFacturasVenta.ajax.reload();
                    limpiarFormularioVenta();
                } else {
                    Swal.fire('Error', response.errorMessage, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        });
    }

    // Verifica si el producto ya ha sido agregado a la tabla
    function productoYaAgregado(productId) {
        var encontrado = false;
        $('#tblProductosSeleccionados tbody tr').each(function () {
            if ($(this).data('producto-id') == productId) {
                encontrado = true;
                return false; // Salir del bucle
            }
        });
        return encontrado;
    }

    // Obtiene la información del producto y lo agrega a la tabla
    function obtenerInfoProducto(productId) {
        $.ajax({
            url: '/Ventas/GetProductsById', // Asegúrate de que esta URL sea correcta
            type: 'POST',
            dataType: 'json',
            data: { productId: productId },
            success: function (response) {
                if (response.status) {
                    agregarProductoATabla(response.data);
                } else {
                    alert(response.errorMessage || 'No se pudo obtener la información del producto.');
                }
            },
            error: function () {
                alert('Error al conectarse con el servidor.');
            }
        });
    }

    // Agrega el producto a la tabla
    function agregarProductoATabla(data) {
        var fila = `<tr data-producto-id="${data.IdProducto}" data-producto-categoria="${data.Categoria}">
                    <td>${data.Nombre} - ${data.Modelo}</td>
                    <td>${data.PrecioVenta}</td>
                    <td>
                        <div class="d-flex justify-content-center align-items-center">
                            <button class="btn btn-outline-secondary btn-sm menos-producto" type="button">-</button>
                            <input type="number" class="form-control text-center mx-1 cantidad-producto" style="width: 70px;" value="1" min="1" max="${data.Stock}" readonly>
                            <button class="btn btn-outline-secondary btn-sm mas-producto" type="button">+</button>
                        </div>
                    </td>
                    <td class="imei-column">${data.Categoria === 'Celular' ? '<input type="text" class="form-control imei-producto" placeholder="IMEI">' : ''}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-eliminar-producto" title="Eliminar producto">
                            <i class='bx bx-trash'></i>
                        </button>
                    </td>
                </tr>`;

        var nuevaFila = $(fila);
        $('#tblProductosSeleccionados tbody').append(nuevaFila);
        ajustarCamposIMEI(nuevaFila, 1);
        actualizarTotales();
    }

    // Función para actualizar los totales
    function actualizarTotales() {
        var subtotal = 0;
        $('#tblProductosSeleccionados tbody tr').each(function () {
            var precio = parseFloat($(this).find('td:eq(1)').text());
            var cantidad = parseInt($(this).find('.cantidad-producto').val());
            subtotal += precio * cantidad;
        });
        $('#subtotalVenta').val(subtotal.toFixed(2));
        // Suponiendo un impuesto del 10%
        $('#impuestoVenta').val((subtotal * 0.10).toFixed(2));
        $('#totalVenta').val((subtotal * 1.10).toFixed(2));
    }

    // Actualiza los totales de la factura
    function actualizarTotales() {
        var subtotal = 0;
        $('#tblProductosSeleccionados tbody tr').each(function () {
            var precio = parseFloat($(this).find('td:eq(1)').text());
            var cantidad = parseInt($(this).find('.cantidad-producto').val());
            subtotal += precio * cantidad;
        });
        $('#subtotalVenta').val(subtotal.toFixed(2));
        $('#impuestoVenta').val((subtotal * 0.15).toFixed(2));
        $('#totalVenta').val((subtotal * 1.15).toFixed(2));
    }

    function limpiarFormularioVenta() {
        // Limpiar la tabla de productos seleccionados
        $('#tblProductosSeleccionados tbody').empty();

        // Restablecer los selectores a la opción por defecto
        $('#clienteSelect').val('').trigger('change');
        $('#productoSelect').val('').trigger('change');

        // Resetear los totales
        $('#subtotalVenta').val('0.00');
        $('#impuestoVenta').val('0.00');
        $('#totalVenta').val('0.00');
    }
});
