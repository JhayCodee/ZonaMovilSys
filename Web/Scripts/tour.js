function iniciarTour(pageName) {
    var tour = introJs();
    //var steps = [];

    let steps;
    var instrucciones = `<div>
                            <strong>2. Ver Cantidad de Entradas</strong>
                            <p>Esta función le permite regular la cantidad de información que desea ver en la tabla.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/ver.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                            <br>
                        </div>
                         <div>
                            <strong>3. Buscador</strong>
                            <p>Esta función le permite buscar dentro de la lista. Puede ingresar cualquier dato relevante para filtrar los resultados y encontrar rápidamente lo que necesita.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/buscar.png" style="max-width: 100%; height: auto;" alt="Buscar"/>
                            </div>
                            <br>
                        </div>
                        <div>
                            <strong>4. Editar</strong>
                            <p>Esta función le permite editar la información de los datos existentes. Puede actualizar detalles y otras características relevantes.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/editar.png" style="max-width: 100%; height: auto;" alt="Editar"/>
                            </div>
                            <br>
                        </div>
                        <div>
                            <strong>5. Eliminar</strong>
                            <p>Esta función le permite eliminar la información que ya no es necesaria o poder revertir un error.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/eliminar.png" style="max-width: 100%; height: auto;" alt="Eliminar"/>
                            </div>
                            <br>
                        </div>
                        <div>
                            <strong>6. Navegar</strong>
                            <p>Esta función le ayudara a moverse entre la información.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/pagina.png" style="max-width: 100%; height: auto;" alt="Navegar"/>
                            </div>
                            <br>
                        </div>
                    </div >
                `

    switch (pageName) {
        //------------------------------> SECCIÓN CATALOGO
        case 'categoria':
            steps = [
                {
                    element: '#Index-Categoria',
                    title: 'Bienvenido a la Sección de Categorías de Productos',
                    intro: 'Esta sección le permite gestionar y organizar sus productos de manera eficiente a través de diferentes categorías. La categorización de productos es esencial para mantener su inventario ordenado y facilitar la búsqueda y navegación de los productos en su tienda. Aquí podrá: Crear nuevas categorías, Editar categorías existentes, Eliminar categorías.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                        <div>
                            <strong>1. Agregar</strong>
                            <p>Este botón le permite agregar una nueva categoría a la lista desplegando un formulario donde podrá ingresar el nombre y detalles de la nueva categoría.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nueva Categoría"/>
                            </div>
                            <br>
                            ${instrucciones}                                             
                    </div>
                `,
                    position: 'bottom'
                }
            ];
            break;
         case 'clientes':
            steps = [
                {
                    element: '#Index-Clientes',
                    title: 'Bienvenido a la Sección de Clientes',
                    intro: 'Esta sección le permite gestionar la información de sus clientes. Aquí podrá: Crear nuevos clientes, Editar clientes existentes, Eliminar clientes.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                        <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo cliente a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nuevo Cliente"/>
                        </div>
                        <br>
                        ${instrucciones}                        
                    </div>                    
                `,
                    position: 'bottom'
                }
            ];
            break;
        case 'colores':
            steps = [
                {
                    element: '#Index-Color',
                    title: 'Bienvenido a la Sección de Colores',
                    intro: 'Esta sección le permite gestionar la gama de colores. Aquí podrá: Crear nuevos colores, Editar y Eliminar.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo color a la lista; para ser usado en las descripciones de productos.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nueva Categoría"/>
                        </div>
                        <br>
                        ${instrucciones}
                    </div>                    
                `,
                    position: 'bottom'
                }
            ];
            break;
        case 'marcas':
            steps = [
                {
                    element: '#Index-Marca',
                    title: 'Bienvenido a la Sección de Marcas',
                    intro: 'Esta sección le permite gestionar las marcas de los productos. Aquí podrá: Crear nuevas marcas, Editar y Eliminar.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar una nueva marca a la lista; para ser usada en las descripciones de productos.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nueva Marca"/>
                        </div>
                        <br>
                        ${instrucciones}
                    </div>                    
                `,
                    position: 'bottom'
                }
            ];
            break;
        case 'productos':
            steps = [
                {
                    element: '#Index-Productos',
                    title: 'Bienvenido a la Sección de Productos',
                    intro: 'Esta sección le permite gestionar los productos de su tienda. Aquí podrá: Crear nuevos productos, Editar productos existentes, Eliminar productos.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo producto a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nuevo Producto"/>
                        </div>
                        <br>
                        ${instrucciones}
                    </div>                    
                `,
                }
            ];
            break;
        case 'proveedores':
            steps = [
                {
                    element: '#Index-Proveedores',
                    title: 'Bienvenido a la Sección de Proveedores',
                    intro: 'Esta sección le permite gestionar la información de sus proveedores. Aquí podrá: Crear nuevos proveedores, Editar proveedores existentes, Eliminar proveedores.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo proveedor a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nuevo Proveedor"/>
                        </div>
                        <br>
                        ${instrucciones}
                    </div>                    
                `,
                }
            ];
            break;
        //------------------------------> SECCIÓN VENTAS
        case 'garantias':
            steps = [
                {
                    element: '#Index-Garantia',
                    title: 'Bienvenido a la Sección de Garantías',
                    intro: 'Esta sección le permite gestionar la información de las garantías de los productos. Aquí podrá: Crear nuevas garantías, Editar garantías existentes, Eliminar garantías.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">                       
                        <div>
                            <strong>1. Ver Cantidad de Entradas</strong>
                            <p>Esta función le permite regular la cantidad de información que desea ver en la tabla.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/ver.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                         <div>
                            <strong>2. Buscador</strong>
                            <p>Esta función le permite buscar dentro de la lista. Puede ingresar cualquier dato relevante para filtrar los resultados y encontrar rápidamente lo que necesita.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/buscar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>3. Extender Garantía</strong>
                            <p>Esta función le permitira extender la garantía del producto.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/extender.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>4. Reclamar Garantía</strong>
                            <p>Este botón permitira hacer el reclamo de la garantía de un producto.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/reclamar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>5. Finalizar Garantía</strong>
                            <p>Este botón permitira terminar de manera manual la garantía de un producto.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/finalizar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>6. Navegar</strong>
                            <p>Esta función le ayudara a moverse entre la información.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/pagina.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                    </div>
                    `,
                }
            ];
            break;
        case 'ventas':
            steps = [
                {
                    element: '#Venta-Index',
                    title: 'Bienvenido a la Sección de Ventas',
                    intro: 'Esta sección le permite gestionar las ventas de su tienda. Aquí podrá: Crear nuevas ventas, Editar ventas existentes, Eliminar ventas.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar una nueva venta a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nueva Venta"/>
                        </div>
                        <div>
                            <strong>2. Ver Cantidad de Entradas</strong>
                            <p>Esta función le permite regular la cantidad de información que desea ver en la tabla.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/ver.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                         <div>
                            <strong>3. Buscador</strong>
                            <p>Esta función le permite buscar dentro de la lista. Puede ingresar cualquier dato relevante para filtrar los resultados y encontrar rápidamente lo que necesita.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/buscar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>4. Imprimir</strong>
                            <p>Este botón le permite imprimir la factura.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/imprimir.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>5. Anular</strong>
                            <p>Esta función le permite anular la factura.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/eliminar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>6. Ver Anulación</strong>
                            <p>Este botón mostrara los detalles de anulación de la factura.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/eliminar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>7. Navegar</strong>
                            <p>Esta función le ayudara a moverse entre la información.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/pagina.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                    </div>                   
                `,
                }
            ];
            break;
            //------------------------------> SECCIÓN SEGURIDAD
        case 'roles':
            steps = [
                {
                    element: '#Index-Rol',
                    title: 'Bienvenido a la Sección de Roles',
                    intro: 'Esta sección le permite gestionar los roles de usuario. Aquí podrá: Crear nuevos roles, Editar roles existentes, Eliminar roles.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo rol a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nuevo Rol"/>
                        </div>
                        <div>
                            <strong>2. Ver Cantidad de Entradas</strong>
                            <p>Esta función le permite regular la cantidad de información que desea ver en la tabla.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/ver.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                         <div>
                            <strong>3. Buscador</strong>
                            <p>Esta función le permite buscar dentro de la lista. Puede ingresar cualquier dato relevante para filtrar los resultados y encontrar rápidamente lo que necesita.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/buscar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>4. Editar</strong>
                            <p>Esta función le permite editar la información de los datos existentes. Puede actualizar detalles y otras características relevantes.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/editar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>            
                        <div>
                            <strong>5. Navegar</strong>
                            <p>Esta función le ayudara a moverse entre la información.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/pagina.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                     </div>                     
                `,
                },
            ];
            break;
        case 'usuarios':
            steps = [
                {
                    element: '#Index-User',
                    title: 'Bienvenido a la Sección de Usuarios',
                    intro: 'Esta sección le permite gestionar la información de los usuarios. Aquí podrá: Crear nuevos usuarios, Editar usuarios existentes, Eliminar usuarios.',
                    position: 'bottom'
                },
                {
                    title: 'FUNCIONES',
                    intro: `
                    <div style="max-height: 300px; max-width: 800px; overflow-y: auto; padding-right: 10px;">
                    <strong>1. Agregar</strong>
                        <p>Este botón le permite agregar un nuevo usuario a la lista desplegando un formulario donde deberá llenarlo.</p>
                        <div style="text-align: center;">
                            <img src="/Imagenes/imagenes/nuevo.png" style="max-width: 100%; height: auto;" alt="Agregar Nuevo Usuario"/>
                        </div>
                        <div>
                            <strong>2. Ver Cantidad de Entradas</strong>
                            <p>Esta función le permite regular la cantidad de información que desea ver en la tabla.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/ver.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                         <div>
                            <strong>3. Buscador</strong>
                            <p>Esta función le permite buscar dentro de la lista. Puede ingresar cualquier dato relevante para filtrar los resultados y encontrar rápidamente lo que necesita.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/buscar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>4. Editar</strong>
                            <p>Esta función le permite editar la información de los datos existentes. Puede actualizar detalles y otras características relevantes.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/editar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>5. Eliminar</strong>
                            <p>Esta función le permite eliminar la información que ya no es necesaria o poder revertir un error.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/eliminar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>6. Activar</strong>
                            <p>Esta botón activa el estado del usuario.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/activar.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                        <div>
                            <strong>7. Navegar</strong>
                            <p>Esta función le ayudara a moverse entre la información.</p>
                            <div style="text-align: center;">
                                <img src="/Imagenes/imagenes/pagina.png" style="max-width: 100%; height: auto;" alt="Ver Cantidad de Entradas"/>
                            </div>
                        </div>
                    </div>                    
                `,
                },
            ];
            break;
        default:
            steps = [];
            break;
    }


    tour.setOptions({ steps: steps });
    tour.start();
}

document.addEventListener('DOMContentLoaded', function () {
    var pageName = document.body.getAttribute('data-page-name');
    if (pageName) {
        document.getElementById('btnHelp').addEventListener('click', function () {
            iniciarTour(pageName);
        });
    }
});