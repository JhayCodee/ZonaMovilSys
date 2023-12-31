﻿using Datos;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Categoria_LN
    {
        private readonly Contexto _db;

        public Categoria_LN()
        {
            _db = new Contexto();
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

        public bool GetCategoriaById(int idCategoria, ref Categoria_VM cat, ref string errorMessage)
        {
            try
            {
                cat = _db.Categoria
                    .Where(c => c.IdCategoria == idCategoria && c.Activo)
                    .Select(c => new Categoria_VM
                    {
                       IdCategoria = c.IdCategoria,
                       Nombre = c.Nombre
                    })
                    .FirstOrDefault();

                if (cat == null)
                {
                    errorMessage = "No se encontró la categoria o no está activo.";
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                cat = null;
                errorMessage = $"Error al buscar la Categoria: {ex.Message}";
                return false;
            }
        }

        public bool CreateCategoria(Categoria_VM cat, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Categoria_Create(
                    cat.Nombre,
                    true,
                    cat.CreadoPor,
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

        public bool UpdateCategoria(Categoria_VM cat, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Categoria_Update(
                    cat.IdCategoria,
                    cat.Nombre,
                    true,
                    cat.EditadoPor,
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

        public bool DeleteCategoria(int IdCategoria, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Categoria_Delete(IdCategoria, eliminadoPor, isSuccessParam, errorMsgParam);

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
