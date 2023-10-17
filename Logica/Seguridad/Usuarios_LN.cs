using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Seguridad
{
    public class Usuarios_LN
    {
        private readonly Contexto _db;

        public Usuarios_LN()
        {
            _db = new Contexto();
        }

        public bool GetUsers(ref List<Usuario_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Usuario.Select(u => new Usuario_VM
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Apellidos = u.Apellidos,
                    NombreUsuario = u.NombreUsuario,
                    Correo = u.Correo,
                    Cedula = u.Cedula,
                    Activo = u.Activo
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
