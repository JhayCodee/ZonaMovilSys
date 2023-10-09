document.addEventListener('DOMContentLoaded', () => {
    showTableRoles();
});

const RolesContainer = {
    Url: '/Roles',
    Index: document.getElementById('Index-Rol')
}

function showTableRoles() {
    // Verificar si la tabla ya ha sido inicializada
    if ($.fn.DataTable.isDataTable('#tblRoles')) {
        $('#tblRoles').DataTable().destroy();
    }

    // Inicializar (o volver a inicializar) la tabla
    $('#tblRoles').DataTable({
        ajax: {
            url: RolesContainer.Url + "/GetRoles",
            type: 'POST',
            datatype: 'json',
            dataSrc: function (json) {
                if (!json.status) {
                    return [];
                }
                return json.data;
            }
        },
        columns: [
            { data: "NombreRol", width: "80%" },
            {
                data: null,
                width: "20%",
                render: function (data, type, row) {
                    return `
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-primary btn-sm edit-button" data-id="${row.IdRol}">
                                <i class='bx bx-edit'></i>
                            </button>
                            <button class="btn btn-danger btn-sm delete-button" data-id="${row.IdRol}">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Nuevo',
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
              
                }
            }
        ]
    });
}

