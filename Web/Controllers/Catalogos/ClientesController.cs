using Logica.Catalogo;
using Logica.Ventas;
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
    public class ClientesController : BaseController
    {
        private readonly Cliente_LN _ln;

        public ClientesController()
        {
            _ln = new Cliente_LN();
        }

        [AuthorizeUser(idOperacion: 6)]
        public ActionResult Index()
        {
            ViewBag.Departamentos = _ln.GetDepartamentosDropDown();
            return View();
        }

        [HttpPost]
        public JsonResult GetClientesActivos()
        {
            List<Cliente_VM> clientes = new List<Cliente_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetClientesActivos(ref clientes, ref errorMessage);

            return Json(new { status, clientes, errorMessage }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetClientesDropdown()
        {
            var clientes = new Ventas_LN().GetClientesDropdown();
            string errorMessage = string.Empty;
            return Json(new { clientes, errorMessage }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CreateCliente(Cliente_VM cliente)
        {
            string errorMessage = string.Empty;
            cliente.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.CreateCliente(cliente, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult GetClienteById(int idCliente)
        {
            string errorMessage = string.Empty;
            Cliente_VM cliente = null;
            bool status = _ln.GetClienteById(idCliente, ref cliente, ref errorMessage);

            return Json(new { status, data = cliente, errorMessage }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateCliente(Cliente_VM cliente)
        {
            string errorMessage = string.Empty;
            cliente.CreadoPor = GetLoggedUser().IdUsuario;
            bool status = _ln.UpdateCliente(cliente, ref errorMessage);

            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteCliente(int idCliente)
        {
            string errorMessage = string.Empty;
            bool status = _ln.DeleteCliente(idCliente, GetLoggedUser().IdUsuario, ref errorMessage);

            return Json(new { status, errorMessage });
        }

    }
}