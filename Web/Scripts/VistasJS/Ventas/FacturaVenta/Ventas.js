$(document).ready(function () {
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

    // Función para obtener la información del producto
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

    $('#tblProductosSeleccionados').on('blur', '.imei-producto', function () {

        //if (!validarIMEI($(this).val())) {
        //    alert('IMEI inválido. Debe cumplir con el estándar de IMEI.');
        //    $(this).focus();
        //}

    });

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
                if (response.isSuccess) {
                    Swal.fire('¡Facturado!', 'La factura ha sido creada con éxito.', 'success');
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
