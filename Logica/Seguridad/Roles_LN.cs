using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
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


    }
}
