using Logica.Ventas;
using Modelo.Ventas;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Ventas
{
    [VerificaSession]
    public class ReporteVentasController : BaseController
    {
        private readonly ReporteVenta_LN _reporteVentaLN;

        public ReporteVentasController()
        {
            _reporteVentaLN = new ReporteVenta_LN();
        }

        // GET: ReporteVentas
        [AuthorizeUser(idOperacion: 20)]
        public ActionResult Index()
        {
            return View();
        }

        // GET: ReporteVentasPorPeriodo
        public JsonResult ReporteVentasPorPeriodo(DateTime fechaInicio, DateTime fechaFin)
        {
            List<Reporte_VM> reportes;
            bool result = _reporteVentaLN.ObtenerReporteVentasPorPeriodo(fechaInicio, fechaFin, out reportes);

            ViewBag.FechaInicio = fechaInicio;
            ViewBag.FechaFin = fechaFin;

            if (!result)
            {
                return Json(new { success = false, message = "No hay datos disponibles para el rango de fechas seleccionado." }, JsonRequestBehavior.AllowGet);
            }

            string fileName = $"Reporte_Ventas_{fechaInicio.ToString("yyyyMMdd")}_{fechaFin.ToString("yyyyMMdd")}.pdf";
            var pdfResult = new ViewAsPdf("ReporteVentasPorPeriodo", reportes)
            {
                FileName = fileName
            };

            byte[] pdfData = pdfResult.BuildFile(ControllerContext);
            string base64Pdf = Convert.ToBase64String(pdfData);

            return Json(new { success = true, fileName = fileName, fileData = base64Pdf }, JsonRequestBehavior.AllowGet);
        }
    }
}