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

        public JsonResult ReporteFinancieroPorPeriodo(DateTime fechaInicio, DateTime fechaFin)
        {
            List<ReporteFinancieroVM> reportes;
            bool result = _reporteVentaLN.ObtenerReporteFinancieroPorPeriodo(fechaInicio, fechaFin, out reportes);

            ViewBag.FechaInicio = fechaInicio;
            ViewBag.FechaFin = fechaFin;

            if (!result)
            {
                return Json(new { success = false, message = "No hay datos disponibles para el rango de fechas seleccionado." }, JsonRequestBehavior.AllowGet);
            }

            string fileName = $"Reporte_Financiero_{fechaInicio.ToString("yyyyMMdd")}_{fechaFin.ToString("yyyyMMdd")}.pdf";
            var pdfResult = new ViewAsPdf("ReporteFinancieroPorPeriodo", reportes)
            {
                FileName = fileName
            };

            byte[] pdfData = pdfResult.BuildFile(ControllerContext);
            string base64Pdf = Convert.ToBase64String(pdfData);

            return Json(new { success = true, fileName = fileName, fileData = base64Pdf }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReporteGarantiasPorPeriodo(DateTime fechaInicio, DateTime fechaFin)
        {
            List<ReporteGarantiaVM> reportes;
            bool result = _reporteVentaLN.ObtenerReporteGarantiasPorPeriodo(fechaInicio, fechaFin, out reportes);

            ViewBag.FechaInicio = fechaInicio;
            ViewBag.FechaFin = fechaFin;

            if (!result)
            {
                return Json(new { success = false, message = "No hay datos disponibles para el rango de fechas seleccionado." }, JsonRequestBehavior.AllowGet);
            }

            string fileName = $"Reporte_Garantias_{fechaInicio.ToString("yyyyMMdd")}_{fechaFin.ToString("yyyyMMdd")}.pdf";
            var pdfResult = new ViewAsPdf("ReporteGarantiasPorPeriodo", reportes)
            {
                FileName = fileName
            };

            byte[] pdfData = pdfResult.BuildFile(ControllerContext);
            string base64Pdf = Convert.ToBase64String(pdfData);

            return Json(new { success = true, fileName = fileName, fileData = base64Pdf }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReporteInventarioActual()
        {
            List<ReporteInventarioVM> reportes;
            bool result = _reporteVentaLN.ObtenerReporteInventarioActual(out reportes);

            if (!result)
            {
                return Json(new { success = false, message = "No hay datos disponibles para el inventario actual." }, JsonRequestBehavior.AllowGet);
            }

            string fileName = $"Reporte_Inventario_{DateTime.Now.ToString("yyyyMMdd")}.pdf";
            var pdfResult = new ViewAsPdf("ReporteInventarioActual", reportes)
            {
                FileName = fileName
            };

            byte[] pdfData = pdfResult.BuildFile(ControllerContext);
            string base64Pdf = Convert.ToBase64String(pdfData);

            return Json(new { success = true, fileName = fileName, fileData = base64Pdf }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReporteClientesPorPeriodo(DateTime fechaInicio, DateTime fechaFin)
        {
            List<ReporteClienteVM> reportes;
            bool result = _reporteVentaLN.ObtenerReporteClientes(fechaInicio, fechaFin, out reportes);

            ViewBag.FechaInicio = fechaInicio;
            ViewBag.FechaFin = fechaFin;

            if (!result)
            {
                return Json(new { success = false, message = "No hay datos disponibles para el rango de fechas seleccionado." }, JsonRequestBehavior.AllowGet);
            }

            string fileName = $"Reporte_Clientes_{fechaInicio.ToString("yyyyMMdd")}_{fechaFin.ToString("yyyyMMdd")}.pdf";
            var pdfResult = new ViewAsPdf("ReporteClientesPorPeriodo", reportes)
            {
                FileName = fileName
            };

            byte[] pdfData = pdfResult.BuildFile(ControllerContext);
            string base64Pdf = Convert.ToBase64String(pdfData);

            return Json(new { success = true, fileName = fileName, fileData = base64Pdf }, JsonRequestBehavior.AllowGet);
        }

    }
}