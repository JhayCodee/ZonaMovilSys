(function ($) {

    let isEditing = false;

    $(function () {
        loadProductsDataTable();

      


        $("#btnGuardar").click(function (e) {
            e.preventDefault();

            if ($("#frmProductos").valid()) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Confirma para guardar los cambios.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, guardar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveProduct();
                    }
                });
            }
        });

        $tblProducts.on('click', '.edit-button', function () {
            isEditing = true;
            const id = $(this).data("id");

            $.ajax({
                url: productsContainer.Url + `/GetProductsById?productId=${id}`,
                type: 'POST',
                success: function (response) {
                    if (response.status) {
                        populateProductForm(response.data);
                        productsContainer.Form.show();
                        productsContainer.Index.hide();
                    } else {
                        // Maneja el error según tu preferencia
                        alert(response.errorMessage);
                    }
                },
                error: function (err) {
                    alert("Error al obtener el producto");
                }
            });

            $.ajax({
                type: "POST",
                url: productsContainer.Url + "/GetProductsById",
                data: { productId: id },
                dataType: "json",
                success: function (response) {
                    if (response.status && response.data) {
                        populateProductForm(response.data);
                        productsContainer.Form.show();
                        productsContainer.Index.hide();
                    } else {
                        // Muestra un mensaje de error si algo va mal.
                        alert("Error: " + response.errorMessage);
                    }
                },
                error: function (error) {
                    alert("Error al conectar con el servidor.");
                }
            });
        });

        $tblProducts.on('click', '.delete-button', function () {
            const id = $(this).data("id");

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas eliminar este producto?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: productsContainer.Url + `/DeleteProduct?productId=${id}`,
                        type: 'POST',
                        success: function (response) {
                            if (response.status) {
                                Swal.fire({
                                    title: 'Eliminado',
                                    text: 'El producto ha sido eliminado exitosamente.',
                                    icon: 'success',
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                         loadProductsDataTable();
                                    }
                                });
                            } else {
                                Swal.fire(
                                    'Error',
                                    `Error al eliminar: ${response.errorMessage}`,
                                    'error'
                                );
                            }
                        },
                        error: function (err) {
                            Swal.fire(
                                'Error',
                                'Error al realizar la petición al servidor.',
                                'error'
                            );
                        }
                    });
                }
            });
        });

        $("#btnRegresarProduct").click(function (e) {
            productsContainer.Form.hide();
            productsContainer.Index.show();
            clearFormProduct();
        });
    });

    const productsContainer = {
        Url: '/Productos',
        Index: $('#Index-Productos'),
        Form: $('#Form-Productos'),
    };

    const $tblProducts = $('#tblProductos');

    function loadProductsDataTable() {

        if ($.fn.DataTable.isDataTable($tblProducts))
            $tblProducts.DataTable().destroy();

        $tblProducts.DataTable({
            ajax: {
                url: productsContainer.Url + "/GetProductos",
                type: 'POST',
                datatype: 'json',
                dataSrc: function (json) {
                    console.log(json);
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
                { data: "Nombre" },
                { data: "Modelo" },
                { data: "Descripcion" },
                { data: "Stock" },
                { data: "PrecioCompra" },
                { data: "PrecioVenta" },
                { data: "Almacenamiento" },
                { data: "GarantiaMeses" },
                { data: "RAM" },
                { data: "Color" },
                { data: "Marca" },
                { data: "Categoria" },
                { data: "Bateria" },
                {
                    data: "Nuevo",
                    render: function (data, type, row) {
                        return data ? '<span class="badge bg-label-success">Sí</span>' : '<span class="badge bg-label-warning">No</span>';
                    }
                },
                {
                    data: "Esim",
                    render: function (data, type, row) {
                        return data ? '<span class="badge bg-label-success">Sí</span>' : '<span class="badge bg-label-warning">No</span>';
                    }
                },
                { data: "Proveedor" },
                { data: "Imei" },
                { data: "CodigoBarra" },
                {
                    data: null,
                    render: function (data, type, row) {
                        let buttons = `
                                        <div class=" gap-2">
                                            <button class="btn btn-warning btn-sm edit-button" 
                                                    data-id="${row.IdProducto}" 
                                                    title="Editar Producto">
                                                <i class='bx bx-edit'></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm delete-button" 
                                                    data-id="${row.IdProducto}" 
                                                    title="Eliminar Producto">
                                                <i class='bx bx-trash'></i>
                                            </button>
                                    `;
                        buttons += `</div>`;
                        return buttons;
                    }
                }
            ],
            buttons: [
                {
                    text: 'Nuevo',
                    className: 'btn btn-primary',
                    action: function (e, dt, node, config) {
                        isEditing = false;
                        productsContainer.Index.hide();
                        productsContainer.Form.show();

                    }
                }
            ]
        });
    }

    function saveProduct() {
        const product = {
            IdProducto: parseInt($("#idProducto").val()),
            Nombre: $("#inputNombre").val(),
            Modelo: $("#inputModelo").val(),
            Descripcion: $("#inputDescripcion").val(),
            Stock: parseInt($("#inputStock").val()),
            PrecioCompra: parseFloat($("#inputPrecioCompra").val()),
            PrecioVenta: parseFloat($("#inputPrecioVenta").val()),
            Almacenamiento: $("#inputAlmacenamiento").val(),
            GarantiaMeses: $("#inputGarantiaMeses").val() ? parseInt($("#inputGarantiaMeses").val()) : null,
            RAM: $("#inputRAM").val(),
            IdColor: $("#inputColor").val(),
            IdMarca: $("#inputMarca").val(),
            IdCategoria: $("#inputCategoria").val(),
            Bateria: parseInt($("#inputBateria").val()),
            Nuevo: $("#inputNuevo").val() === "true", // Obtener el valor del campo Nuevo como booleano
            Esim: $("#inputEsim").val() === "true",
            IdProveedor: $("#inputProveedores").val(),
            Imei: $("#inputImei").val(),
            CodigoBarra: $("#inputCodigoBarras").val()
        };
        console.log("Valor de Batería:", product.Bateria);
        const url = `${productsContainer.Url}/${isEditing ? 'UpdateProduct' : 'CreateProduct'}`;

        Swal.fire({
            title: 'Por favor espera',
            text: 'Guardando producto...',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        $.ajax({
            url: url,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(product),
            dataType: "json",
            success: function (response) {
                if (response.status) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Producto guardado exitosamente',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        productsContainer.Form.hide();
                        productsContainer.Index.show();
                        clearFormProduct();
                        loadProductsDataTable();
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: response.errorMessage || 'Hubo un error al guardar el producto',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al guardar el producto',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    function populateProductForm(product) {
        $("#idProducto").val(product.IdProducto);
        $("#inputNombre").val(product.Nombre);
        $("#inputModelo").val(product.Modelo);
        $("#inputDescripcion").val(product.Descripcion);
        $("#inputStock").val(product.Stock);
        $("#inputPrecioCompra").val(product.PrecioCompra);
        $("#inputPrecioVenta").val(product.PrecioVenta);

        $("#inputAlmacenamiento").val(product.Almacenamiento).trigger('change');
        $("#inputGarantiaMeses").val(product.GarantiaMeses).trigger('change');
        $("#inputRAM").val(product.RAM).trigger('change');

        $("#inputColor").val(product.IdColor).trigger('change');
        $("#inputMarca").val(product.IdMarca).trigger('change');
        $("#inputCategoria").val(product.IdCategoria).trigger('change');
        $("#inputBateria").val(product.Bateria);
        $("#inputNuevo").val(product.Nuevo).trigger('change');
        $("#inputEsim").val(product.Esim).trigger('change');
        $("#inputProveedores").val(product.IdProveedor).trigger('change');
        $("#inputImei").val(product.Imei);
        $("#inputCodigoBarras").val(product.CodigoBarra);
    }


    function clearFormProduct() {
        // Resetear el formulario a valores iniciales
        $("#frmProductos")[0].reset();

        // Limpiar mensajes de error de jQuery Validate
        let validator = $("#frmProductos").validate();
        validator.resetForm();

        // Si estás usando la biblioteca Select2 para tus elementos select:
        $("#frmProductos .select2").val(null).trigger('change');
    }

})(jQuery);

