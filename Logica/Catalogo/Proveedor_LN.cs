using Datos;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Proveedor_LN
    {
        private readonly Contexto _db;

        public Proveedor_LN()
        {
            _db = new Contexto();
        }

        public bool GetProveedores(ref List<Proveedor_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Proveedor
                        .Where(x => x.Activo)
                        .Select(x => new Proveedor_VM
                        {
                            IdProveedor = x.IdProveedor,
                            Nombre = x.Nombre,
                            Telefono = x.Telefono,
                            Correo = x.Correo,
                            Direccion = x.Direccion
                        }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool GetProveedorById(int idProveedor, ref Proveedor_VM proveedor, ref string errorMessage)
        {
            try
            {
                proveedor = _db.Proveedor
                    .Where(p => p.IdProveedor == idProveedor && p.Activo)
                    .Select(p => new Proveedor_VM
                    {
                        IdProveedor = p.IdProveedor,
                        Nombre = p.Nombre,
                        Telefono = p.Telefono,
                        Correo = p.Correo,
                        Direccion = p.Direccion
                    })
                    .FirstOrDefault();

                if (proveedor == null)
                {
                    errorMessage = "No se encontró el proveedor o no está activo.";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                proveedor = null;
                errorMessage = $"Error al buscar el proveedor: {ex.Message}";
                return false;
            }
        }

        public bool CreateProveedor(Proveedor_VM proveedor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Proveedor_Create(
                    proveedor.Nombre,
                    proveedor.Telefono,
                    proveedor.Correo,
                    proveedor.Direccion,
                    true,
                    proveedor.CreadoPor,
                    isSuccessParam,
                    errorMsgParam
                );

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

        public bool UpdateProveedor(Proveedor_VM proveedor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Proveedor_Update(
                    proveedor.IdProveedor,
                    proveedor.Nombre,
                    proveedor.Telefono,
                    proveedor.Correo,
                    proveedor.Direccion,
                    true,
                    proveedor.EditadoPor,
                    isSuccessParam,
                    errorMsgParam
                );

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

        public bool DeleteProveedor(int idProveedor, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Proveedor_Delete(idProveedor, eliminadoPor, isSuccessParam, errorMsgParam);

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
    }
}
