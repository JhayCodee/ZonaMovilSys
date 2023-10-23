using Datos;
using Logica.Seguridad;
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

        public Usuario_VM GetUserByEmailAndPassword(string email, string password, out string errorMsg)
        {
            errorMsg = null;

            var usuarioEntity = _db.Usuario.FirstOrDefault(u => u.NombreUsuario == email);

            // No se encontró el usuario
            if (usuarioEntity == null)
            {
                errorMsg = "Nombre de usuario incorrecto.";
                return null;
            }

            // Instancia de la clase PasswordManager
            PasswordManager pwdManager = new PasswordManager();

            // Se encontró el usuario pero la contraseña no coincide
            if (!pwdManager.VerifyPassword(password.Trim(), usuarioEntity.Contrasena))
            {
                errorMsg = "Contraseña incorrecta.";
                return null;
            }

            // Verifica si el usuario está activo
            if (!usuarioEntity.Activo)
            {
                errorMsg = "El usuario no está activo.";
                return null;
            }

            // Se encontró el usuario pero no tiene un rol activo
            if (usuarioEntity.Rol.Activo == false)
            {
                errorMsg = "No posee un rol";
                return null;
            }

            var usuarioVM = new Usuario_VM
            {
                IdUsuario = usuarioEntity.IdUsuario,
                NombreUsuario = usuarioEntity.NombreUsuario,
                Nombre = usuarioEntity.Nombre,
                Apellidos = usuarioEntity.Apellidos,
                Correo = usuarioEntity.Correo,
                IdRol = usuarioEntity.IdRol,
                Activo = usuarioEntity.Activo
            };

            return usuarioVM;
        }



    }
}
