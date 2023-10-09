using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seguridad
{
    public class Acceso_LN
    {
        private readonly Contexto _db;

        public Acceso_LN()
        {
            _db = new Contexto();
        }

        public bool UserHasPermission(Usuario_VM user, int idOperacion)
        {
            var hasPermission = _db.RolOperacion.AsNoTracking().Any(r => r.IdOperacion == idOperacion && r.IdRol == user.IdRol);
            return (hasPermission) ? true : false;
        }

        public Dictionary<string, List<Controlador_VM>> GetAllowedControllersForUser(Usuario_VM user)
        {
            // Obtiene los controladores permitidos en una sola consulta
            var allowedControllers = (from ro in _db.RolOperacion.AsNoTracking()
                                      join op in _db.Operacion.AsNoTracking() on ro.IdOperacion equals op.IdOperacion
                                      join co in _db.Controlador.AsNoTracking() on op.IdControlador equals co.IdControlador
                                      where ro.IdRol == user.IdRol && co.Activo
                                      select new { co.NombreControlador, co.Icono, ModuloNombre = co.Modulo.NombreModulo })
                                      .Distinct()
                                      .ToList();

            // Agrupa los controladores por modulo y crea instancias de Controlador_VM
            var groupedByModule = allowedControllers
                .GroupBy(co => co.ModuloNombre)
                .ToDictionary(g => g.Key, g => g.Select(co => new Controlador_VM
                {
                    NombreControlador = co.NombreControlador,
                    Icono = co.Icono
                }).ToList());

            return groupedByModule;
        }

        public Usuario_VM GetUserByEmailAndPassword(string email, string password)
        {
            var usuarioEntity = _db.Usuario.FirstOrDefault(u => u.NombreUsuario == email && u.Contrasena == password.Trim());

            if (usuarioEntity == null) return null; // Retornar null si no se encuentra el usuario

            var usuarioVM = new Usuario_VM
            {
                IdUsuario = usuarioEntity.IdUsuario,
                NombreUsuario = usuarioEntity.NombreUsuario,
                Nombre = usuarioEntity.Nombre,
                Apellidos = usuarioEntity.Apellidos,
                Correo = usuarioEntity.Correo,
                Cedula = usuarioEntity.Cedula,
                IdRol = usuarioEntity.IdRol,
                Activo = usuarioEntity.Activo
            };

            return usuarioVM;
        }
    }
}
