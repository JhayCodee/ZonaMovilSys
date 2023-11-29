using Logica.Catalogo;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Catalogos
{
    [VerificaSession]
    public class CategoriasController : BaseController
    {
        private readonly Categoria_LN _ln;

        public CategoriasController()
        {
            _ln = new Categoria_LN();
        }

        // GET: Categorias
        [AuthorizeUser(idOperacion: 5)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetCategoria()
        {
            List<Categoria_VM> data = new List<Categoria_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetCategorias(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetCategoriaById(int idCategoria)
        {
            Categoria_VM data = new Categoria_VM();
            string errorMessage = string.Empty;

            bool status = _ln.GetCategoriaById(idCategoria, ref data, ref errorMessage);

            return Json(new { status, data , errorMessage });
        }

        [HttpPost]
        public JsonResult CreateCategoria(Categoria_VM categoria)
        {
            string errorMessage = string.Empty;
            categoria.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CreateCategoria(categoria, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateCategoria(Categoria_VM categoria)
        {
            string errorMessage = string.Empty;
            categoria.EditadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.UpdateCategoria(categoria, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteCategoria(int idCategoria)
        {
            string errorMessage = string.Empty;
            bool status = _ln.DeleteCategoria(idCategoria, GetLoggedUser().IdUsuario, ref errorMessage);
            return Json(new { status, errorMessage });
        }

    }
}