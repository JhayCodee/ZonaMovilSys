using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Actualizar la información básica del usuario
                    ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                    ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                    _db.sp_Usuario_Update(user.IdUsuario, user.Nombre, user.Apellidos, user.NombreUsuario, user.Correo, user.IdRol, user.Activo, isSuccessParam, errorMsgParam);

                    if ((int)isSuccessParam.Value == 0)
                    {
                        errorMessage = errorMsgParam.Value.ToString();
                        return false;
                    }

                    // Si la contraseña no es nula ni vacía, actualizar la contraseña
                    if (!string.IsNullOrEmpty(user.Contrasena))
                    {
                        var hash = new PasswordManager().HashPassword(user.Contrasena);

                        var usuario = _db.Usuario.SingleOrDefault(u => u.IdUsuario == user.IdUsuario);
                        if (usuario != null)
                        {
                            usuario.Contrasena = hash;
                            _db.SaveChanges();
                        }
                        else
                        {
                            errorMessage = "Usuario no encontrado.";
                            return false;
                        }
                    }

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

        public bool UpdateUserInfo(Usuario_VM user, ref string errorMessage)
        {
            try
            {
                int id = user.IdUsuario;
                string storedHash = _db.Usuario.Where(x => x.IdUsuario == id).Select(x => x.Contrasena).FirstOrDefault();

                // Usar PasswordManager para verificar la contraseña
                PasswordManager passwordManager = new PasswordManager();
                if (!passwordManager.VerifyPassword(user.Contrasena, storedHash))
                {
                    errorMessage = "La contraseña proporcionada es incorrecta.";
                    return false;
                }

                // Si la contraseña es correcta, continuar con la actualización del usuario
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

        public bool UpdateUserPassword(string currentPassword, string newPassword, string confirmNewPassword, int userId, ref string errorMessage)
        {
            try
            {
                // Verificar que las nuevas contraseñas coinciden
                if (newPassword != confirmNewPassword)
                {
                    errorMessage = "Las nuevas contraseñas no coinciden.";
                    return false;
                }

                // Obtener el hash de la contraseña almacenada
                var user = _db.Usuario.FirstOrDefault(u => u.IdUsuario == userId);
                if (user == null)
                {
                    errorMessage = "Usuario no encontrado.";
                    return false;
                }

                // Verificar la contraseña actual
                PasswordManager passwordManager = new PasswordManager();
                if (!passwordManager.VerifyPassword(currentPassword, user.Contrasena))
                {
                    errorMessage = "La contraseña actual es incorrecta.";
                    return false;
                }

                // Actualizar con la nueva contraseña
                user.Contrasena = passwordManager.HashPassword(newPassword);
                _db.Entry(user).State = EntityState.Modified;
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
