using Logica;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers
{
    [VerificaSession]
    public class DashboardController : BaseController
    {
        private readonly Dashboard_LN _reporteService;

        public DashboardController()
        {
            _reporteService = new Dashboard_LN();
        }

        public ActionResult Index()
        {
            var gananciasPorMes = _reporteService.ObtenerGananciasPorMes();
            var totalProductosVendidos = _reporteService.ObtenerTotalProductosVendidos();
            var marcasMasVendidas = _reporteService.ObtenerMarcasMasVendidas();
            var productosMasVendidos = _reporteService.ObtenerProductosMasVendidos();

            ViewBag.GananciasPorMes = gananciasPorMes;
            ViewBag.TotalProductosVendidos = totalProductosVendidos;
            ViewBag.MarcasMasVendidas = marcasMasVendidas;
            ViewBag.ProductosMasVendidos = productosMasVendidos;

            return View();
        }

    }
}