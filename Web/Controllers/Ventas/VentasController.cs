using Logica.Catalogo;
using Logica.Ventas;
using Modelo.Catalogo;
using Modelo.Ventas;
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
            ViewBag.Clientes = new SelectList(clientesDropdown, "Id", "Value");
            ViewBag.Productos = new SelectList(productosDropdown, "Id", "Value");
            return View();
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
        public JsonResult Facturar(FacturaVenta_VM facturaVenta)
        {
            string errorMessage = string.Empty;
            facturaVenta.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CrearFacturaVenta(facturaVenta, ref errorMessage);

            return Json(new { status, errorMessage });
        }

    }
}