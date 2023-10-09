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
    }
}