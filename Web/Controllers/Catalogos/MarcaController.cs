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
    public class MarcaController : BaseController
    {
        private readonly Marca_LN _ln;

        public MarcaController()
        {
            _ln = new Marca_LN();
        }


        // GET: Marca
        [AuthorizeUser(idOperacion: 7)]
        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public JsonResult GetMarcas()
        {
            List<Marca_VM> data = new List<Marca_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetMarcas(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetMarcaById(int idMarca)
        {
            Marca_VM marca = new Marca_VM();
            string errorMessage = string.Empty;

            bool status = _ln.GetMarcaById(idMarca, ref marca, ref errorMessage);

            return Json(new { status, data = marca, errorMessage });
        }

        [HttpPost]
        public JsonResult CreateMarca(Marca_VM marca)
        {
            string errorMessage = string.Empty;
            marca.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CreateMarca(marca, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateMarca(Marca_VM marca)
        {
            string errorMessage = string.Empty;
            marca.EditadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.UpdateMarca(marca, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteMarca(int idMarca)
        {
            string errorMessage = string.Empty;
            bool status = _ln.DeleteMarca(idMarca, GetLoggedUser().IdUsuario, ref errorMessage);

            return Json(new { status, errorMessage });
        }
    }
}
