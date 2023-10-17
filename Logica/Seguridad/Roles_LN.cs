using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Seguridad
{
    public class Roles_LN
    {

        private readonly Contexto _db;

        public Roles_LN()
        {
            _db = new Contexto();
        }

        public bool GetRoles(ref List<Roles_VM> list, ref string errorMessage)
        {
            try
            {
                list = _db.Rol
                        .Where(r => r.Activo)
                        .Select(r => new Roles_VM
                        {
                            IdRol = r.IdRol,
                            NombreRol = r.NombreRol
                        }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool GetControllersByRol(int idRol, ref List<int?> controllers, ref string errorMessage)
        {
            try
            {
                // Obtener las operaciones asociadas con el rol de la tabla 'RolOperacion'.
                var operationIds = _db.RolOperacion
                                      .Where(ro => ro.IdRol == idRol)
                                      .Select(ro => ro.IdOperacion)
                                      .ToList();

                // Obtener los identificadores de los controladores asociados con esas operaciones de la tabla 'Operacion'.
                controllers = _db.Operacion
                                 .Where(o => operationIds.Contains(o.IdOperacion))
                                 .Select(o => o.IdControlador)
                                 .Distinct()  
                                 .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }


        public bool AddRol(List<int> controllers, string rolName, ref string errorMessage)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Paso 1: Crear y guardar el nuevo rol
                    Rol r = new Rol
                    {
                        NombreRol = rolName,
                        Activo = true
                    };
                    _db.Rol.Add(r);
                    _db.SaveChanges();

                    // Paso 2: Recuperar las operaciones asociadas a los ID de controladores proporcionados
                    var operaciones = _db.Operacion
                                       .Where(o => o.IdControlador.HasValue && controllers.Contains(o.IdControlador.Value))
                                       .ToList();


                    // Paso 3: Crear nuevas entidades RolOperacion que vinculen el nuevo rol con las operaciones recuperadas
                    foreach (var operacion in operaciones)
                    {
                        RolOperacion ro = new RolOperacion
                        {
                            IdRol = r.IdRol,
                            IdOperacion = operacion.IdOperacion
                        };
                        _db.RolOperacion.Add(ro);
                    }

                    // Paso 4: Guardar estas nuevas entidades RolOperacion en la base de datos
                    _db.SaveChanges();

                    // Si todas las operaciones han sido exitosas, confirma la transacción
                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    errorMessage = ex.Message;
                    return false;
                }
            }
        }

        public bool UpdateRol(int idRol, List<int?> newControllers, string rolName, ref string errorMessage)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Paso 1: Obtener el rol existente y actualizar el nombre si es necesario
                    var rol = _db.Rol.Find(idRol);
                    rol.NombreRol = rolName;
                    _db.Entry(rol).State = EntityState.Modified;

                    // Paso 2: Obtener las operaciones existentes para este rol
                    var existingOperations = _db.RolOperacion
                                               .Where(ro => ro.IdRol == idRol)
                                               .Select(ro => ro.Operacion)
                                               .ToList();

                    var existingControllers = existingOperations
                                              .Select(o => o.IdControlador)
                                              .Distinct()
                                              .ToList();

                    // Paso 3: Determinar qué controladores deben ser añadidos y cuáles eliminados
                    var controllersToAdd = newControllers.Except(existingControllers).ToList();
                    var controllersToRemove = existingControllers.Except(newControllers).ToList();

                    // Paso 4: Añadir nuevas operaciones
                    foreach (int c in controllersToAdd)
                    {
                        var operationsToAdd = _db.Operacion
                                                 .Where(o => o.IdControlador == c)
                                                 .ToList();

                        foreach (var op in operationsToAdd)
                        {
                            RolOperacion ro = new RolOperacion
                            {
                                IdRol = idRol,
                                IdOperacion = op.IdOperacion
                            };
                            _db.RolOperacion.Add(ro);
                        }
                    }

                    // Paso 5: Eliminar operaciones que ya no son necesarias
                    var operationsToRemove = _db.Operacion
                                                .Where(o => controllersToRemove.Contains(o.IdControlador.Value))
                                                .ToList();

                    foreach (var op in operationsToRemove)
                    {
                        var rolOperacionToRemove = _db.RolOperacion
                                                     .FirstOrDefault(ro => ro.IdOperacion == op.IdOperacion && ro.IdRol == idRol);

                        if (rolOperacionToRemove != null)
                            _db.RolOperacion.Remove(rolOperacionToRemove);
                    }

                    // Paso 6: Guardar cambios y confirmar la transacción
                    _db.SaveChanges();
                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    errorMessage = ex.Message;
                    return false;
                }
            }
        }
    }
}
