var ProductApp = function (options) {
    var component = {
        url: '/Productos',
        tableIndex: null,
        isEditing: false
    };

    this.construct = function (options) {
        options.formContainer = $(options.parent).find("#Form-Productos");
        options.tableContainer = $(options.parent).find('#Index-Productos');
        options.table = $(options.parent).find("#tblProductos");
        $.extend(component, options);
    };

    var self = this;

    this.init = function () {
        self.initDataTable();
        self.initPlugins();
        self.bindEvents();
    };

    this.initDataTable = function () {
        if ($.fn.DataTable.isDataTable(component.table))
            component.table.DataTable().destroy();

        component.table.DataTable({
            ajax: {
                url: component.url + "/GetProductos",
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
                    render: function (data) {
                        return data ? '<span class="badge bg-label-success">Sí</span>' : '<span class="badge bg-label-warning">No</span>';
                    }
                },
                {
                    data: "Esim",
                    render: function (data) {
                        return data ? '<span class="badge bg-label-success">Sí</span>' : '<span class="badge bg-label-warning">No</span>';
                    }
                },
                { data: "Proveedor" },
                { data: "Imei" },
                { data: "CodigoBarra" },
                {
                    data: null,
                    render: function (data) {
                        return `
                            <div class="gap-2">
                                <button class="btn btn-warning btn-sm edit-button" data-id="${data.IdProducto}" title="Editar Producto">
                                    <i class='bx bx-edit'></i>
                                </button>
                                <button class="btn btn-danger btn-sm delete-button" data-id="${data.IdProducto}" title="Eliminar Producto">
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
                    action: function () {
                        component.isEditing = false;
                        component.tableContainer.hide();
                        component.formContainer.show();
                        $('#camposCelulares').hide();
                        $('#camposAccesorios').hide();
                        self.clearForm();
                    }
                }
            ]
        });
    };

    this.initPlugins = function () {
        $('select').select2({
            theme: 'bootstrap-5'
        });
    };

    this.bindEvents = function () {
        $('#btnGuardar').on('click', function (e) {
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
                        self.saveProduct();
                    }
                });
            }
        });

        component.table.on('click', '.edit-button', function () {
            component.isEditing = true;
            const id = $(this).data("id");
            self.getProductById(id);
        });

        component.table.on('click', '.delete-button', function () {
            const id = $(this).data("id");
            self.deleteProduct(id);
        });

        $('#btnRegresarProduct').on('click', function () {
            component.formContainer.hide();
            component.tableContainer.show();
            self.clearForm();
        });

        $('#inputCategoria').on('change', function () {
            self.toggleFieldsBasedOnCategory();
        });
    };

    //opcion para guardar con F1
    $(document).ready(function () {
        // Agregar evento para detectar la tecla presionada en todo el documento
        $(document).keydown(function (e) {
            // Verificar si la tecla presionada es la tecla F1 (código 112)
            if (e.which == 113) {
                // Evitar el comportamiento predeterminado de la tecla F1 (como abrir la ayuda del navegador)
                e.preventDefault();
                // Ejecutar la misma función que se ejecuta al hacer clic en el botón #btnGuardarCliente
                $("#btnGuardar").click();
            }
        });
    });

    $(document).ready(function () {
        // Agregar evento para detectar la tecla presionada en todo el documento
        $(document).keydown(function (e) {
            // Verificar si la tecla presionada es la tecla F1 (código 112)
            if (e.which == 112) {
                // Evitar el comportamiento predeterminado de la tecla F1 (como abrir la ayuda del navegador)
                e.preventDefault();
                // Ejecutar la misma función que se ejecuta al hacer clic en el botón #btnGuardarCliente
                $("#btnRegresarProduct").click();
            }
        });
    });


    this.saveProduct = function () {
        const selectedCategory = $("#inputCategoria").find(":selected").text();
        const isCellphone = selectedCategory === 'Celular';

        const product = {
            IdProducto: parseInt($("#idProducto").val()),
            Nombre: $("#inputNombre").val(),
            Modelo: $("#inputModelo").val(),
            Descripcion: $("#inputDescripcion").val(),
            Stock: isCellphone ? 1 : parseInt($("#inputStock").val()) || 1,
            PrecioCompra: isCellphone ? parseFloat($("#inputPrecioCompra").val()) : parseFloat($("#inputPrecioCompraAcc").val()),
            PrecioVenta: isCellphone ? parseFloat($("#inputPrecioVenta").val()) : parseFloat($("#inputPrecioVentaAcc").val()),
            Almacenamiento: isCellphone ? $("#inputAlmacenamiento").val() : null,
            GarantiaMeses: isCellphone ? parseInt($("#inputGarantiaMeses").val()) : parseInt($("#inputGarantiaMesesAcc").val()),
            RAM: isCellphone ? $("#inputRAM").val() : null,
            IdColor: isCellphone ? $("#inputColor").val() : $("#inputColorAcc").val(),
            IdMarca: isCellphone ? $("#inputMarca").val() : $("#inputMarcaAcc").val(),
            IdCategoria: $("#inputCategoria").val(),
            Bateria: isCellphone ? parseInt($("#inputBateria").val()) : null,
            Nuevo: isCellphone ? $("#inputNuevo").val() === "true" : null,
            Esim: isCellphone ? $("#inputEsim").val() === "true" : null,
            IdProveedor: isCellphone ? $("#inputProveedores").val() : $("#inputProveedoresAcc").val(),
            Imei: isCellphone ? $("#inputImei").val() : null,
            CodigoBarra: isCellphone ? $("#inputCodigoBarras").val() : $("#inputCodigoBarrasAcc").val(), 
        };

        const url = `${component.url}/${component.isEditing ? 'UpdateProduct' : 'CreateProduct'}`;

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
                        component.formContainer.hide();
                        component.tableContainer.show();
                        self.clearForm();
                        component.table.DataTable().ajax.reload();
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
            error: function () {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al guardar el producto',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    this.getProductById = function (id) {
        $.ajax({
            url: component.url + `/GetProductsById?productId=${id}`,
            type: 'POST',
            success: function (response) {
                if (response.status) {
                    component.formContainer.show();
                    component.tableContainer.hide();
                    self.populateForm(response.data);
                } else {
                    alert(response.errorMessage);
                }
            },
            error: function () {
                alert("Error al obtener el producto");
            }
        });
    };

    this.deleteProduct = function (id) {
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
                    url: component.url + `/DeleteProduct?productId=${id}`,
                    type: 'POST',
                    success: function (response) {
                        if (response.status) {
                            Swal.fire({
                                title: 'Eliminado',
                                text: 'El producto ha sido eliminado exitosamente.',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                component.table.DataTable().ajax.reload();
                            });
                        } else {
                            Swal.fire(
                                'Error',
                                `Error al eliminar: ${response.errorMessage}`,
                                'error'
                            );
                        }
                    },
                    error: function () {
                        Swal.fire(
                            'Error',
                            'Error al realizar la petición al servidor.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    this.populateForm = function (product) {
        $("#idProducto").val(product.IdProducto);
        $("#inputNombre").val(product.Nombre);
        $("#inputModelo").val(product.Modelo);
        $("#inputDescripcion").val(product.Descripcion);
        $("#inputCategoria").val(product.IdCategoria).trigger('change');

        // Mostrar los campos correctos según la categoría antes de cargar valores
        self.toggleFieldsBasedOnCategory();

        if (product.Categoria === 'Celular') {
            self.populateCellphoneForm(product);
        } else {
            self.populateAccessoryForm(product);
        }
    };

    this.populateCellphoneForm = function (product) {
        $("#inputPrecioCompra").val(product.PrecioCompra);
        $("#inputPrecioVenta").val(product.PrecioVenta);
        $("#inputAlmacenamiento").val(product.Almacenamiento).trigger('change');
        $("#inputGarantiaMeses").val(product.GarantiaMeses).trigger('change');
        $("#inputRAM").val(product.RAM).trigger('change');
        $("#inputColor").val(product.IdColor).trigger('change');
        $("#inputMarca").val(product.IdMarca).trigger('change');
        $("#inputBateria").val(product.Bateria);
        $("#inputNuevo").val(product.Nuevo ? "true" : "false").trigger('change');
        $("#inputEsim").val(product.Esim ? "true" : "false").trigger('change');
        $("#inputProveedores").val(product.IdProveedor).trigger('change');
        $("#inputImei").val(product.Imei);
        $("#inputCodigoBarras").val(product.CodigoBarra);
    };

    this.populateAccessoryForm = function (product) {
        $("#inputPrecioCompraAcc").val(product.PrecioCompra);
        $("#inputPrecioVentaAcc").val(product.PrecioVenta);
        $("#inputStock").val(product.Stock);
        $("#inputGarantiaMesesAcc").val(product.GarantiaMeses).trigger('change');
        $("#inputColorAcc").val(product.IdColor).trigger('change');
        $("#inputMarcaAcc").val(product.IdMarca).trigger('change');
        $("#inputProveedoresAcc").val(product.IdProveedor).trigger('change');
    };

    this.clearForm = function () {
        $("#frmProductos")[0].reset();
        let validator = $("#frmProductos").validate();
        validator.resetForm();
        $("#frmProductos .select2").val(null).trigger('change');
    };

    this.toggleFieldsBasedOnCategory = function () {
        const selectedCategory = $("#inputCategoria").find(":selected").text();

        if (selectedCategory === 'Celular') {
            $('#camposCelulares').show();
            $('#camposAccesorios').hide();
            $("#inputStock").val(1).prop('readonly', true);
        } else {
            $('#camposCelulares').hide();
            $('#camposAccesorios').show();
            $("#inputStock").prop('readonly', false);
        }
    };

    this.construct(options);
};

$(function () {
    var productApp = new ProductApp({
        parent: $("#ContainerProductos"),
    });
    productApp.init();
});
