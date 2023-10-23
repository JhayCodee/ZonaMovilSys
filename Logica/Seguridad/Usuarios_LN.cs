using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
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
                    Activo = u.Activo,
                    Rol = u.Rol.NombreRol
                }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool GetUserById(int userId, ref Usuario_VM data, ref string errorMessage)
        {
            try
            {
                var user = _db.Usuario.FirstOrDefault(u => u.IdUsuario == userId);
                if (user != null)
                {
                    data = new Usuario_VM
                    {
                        IdUsuario = user.IdUsuario,
                        Nombre = user.Nombre,
                        Apellidos = user.Apellidos,
                        NombreUsuario = user.NombreUsuario,
                        Correo = user.Correo,
                        Activo = user.Activo,
                        IdRol = user.IdRol,
                        Contrasena = user.Contrasena
                    };
                }
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
                var hash = new PasswordManager().HashPassword(user.Contrasena);

                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Usuario_Create(user.Nombre, user.Apellidos, user.NombreUsuario, user.Correo, user.IdRol, user.Activo, hash, isSuccessParam, errorMsgParam);

                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                    return false;
                }

                return true;
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
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Usuario_Update(user.IdUsuario, user.Nombre, user.Apellidos, user.NombreUsuario, user.Correo, user.IdRol, user.Activo, isSuccessParam, errorMsgParam);

                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                    return false;
                }

                return true;
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
        
        public bool ActivateUser(int userId, ref string errorMessage)
        {
            try
            {
                var user = _db.Usuario.Find(userId);
                if (user == null)
                {
                    errorMessage = "Usuario no encontrado";
                    return false;
                }
                user.Activo = true;
                _db.SaveChanges();

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
