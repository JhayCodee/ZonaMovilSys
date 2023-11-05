document.addEventListener('DOMContentLoaded', () => {

    showTableRoles();
    loadControllers();

    $('#regresarRol').on('click', () => {
        clearRolesForm();
        rolesContainer.Index.show();
        rolesContainer.Form.hide();
    });

    $('#guardarRol').on('click', () => {
        const selectedControllers = getSelectedControllers();
        const rolNameElement = $('#NombreRol').val();
        const idrol = $('#IdRol').val();

        // Validar que rolNameElement no esté vacío y que no contenga solo espacios
        if (rolNameElement.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre del rol no puede estar vacío'
            });
            return;
        }

        // Validar que selectedControllers contenga al menos un id
        if (selectedControllers.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe seleccionar al menos una opcion del menú'
            });
            return;
        }

        const requestData = {
            data: selectedControllers,
            rolName: rolNameElement
        };

        if (idrol) {
            requestData.idrol = idrol;
        }

        sendSelectedControllersToServer(requestData);
    });

    $('#tblRoles tbody').on('click', '.edit-button', async function () {
        const idRol = $(this).data('id');
        const rol = $(this).data('rol');
        const controllerIds = await fetchControllersById(idRol);

        RolMode = "Edit";
        $("#IdRol").val(idRol);
        $("#NombreRol").val(rol);

        rolesContainer.Form.show();
        rolesContainer.Index.hide();

        if (controllerIds) {
            loadControllers(controllerIds);
        }
    });

});

let RolMode = null;

const rolesContainer = {
    Url: '/Roles',
    Index: $('#Index-Rol'),
    Form: $('#Form-Rol')
}


async function loadControllers(checkedControllerIds = []) {
    try {
        const response = await fetch(rolesContainer.Url + '/GetControllers', { method: 'POST' });
        const { status, data } = await response.json();

        if (!status) {
            console.error('Error en peticion de controllers:', data);
            return;
        }

        const checkboxContainer = document.getElementById('checkbox-container');
        const groupedControllers = data.reduce((acc, controller) => {
            acc[controller.Modulo] = acc[controller.Modulo] || [];
            acc[controller.Modulo].push(controller);
            return acc;
        }, {});

        let accordionHtml = '';
        let accordionId = 0;

        for (const module in groupedControllers) {
            accordionHtml += `
                            <div class="accordion-item mb-2 border rounded">
                                <h2 class="accordion-header py-2  text-white">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${accordionId}" aria-expanded="true" aria-controls="collapse${accordionId}">
                                        <div class="form-check">
                                            <input type="checkbox" id="${module}" class="form-check-input module-checkbox" />
                                            <label class="form-check-label">${module}</label>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapse${accordionId}" class="accordion-collapse collapse rounded-bottom" aria-labelledby="heading${accordionId}" data-bs-parent="#checkbox-container">
                                    <div class="accordion-body bg-light pt-1 pb-3">
                                        <div class="controllers d-grid gap-2 ps-4">
                                            ${groupedControllers[module].map(controller => `
                                                <div class="form-check">
                                                    <input type="checkbox" id="${controller.NombreControlador}" class="form-check-input controller-checkbox" data-module="${module}" data-controller-id="${controller.IdControlador}" />
                                                    <label class="form-check-label" for="${controller.NombreControlador}">${controller.NombreControlador}</label>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
            accordionId++;
        }

        checkboxContainer.innerHTML = accordionHtml;

        // Marcar los checkboxes correspondientes
        checkedControllerIds.forEach(id => {
            document.querySelector(`.controller-checkbox[data-controller-id="${id}"]`).checked = true;
        });

        document.querySelectorAll('.module-checkbox').forEach(moduleCheckbox => {
            const moduleId = moduleCheckbox.id;
            const hasCheckedController = [...checkboxContainer.querySelectorAll(`.controller-checkbox[data-module="${moduleId}"]:checked`)].length > 0;
            moduleCheckbox.checked = hasCheckedController;
        });

        checkboxContainer.addEventListener('change', (e) => {
            const checkbox = e.target;

            // Si es un checkbox de módulo, actualizar hijos
            if (checkbox.classList.contains('module-checkbox')) {
                const controllerCheckboxes = checkboxContainer.querySelectorAll(`.controller-checkbox[data-module="${checkbox.id}"]`);
                controllerCheckboxes.forEach(cb => cb.checked = checkbox.checked);
            }
            // Si es un checkbox de controlador, actualizar padre
            else if (checkbox.classList.contains('controller-checkbox')) {
                const moduleCheckbox = checkboxContainer.querySelector(`.module-checkbox[id="${checkbox.dataset.module}"]`);
                moduleCheckbox.checked = [...checkboxContainer.querySelectorAll(`.controller-checkbox[data-module="${checkbox.dataset.module}"]:checked`)].length > 0;
            }
        });

    } catch (err) {
        console.error('An error occurred:', err);
    }
}

function getSelectedControllers() {
    const selectedCheckboxes = document.querySelectorAll('.controller-checkbox:checked');
    const selectedControllerIds = [...selectedCheckboxes].map(checkbox => checkbox.dataset.controllerId);
    return selectedControllerIds;
}

async function fetchControllersById(idRol) {
    try {
        const response = await fetch(rolesContainer.Url + '/GetControllersById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idRol })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { status, data } = await response.json();

        if (status) {
            return data; // Devuelve los datos si status es true
        } else {
            console.log('Error retrieving data');
            return null; // Devuelve null si status es false
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return null; // Devuelve null si hay un error
    }
}

function sendSelectedControllersToServer(requestData) {
    let endpoint = (RolMode === "Add") ? '/AddPermisisons' : (RolMode === "Edit") ? '/EditPermissions' : '/DefaultEndpoint';

    let requestBody = {
        data: requestData.data,
        rolName: requestData.rolName
    };

    if (RolMode === "Edit" && requestData.idrol) {
        requestBody.idrol = requestData.idrol;
    }

    // Primero preguntar si está seguro de guardar el registro
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres guardar este registro?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si confirma, mostrar el loader
            let timerInterval;
            Swal.fire({
                title: 'Guardando...',
                html: 'Por favor espera un momento.',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });

            $.ajax({
                url: rolesContainer.Url + endpoint,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(requestBody),
                success: function (data) {
                    // Cerrar el loader
                    Swal.close();

                    if (data.status) {
                        Swal.fire({
                            title: "Éxito",
                            text: "La operación se realizó correctamente.",
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            showTableRoles();
                            rolesContainer.Form.hide();
                            rolesContainer.Index.show();
                            clearRolesForm();
                            if (RolMode === "Edit") location.reload(true);
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: data.errorMessage,
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                },
                error: function () {
                    // Cerrar el loader en caso de error
                    Swal.close();

                    Swal.fire({
                        title: "Error",
                        text: "Hubo un error al realizar la petición.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    });
}


function clearRolesForm() {
    // Obtiene todos los checkboxes que están marcados
    const checkedCheckboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]:checked');
    // Desmarca cada checkbox
    checkedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    $("#IdRol").val("");
    $("#NombreRol").val("");
}

function showTableRoles() {
    // Verificar si la tabla ya ha sido inicializada
    if ($.fn.DataTable.isDataTable('#tblRoles'))
        $('#tblRoles').DataTable().destroy();

    // Inicializar (o volver a inicializar) la tabla
    $('#tblRoles').DataTable({
        ajax: {
            url: rolesContainer.Url + "/GetRoles",
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
                            <button class="btn btn-warning btn-sm edit-button" data-id="${row.IdRol}" data-rol="${row.NombreRol}">
                                <i class='bx bx-edit'></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        buttons: [
            {
                text: 'Nuevo',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    RolMode = "Add";
                    rolesContainer.Index.hide();
                    rolesContainer.Form.show();
                }
            }
        ]
    });
}