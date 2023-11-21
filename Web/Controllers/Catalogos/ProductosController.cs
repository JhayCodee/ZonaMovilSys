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
    public class ProductosController : BaseController
    {
        private readonly Productos_LN _ln;

        public ProductosController()
        {
            _ln = new Productos_LN();
        }

        [AuthorizeUser(idOperacion: 8)]
        public ActionResult Index()
        {
            ViewBag.Marcas = _ln.GetMarcas();
            ViewBag.Colores = _ln.GetColores();
            ViewBag.Categorias = _ln.GetCategorias();

            return View();  
        }

        [HttpPost]
        public JsonResult GetProductos()
        {
            List<Producto_VM> data = new List<Producto_VM>();
            string errorMessage = string.Empty;
            bool status = _ln.GetProductos(ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetProductsById(int productId)
        {
            Producto_VM data = new Producto_VM();
            string errorMessage = string.Empty;
            bool status = _ln.GetProductById(productId, ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult CreateProduct(Producto_VM producto)
        {
            producto.CreadoPor = GetLoggedUser().IdUsuario;
            string errorMessage = string.Empty;
            bool status = _ln.CreateProduct(producto, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateProduct(Producto_VM producto)
        {
            producto.EditadoPor = GetLoggedUser().IdUsuario;
            string errorMessage = string.Empty;
            bool status = _ln.UpdateProduct(producto, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteProduct(int productId)
        {
            int eliminadoPor = GetLoggedUser().IdUsuario;
            string errorMessage = string.Empty;
            bool status = _ln.DeleteProduct(productId, eliminadoPor, ref errorMessage);
            return Json(new { status, errorMessage });
        }

    }
}