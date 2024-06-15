using Logica.Catalogo;
using Logica.Ventas;
using Modelo.Catalogo;
using Modelo.Ventas;
using Rotativa;
using System.Collections.Generic;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Ventas
{
    [VerificaSession]
    public class VentasController : BaseController
    {
        private readonly Ventas_LN _ln;

        public VentasController()
        {
            _ln = new Ventas_LN();
        }

        [AuthorizeUser(idOperacion: 10)]
        public ActionResult Index()
        {
            var clientesDropdown = _ln.GetClientesDropdown();
            var productosDropdown = _ln.GetProductosDropdown();
            var departamentosDropdown = _ln.GetDepartamentoDropdown();
            ViewBag.Clientes = new SelectList(clientesDropdown, "Id", "Value");
            ViewBag.Productos = new SelectList(productosDropdown, "Id", "Value");
            ViewBag.Departamentos = new SelectList(departamentosDropdown, "Id", "Value");
            return View();
        }

        public ActionResult ImprimirFactura(int id)
        {
            List<DetalleFacturaPrint_VM> data = new List<DetalleFacturaPrint_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetDetalleFactura(id, ref data, ref errorMessage);

            return new ViewAsPdf("~/Views/Templates/Factura.cshtml", data)
            {
                FileName = "Factura.pdf",
                CustomSwitches = "--print-media-type"
            };

        }

        [HttpPost]
        public JsonResult GetFacturas()
        {
            List<FacturaVenta_VM> data = new List<FacturaVenta_VM>();
            string errorMessage = string.Empty;
            bool status = _ln.GetFacturas(ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetProductsById(int productId)
        {
            Producto_VM data = new Producto_VM();
            string errorMessage = string.Empty;
            bool status = new Productos_LN().GetProductById(productId, ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetDetalleAnulacion(int productId)
        {
            FacturaVenta_VM data = new FacturaVenta_VM();
            string errorMessage = string.Empty;
            bool status = _ln.GetDetalleAnulacion(productId, ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult Facturar(FacturaVenta_VM facturaVenta)
        {
            string errorMessage = string.Empty;
            facturaVenta.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CrearFacturaVenta(facturaVenta, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult AnularFactura(int id, string razonAnulamiento)
        {
            string errorMessage = string.Empty;
            bool status = _ln.AnularFacturaVenta(id, GetLoggedUser().IdUsuario, razonAnulamiento, ref errorMessage);
            return Json(new { status, errorMessage });
        }

    }
}