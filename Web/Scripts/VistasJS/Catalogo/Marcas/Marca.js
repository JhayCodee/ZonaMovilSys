(function ($) {

    $(function () {
        loadMarcasDataTable();

    });

    const MarcaContainer = {
        Url: '/Marca',
        Index: $('#Index-Marca'),
        Form: $('#Form-Marca'),
    };

    const $tblMarca = $('#tblMarca');

    function loadMarcasDataTable() {

        if ($.fn.DataTable.isDataTable($tblMarca))
            $tblProducts.DataTable().destroy();

        $tblMarca.DataTable({
            ajax: {
                url: MarcaContainer.Url + "/GetMarcas",
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
                {
                    data: null,
                    render: function (data, type, row) {
                        let buttons = `
                                        <div class="d-flex justify-content-center gap-2">
                                            <button class="btn btn-warning btn-sm edit-button" 
                                                    data-id="${row.IdMarca}"
                                                    title="Editar Producto">
                                                <i class='bx bx-edit'></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm delete-button" 
                                                    data-id="${row.IdMarca}"
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
                    }
                }
            ]
        });
    }

})(jQuery);

