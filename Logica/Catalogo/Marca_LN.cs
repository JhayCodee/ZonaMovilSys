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
    public class Marca_LN
    {
        private readonly Contexto _db;

        public Marca_LN()
        {
            _db = new Contexto();
        }

        public bool GetMarcas(ref List<Marca_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Marca
                        .Where(x => x.Activo)
                        .Select(x => new Marca_VM { 
                            IdMarca = x.IdMarca,
                            Nombre = x.Nombre
                        }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool GetMarcaById(int idMarca, ref Marca_VM marca, ref string errorMessage)
        {
            try
            {
                marca = _db.Marca
                    .Where(m => m.IdMarca == idMarca && m.Activo)
                    .Select(m => new Marca_VM
                    {
                        IdMarca = m.IdMarca,
                        Nombre = m.Nombre
                    })
                    .FirstOrDefault();

                if (marca == null)
                {
                    errorMessage = "No se encontró la marca o no está activa.";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                marca = null;
                errorMessage = $"Error al buscar la marca: {ex.Message}";
                return false;
            }
        }

        public bool CreateMarca(Marca_VM marca, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Marca_Create(
                    marca.Nombre,
                    true,
                    marca.CreadoPor,
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
        public bool UpdateMarca(Marca_VM marca, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Marca_Update(
                    marca.IdMarca,
                    marca.Nombre,
                    true,
                    marca.EditadoPor,
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

        public bool DeleteMarca(int idMarca, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Marca_Delete(idMarca, eliminadoPor, isSuccessParam, errorMsgParam);

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

