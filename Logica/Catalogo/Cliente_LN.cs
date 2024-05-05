using Datos;
using Modelo.Catalogo;
using Modelo.utils;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure.DependencyResolution;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Cliente_LN
    {
        private readonly Contexto _db;

        public Cliente_LN()
        {
            _db = new Contexto();

        }

        public bool GetClientesActivos(ref List<Cliente_VM> clientes, ref string errorMessage)
        {
            try
            {
                clientes = _db.Cliente
                    .Where(c => c.Activo)
                    .Select(c => new Cliente_VM
                    {
                        IdCliente = c.IdCliente,
                        Nombres = c.Nombres,
                        Apellidos = c.Apellidos,
                        Cedula = c.Cedula,
                        Correo = c.Correo,
                        Telefono = c.Telefono,
                        Activo = c.Activo
                    }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public List<DropDown> GetDepartamentosDropDown() 
        {
            try
            {
                List<DropDown> dep = _db.Departamento
                                .AsNoTracking()
                                .Select(x => new DropDown
                                {
                                    Id = x.IdDepartamento,
                                    Value = x.Nombre
                                }).ToList();

                return dep;
            }
            catch(Exception ex)
            {                
                return null;
            }
        }


        public bool GetClienteById(int idCliente, ref Cliente_VM cliente, ref string errorMessage)
        {
            try
            {
                cliente = _db.Cliente
                    .Where(c => c.IdCliente == idCliente && c.Activo)
                    .Select(c => new Cliente_VM
                    {
                        IdCliente = c.IdCliente,
                        Nombres = c.Nombres,
                        Apellidos = c.Apellidos,
                        Cedula = c.Cedula,
                        Correo = c.Correo,
                        Telefono = c.Telefono,
                        Activo = c.Activo,
                    })
                    .FirstOrDefault();

                if (cliente == null)
                {
                    errorMessage = "No se encontró el cliente o no está activo.";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                cliente = null; 
                errorMessage = $"Error al buscar el cliente: {ex.Message}";
                return false;
            }
        }

        public bool CreateCliente(Cliente_VM cliente, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Cliente_Create(
                    cliente.Nombres,
                    cliente.Apellidos,
                    cliente.Cedula,
                    cliente.Correo,
                    cliente.Telefono,
                    cliente.IdDepartamento,
                    cliente.CreadoPor,
                    true,
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

        public bool UpdateCliente(Cliente_VM cliente, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Cliente_Update(
                    cliente.IdCliente,
                    cliente.Nombres,
                    cliente.Apellidos,
                    cliente.Cedula,
                    cliente.Correo,
                    cliente.Telefono,
                    cliente.IdDepartamento,
                    true,
                    cliente.EditadoPor,
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

        public bool DeleteCliente(int idCliente, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Cliente_Delete(idCliente, eliminadoPor, isSuccessParam, errorMsgParam);

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
