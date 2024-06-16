$(document).ready(function () {

    var contenedorTabla = $("#Venta-Index");
    var contenedorFormulario = $("#Venta-Form");
    actualizarTotales();

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
        ],
        order: [[0, 'desc']]
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
        }
        actualizarTotales();
    });

    $('#tblProductosSeleccionados').on('click', '.menos-producto', function () {
        var inputCantidad = $(this).closest('tr').find('.cantidad-producto');
        var cantidadActual = Number(inputCantidad.val());

        if (cantidadActual > 1) {
            inputCantidad.val(cantidadActual - 1);
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

        if ($('#tblProductosSeleccionados tbody tr').length === 0) {
            Swal.fire('Error', 'Verifica que hayas agregado productos.', 'error');
            return;
        }

        // Preparar los datos de la factura
        var detallesFactura = obtenerDetallesFactura();

        var datosFactura = {
            NumeroFactura: '', 
            Fecha: new Date(),
            Subtotal: parseFloat($('#subtotalVenta').val()),
            Impuesto: parseFloat($('#impuestoVenta').val()),
            Total: parseFloat($('#totalVenta').val()),
            Descuento: parseFloat($('#descuentoVenta').val()),
            IdCliente: idCliente,
            CreadoPor: 1, 
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

    // Evento para actualizar el total cuando se cambia el descuento
    $('#descuentoVenta').on('input', function () {
        validarDescuento();
    });

    function validarDescuento() {
        var descuentoInput = $('#descuentoVenta');
        var descuentoWarning = $('#descuentoWarning');
        var descuento = parseFloat(descuentoInput.val()) || 0;
        var subtotal = parseFloat($('#subtotalVenta').val()) || 0;
        var valid = true;

        // Validar que el descuento no sea negativo ni mayor que el subtotal
        if (descuento < 0) {
            descuentoWarning.text('El descuento no puede ser negativo.');
            descuentoWarning.show();
            valid = false;
        } else if (descuento > subtotal * 1.15) { // considerando el impuesto del 15%
            descuentoWarning.text('El descuento no puede ser mayor que el total con impuesto.');
            descuentoWarning.show();
            valid = false;
        } else {
            descuentoWarning.hide();
        }

        if (valid) {
            actualizarTotales();
        }
    }

    function actualizarTotales() {
        var subtotal = 0;
        $('#tblProductosSeleccionados tbody tr').each(function () {
            var precio = parseFloat($(this).find('td:eq(1)').text());
            var cantidad = parseInt($(this).find('.cantidad-producto').val());
            subtotal += precio * cantidad;
        });

        var descuento = parseFloat($('#descuentoVenta').val()) || 0;
        var impuesto = subtotal * 0.15;
        var total = subtotal + impuesto - descuento;

        $('#subtotalVenta').val(subtotal.toFixed(2));
        $('#impuestoVenta').val(impuesto.toFixed(2));
        $('#totalVenta').val(total.toFixed(2));
    }

    function limpiarFormularioVenta() {
        $('#tblProductosSeleccionados tbody').empty();
        $('#clienteSelect').val('').trigger('change');
        $('#productoSelect').val('').trigger('change');
        $('#subtotalVenta').val('0.00');
        $('#impuestoVenta').val('0.00');
        $('#totalVenta').val('0.00');
        $('#descuentoVenta').val('0'); // Resetear el campo de descuento
        $('#descuentoWarning').hide(); // Ocultar el mensaje de advertencia
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
            url: '/Ventas/GetProductsById', 
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

    function agregarProductoATabla(data) {
        var cantidadColumna = data.Categoria === 'Accesorio' ? `
            <div class="d-flex justify-content-center align-items-center">
                <button class="btn btn-outline-secondary btn-sm menos-producto" type="button">-</button>
                <input type="number" class="form-control text-center mx-1 cantidad-producto" style="width: 70px;" value="1" min="1" max="${data.Stock}" readonly>
                <button class="btn btn-outline-secondary btn-sm mas-producto" type="button">+</button>
            </div>` :
            `
            <div class="d-flex justify-content-center align-items-center">
               <input type="number" class="form-control text-center mx-1 cantidad-producto" style="width: 70px;" value="1" min="1" max="${data.Stock}" readonly disabled>
            </div>`
            //`<input type="number" class="form-control text-center mx-1 cantidad-producto" style="width: 70px;" value="1" min="1" max="${data.Stock}" readonly disabled>`;

        var fila = `<tr data-producto-id="${data.IdProducto}" data-producto-categoria="${data.Categoria}" data-producto-IMEI="${data.IMEI}">
                    <td>${data.DetalleCelular} </td>
                    <td>${data.PrecioVenta}</td>
                    <td>${cantidadColumna}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btn-eliminar-producto" title="Eliminar producto">
                            <i class='bx bx-trash'></i>
                        </button>
                    </td>
                </tr>`;

        var nuevaFila = $(fila);
        $('#tblProductosSeleccionados tbody').append(nuevaFila);
        actualizarTotales();
    }

    function obtenerDetallesFactura() {
        var detalles = [];
        $('#tblProductosSeleccionados tbody tr').each(function () {
            var idProducto = $(this).data('producto-id');
            var cantidad = parseInt($(this).find('.cantidad-producto').val());
            var precioUnitario = parseFloat($(this).find('td:eq(1)').text());
            detalles.push({ IdProducto: idProducto, Cantidad: cantidad, PrecioUnitario: precioUnitario});
        });
        return detalles;
    }

    function enviarDatosFacturacion(datosFactura) {
        $.ajax({
            url: '/Ventas/Facturar', 
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


    // MODAL CLIENTES

    // Función para limpiar el formulario y reiniciar Select2
    function resetForm() {
        // Limpiar valores del formulario
        $('#frmClientes')[0].reset();

        // Quitar clases de validación
        $('#frmClientes').find('.is-invalid').removeClass('is-invalid');
        $('#frmClientes').find('.invalid-feedback').remove();

        // Resetear Select2
        $('#frmClientes').find('select').val(null).trigger('change');
    }

    // Mostrar el modal para nuevo cliente
    $('#btnNuevoCliente').on('click', function () {
        $('#modalNuevoCliente').modal('show');
    });

    // Ocultar el modal y limpiar el formulario al cerrarlo
    $('#modalNuevoCliente').on('hidden.bs.modal', function () {
        resetForm();
    });

    // Reiniciar Select2 cuando se muestra el modal
    $('#modalNuevoCliente').on('shown.bs.modal', function () {
        $('#inputDepartamento').select2({
            theme: 'bootstrap-5',
            dropdownParent: $('#modalNuevoCliente') // Asegura que el dropdown se muestre correctamente dentro del modal
        });
    });

    // Aplicar la mascarada al campo de cédula
    $('#inputCedula').mask('000-000000-0000A', {
        translation: {
            '0': { pattern: /[0-9]/ },
            'A': { pattern: /[A-Za-z]/, optional: true }
        },
        placeholder: "___-______-____A"
    });

    // Método personalizado para la validación de expresiones regulares
    $.validator.addMethod("regex", function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, "Por favor, verifique su entrada.");

    // Validación para el select
    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Seleccione una opción válida.");

    // Validaciones con jQuery Validation
    $('#frmClientes').validate({
        rules: {
            inputNombres: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputApellidos: {
                required: true,
                minlength: 2,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputCedula: {
                required: true,
                regex: /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Za-z]$/,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputCorreo: {
                required: true,
                email: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputTelefono: {
                required: true,
                minlength: 8,
                digits: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputDepartamento: {
                required: true,
                valueNotEquals: ""
            }
        },
        messages: {
            inputNombres: {
                required: "Los nombres son obligatorios.",
                minlength: "Debe contener al menos 2 caracteres."
            },
            inputApellidos: {
                required: "Los apellidos son obligatorios.",
                minlength: "Debe contener al menos 2 caracteres."
            },
            inputCedula: {
                required: "La cédula es obligatoria.",
                regex: "Formato de cédula no válido."
            },
            inputCorreo: {
                required: "El correo es obligatorio.",
                email: "Debe ser una dirección de correo válida."
            },
            inputTelefono: {
                required: "El teléfono es obligatorio.",
                minlength: "Debe contener al menos 8 dígitos.",
                digits: "Sólo se permiten números."
            },
            inputDepartamento: {
                required: "Seleccione una opción válida.",
                valueNotEquals: "Seleccione una opción válida."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.mb-3').append(error);
        },
        highlight: function (element) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element) {
            $(element).removeClass('is-invalid');
        }
    });

    // Función para actualizar el select de clientes
    function updateClientesDropdown() {
        $.ajax({
            url: '/Clientes/GetClientesDropdown',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.clientes) {
                    var $clienteSelect = $('#clienteSelect');
                    $clienteSelect.empty();
                    $clienteSelect.append('<option value="">Seleccione un cliente</option>');
                    $.each(response.clientes, function (index, cliente) {
                        $clienteSelect.append(new Option(cliente.Value, cliente.Id));
                    });
                    $clienteSelect.trigger('change');
                }
            },
            error: function () {
                Swal.fire('Error', 'No se pudo actualizar la lista de clientes.', 'error');
            }
        });
    }

    // Enviar el formulario de cliente con confirmación
    $('#frmClientes').on('submit', function (e) {
        e.preventDefault();

        if ($(this).valid()) {
            Swal.fire({
                title: '¿Está seguro?',
                text: "¿Desea guardar el nuevo cliente?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    var clienteData = {
                        Nombres: $('#inputNombres').val(),
                        Apellidos: $('#inputApellidos').val(),
                        Cedula: $('#inputCedula').val(),
                        Correo: $('#inputCorreo').val(),
                        Telefono: $('#inputTelefono').val(),
                        IdDepartamento: $('#inputDepartamento').val()
                    };
                    return $.ajax({
                        url: '/Clientes/CreateCliente',
                        type: 'POST',
                        data: JSON.stringify(clienteData),
                        contentType: 'application/json; charset=utf-8'
                    }).then(response => {
                        if (response.status) {
                            $('#modalNuevoCliente').modal('hide');
                            // Actualiza el select de clientes
                            updateClientesDropdown();
                            return Swal.fire('Éxito', 'Cliente registrado correctamente', 'success');
                        } else {
                            return Swal.fire('Error', response.message, 'error');
                        }
                    }).catch(error => {
                        return Swal.fire('Error', 'Ocurrió un error al registrar el cliente', 'error');
                    });
                },
                allowOutsideClick: () => !Swal.isLoading()
            });
        }
    });

});
