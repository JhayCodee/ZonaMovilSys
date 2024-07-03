using Logica.Ventas;
using Modelo.Ventas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Ventas
{
    [VerificaSession]
    public class GarantiasController : BaseController
    {
        private readonly Garantia_LN _ln;

        public GarantiasController()
        {
            _ln = new Garantia_LN();
        }


        // GET: Garantias
        [AuthorizeUser(idOperacion: 11)]
        public ActionResult Index()
        {
            ViewBag.PageName = "garantias";  // Pasa el nombre de la página actual
            return View();
        }

        [HttpPost]
        public JsonResult GetGarantias()
        {
            List<Garantia_VM> data = new List<Garantia_VM>();
            string errorMessage = string.Empty;
            bool status = _ln.GetGarantias(ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult ReclamarGarantia(Garantia_VM garantia)
        {
            string errorMessage = string.Empty;
            bool status = _ln.ReclamarGarantia(garantia, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult FinalizarGarantia(int idGarantia)
        {
            string errorMessage = string.Empty;
            bool status = _ln.FinalizarGarantia(idGarantia, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult EntregarGarantia(int id)
        {
            string errorMessage = string.Empty;
            bool status = _ln.EntregarGarantia(id, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult ExtenderGarantia(int idGarantia, DateTime nuevaFechaFin)
        {
            string errorMessage = string.Empty;
            bool status = _ln.ExtenderGarantia(idGarantia, nuevaFechaFin, ref errorMessage);
            return Json(new { status, errorMessage });
        }

    }
}