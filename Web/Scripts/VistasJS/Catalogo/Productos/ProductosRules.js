$(document).ready(function () {
    $.validator.addMethod("precioVentaMayorQueCompra", function (value, element) {
        var precioCompra = parseFloat($('#inputPrecioCompra').val()) || parseFloat($('#inputPrecioCompraAcc').val());
        var precioVenta = parseFloat(value);
        return precioVenta > precioCompra;
    }, "El precio de venta debe ser mayor que el precio de compra.");

    $.validator.addMethod("imeiValido", function (value, element) {
        return this.optional(element) || /^[0-9]{15}$/.test(value);
    }, "El IMEI debe contener exactamente 15 dígitos numéricos.");

    $.validator.addMethod("codigoBarraValido", function (value, element) {
        return this.optional(element) || /^[0-9]{6}$/.test(value);
    }, "El código de barra debe contener exactamente 6 dígitos numéricos.");

    $("#frmProductos").validate({
        rules: {
            inputNombre: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputModelo: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputDescripcion: {
                required: true,
                normalizer: function (value) {
                    return $.trim(value);
                }
            },
            inputStock: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() !== 'Celular';
                },
                min: 0,
                max: 100
            },
            inputPrecioCompra: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                },
                min: 0,
                max: 3000
            },
            inputPrecioVenta: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                },
                min: 0,
                max: 5000,
                precioVentaMayorQueCompra: true
            },
            inputPrecioCompraAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                },
                min: 0,
                max: 3000
            },
            inputPrecioVentaAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                },
                min: 0,
                max: 5000,
                precioVentaMayorQueCompra: true
            },
            inputColor: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputColorAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                }
            },
            inputMarca: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputMarcaAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                }
            },
            inputCategoria: "required",
            inputAlmacenamiento: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputGarantiaMeses: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputGarantiaMesesAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                }
            },
            inputRAM: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputImei: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                },
                imeiValido: true
            },
            inputCodigoBarras: {
                required: true,
                codigoBarraValido: true
            },
            inputProveedores: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Celular';
                }
            },
            inputProveedoresAcc: {
                required: function () {
                    return $("#inputCategoria").find(":selected").text() === 'Accesorio';
                }
            }
        },
        messages: {
            inputNombre: {
                required: "El nombre es obligatorio."
            },
            inputModelo: {
                required: "El modelo es obligatorio."
            },
            inputDescripcion: {
                required: "La descripción es obligatoria."
            },
            inputStock: {
                required: "El stock es obligatorio.",
                min: "El stock no puede ser menor a 0.",
                max: "El stock no puede ser mayor a 100."
            },
            inputPrecioCompra: {
                required: "El precio de compra es obligatorio.",
                min: "El precio de compra no puede ser menor a 0.",
                max: "El precio de compra no puede ser mayor a 3,000."
            },
            inputPrecioVenta: {
                required: "El precio de venta es obligatorio.",
                min: "El precio de venta no puede ser menor a 0.",
                max: "El precio de venta no puede ser mayor a 5,000.",
                precioVentaMayorQueCompra: "El precio de venta debe ser mayor que el precio de compra."
            },
            inputPrecioCompraAcc: {
                required: "El precio de compra es obligatorio.",
                min: "El precio de compra no puede ser menor a 0.",
                max: "El precio de compra no puede ser mayor a 3,000."
            },
            inputPrecioVentaAcc: {
                required: "El precio de venta es obligatorio.",
                min: "El precio de venta no puede ser menor a 0.",
                max: "El precio de venta no puede ser mayor a 5,000.",
                precioVentaMayorQueCompra: "El precio de venta debe ser mayor que el precio de compra."
            },
            inputColor: {
                required: "Debe seleccionar un color."
            },
            inputColorAcc: {
                required: "Debe seleccionar un color."
            },
            inputMarca: {
                required: "Debe seleccionar una marca."
            },
            inputMarcaAcc: {
                required: "Debe seleccionar una marca."
            },
            inputCategoria: {
                required: "Debe seleccionar una categoría."
            },
            inputAlmacenamiento: {
                required: "Debe seleccionar una capacidad de almacenamiento."
            },
            inputGarantiaMeses: {
                required: "Debe seleccionar los meses de garantía."
            },
            inputGarantiaMesesAcc: {
                required: "Debe seleccionar los meses de garantía."
            },
            inputRAM: {
                required: "Debe seleccionar una capacidad de RAM."
            },
            inputImei: {
                required: "El IMEI es obligatorio.",
                imeiValido: "El IMEI debe contener exactamente 15 dígitos numéricos."
            },
            inputCodigoBarras: {
                required: "El código de barra es obligatorio.",
                codigoBarraValido: "El código de barra debe contener exactamente 6 dígitos numéricos."
            },
            inputProveedores: {
                required: "Debe seleccionar un proveedor."
            },
            inputProveedoresAcc: {
                required: "Debe seleccionar un proveedor."
            }
        }
    });
});
