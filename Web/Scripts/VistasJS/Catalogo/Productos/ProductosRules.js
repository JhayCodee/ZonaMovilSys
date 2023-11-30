$(document).ready(function () {

    $.validator.addMethod("precioVentaMayorQueCompra", function (value, element) {
        var precioCompra = parseFloat($('#inputPrecioCompra').val());
        var precioVenta = parseFloat(value);
        return precioVenta > precioCompra;
    }, "El precio de venta debe ser mayor que el precio de compra.");

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
                required: true,
                min: 0,  // Establece el mínimo según tus necesidades.
                max: 100  // Establece el máximo según tus necesidades.
            },
            inputPrecioCompra: {
                required: true,
                min: 0,  // Establece el mínimo según tus necesidades.
                max: 3000  // Establece el máximo según tus necesidades.
            },
            inputPrecioVenta: {
                required: true,
                min: 0,  // Establece el mínimo según tus necesidades.
                max: 5000,  // Establece el máximo según tus necesidades.
                precioVentaMayorQueCompra: true  // Añadir tu regla personalizada aquí
            },
            inputColor: "required",
            inputMarca: "required",
            inputCategoria: "required",
            inputAlmacenamiento: "required",
            inputGarantiaMeses: "required",
            inputRAM: "required"
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
            inputColor: {
                required: "Debe seleccionar un color."
            },
            inputMarca: {
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
            inputRAM: {
                required: "Debe seleccionar una capacidad de RAM."
            }
        }
    });
});
