using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
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

        public bool CreateUser(Usuario_VM user, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                _db.sp_Usuario_Create(user.Nombre, user.Apellidos, user.NombreUsuario, user.Correo, user.IdRol, user.Activo, user.Contrasena, isSuccessParam);

                return (int)isSuccessParam.Value == 1;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
        public bool UpdateUser(Usuario_VM user, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                _db.sp_Usuario_Update(user.IdUsuario, user.Nombre, user.Apellidos, user.NombreUsuario, user.Correo, user.Contrasena, user.IdRol, user.Activo, isSuccessParam);

                return (int)isSuccessParam.Value == 1;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
        public bool DeleteUser(int userId, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                _db.sp_Usuario_Delete(userId, isSuccessParam);

                return (int)isSuccessParam.Value == 1;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
    }
}
