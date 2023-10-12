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
        console.log(selectedControllers);
    });

});

const rolesContainer = {
    Url: '/Roles',
    Index: $('#Index-Rol'),
    Form: $('#Form-Rol')
}

async function loadControllers() {
    try {
        const response = await fetch(rolesContainer.Url + '/GetControllers', { method: 'POST' });
        const { status, data } = await response.json();

        if (!status) {
            console.error('Error retrieving controllers:', data);
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
                        <label class="form-check-label" for="${module}">${module}</label>
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

        // Prevenir que el acordeón se expanda/contraiga al clickear el checkbox del módulo
        checkboxContainer.querySelectorAll('.module-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Opcional: Si deseas que el acordeón NO se expanda/contraiga al clickear la etiqueta del checkbox del módulo
        checkboxContainer.querySelectorAll('.module-checkbox + label').forEach(label => {
            label.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Si deseas expandir el acordeón al marcar el checkbox del módulo
        checkboxContainer.querySelectorAll('.module-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const accordionBody = e.target.closest('.accordion-item').querySelector('.accordion-collapse');
                if (e.target.checked) {
                    accordionBody.classList.add('show');
                } else {
                    accordionBody.classList.remove('show');
                }
            });
        });

    } catch (err) {
        console.error('An error occurred:', err);
    }
}

function getSelectedControllers() {
    // Obtiene todos los checkboxes de controladores que están marcados
    const selectedCheckboxes = document.querySelectorAll('.controller-checkbox:checked');

    // Extrae los data-controller-id de los checkboxes seleccionados y los retorna en un array
    const selectedControllerIds = [...selectedCheckboxes].map(checkbox => checkbox.dataset.controllerId);

    return selectedControllerIds;
}

function clearRolesForm() {
    // Obtiene todos los checkboxes que están marcados
    const checkedCheckboxes = document.querySelectorAll('#checkbox-container input[type="checkbox"]:checked');

    // Desmarca cada checkbox
    checkedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
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
        buttons: [
            {
                text: 'Nuevo',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    rolesContainer.Index.hide();
                    rolesContainer.Form.show();
                }
            }
        ]
    });
}