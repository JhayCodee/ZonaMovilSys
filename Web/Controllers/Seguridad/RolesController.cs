using Logica.Seguridad;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Seguridad
{
    [VerificaSession]
    public class RolesController : BaseController
    {
        private readonly Roles_LN ln;

        public RolesController()
        {
            ln = new Roles_LN();
        }

        [AuthorizeUser(idOperacion: 2)]
        public ActionResult Index()
        {
            ViewBag.PageName = "roles";
            return View();
        }

        [HttpPost]
        public JsonResult GetRoles()
        {
            List<Roles_VM> data = new List<Roles_VM>();
            string errorMessage = string.Empty;

            bool status = ln.GetRoles(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetControllers()
        {
            List<Controlador_VM> data = new List<Controlador_VM>();
            string errorMessage = string.Empty;

            bool status = new Controlador_LN().GetControllers(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetControllersById(int idRol)
        {
            List<int?> data = new List<int?>();
            string errorMessage = string.Empty;

            bool status = ln.GetControllersByRol(idRol, ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult AddPermisisons(List<int> data, string rolName)
        {
            string errorMessage = string.Empty;

            bool status = ln.AddRol(data, rolName, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult EditPermissions(List<int?> data, string rolName, int idrol)
        {
            string errorMessage = string.Empty;

            bool status = ln.UpdateRol(idrol, data, rolName, ref errorMessage);

            if (status)
                Session["AllowedOperationsLoaded"] = null;

            return Json(new { status, data, errorMessage });
        }
    }
}