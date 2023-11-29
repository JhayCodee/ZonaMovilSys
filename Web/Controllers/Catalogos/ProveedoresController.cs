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
    public class ProveedoresController : BaseController
    {
        private readonly Proveedor_LN _ln;

        public ProveedoresController()
        {
            _ln = new Proveedor_LN();
        }

        // GET: Proveedores
        [AuthorizeUser(idOperacion: 9)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProveedores()
        {
            List<Proveedor_VM> data = new List<Proveedor_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetProveedores(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetProveedorById(int idProveedor)
        {
            Proveedor_VM proveedor = new Proveedor_VM();
            string errorMessage = string.Empty;

            bool status = _ln.GetProveedorById(idProveedor, ref proveedor, ref errorMessage);

            return Json(new { status, data = proveedor, errorMessage });
        }

        [HttpPost]
        public JsonResult CreateProveedor(Proveedor_VM proveedor)
        {
            string errorMessage = string.Empty;
            proveedor.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CreateProveedor(proveedor, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateProveedor(Proveedor_VM proveedor)
        {
            string errorMessage = string.Empty;
            proveedor.EditadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.UpdateProveedor(proveedor, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteProveedor(int idProveedor)
        {
            string errorMessage = string.Empty;
            bool status = _ln.DeleteProveedor(idProveedor, GetLoggedUser().IdUsuario, ref errorMessage);

            return Json(new { status, errorMessage });
        }
    }
}
