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
    public class Color_LN
    {
        private readonly Contexto _db;

        public Color_LN()
        {
            _db = new Contexto();

        }

        public bool GetColores(ref List<Color_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Color
                        .Where(x => x.Activo)
                        .Select(x => new Color_VM
                        {
                            IdColor = x.IdColor,
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


        public bool GetCategorias(ref List<Categoria_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Categoria
                        .Where(x => x.Activo)
                        .Select(x => new Categoria_VM
                        {
                            IdCategoria = x.IdCategoria,
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

        public bool GetColoraById(int idColor, ref Color_VM cat, ref string errorMessage)
        {
            try
            {
                cat = _db.Color
                    .Where(c => c.IdColor == idColor && c.Activo)
                    .Select(c => new Color_VM
                    {
                        IdColor = c.IdColor,
                        Nombre = c.Nombre
                    })
                    .FirstOrDefault();

                if (cat == null)
                {
                    errorMessage = "No se encontró el color o no está activo.";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                cat = null;
                errorMessage = $"Error al buscar el color: {ex.Message}";
                return false;
            }
        }

        public bool CreateColor(Color_VM col, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Color_Create(
                    col.Nombre,
                    true,
                    col.CreadoPor,
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

        public bool UpdateColor(Color_VM col, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Color_Update(
                    col.IdColor,
                    col.Nombre,
                    true,
                    col.EditadoPor,
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

        public bool DeleteColor(int idColor, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Color_Delete(idColor, eliminadoPor, isSuccessParam, errorMsgParam);

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
