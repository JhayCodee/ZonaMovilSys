using Logica.Seguridad;
using Modelo.Seguridad;
using Modelo.utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Seguridad
{
    [VerificaSession]
    public class UsuariosController : BaseController
    {
        private readonly Usuarios_LN ln;

        public UsuariosController()
        {
            ln = new Usuarios_LN();
        }

        [AuthorizeUser(idOperacion: 3)]
        public ActionResult Index()
        {
            return View();
        }

        #region REQUESTS

        [HttpPost]
        public JsonResult GetUsers()
        {
            List<Usuario_VM> data = new List<Usuario_VM>();
            string errorMessage = string.Empty;

            bool status = ln.GetUsers(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetRoles()
        {
            List<DropDown> data = new List<DropDown>();
            string errorMessage = string.Empty;

            bool status = new Roles_LN().GetRolesDropDown(ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }
        #endregion

        #region CRUD

        [HttpPost]
        public JsonResult CreateUser(Usuario_VM user)
        {
            string errorMessage = string.Empty;
            bool status = ln.CreateUser(user, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateUser(Usuario_VM user)
        {
            string errorMessage = string.Empty;
            bool status = ln.UpdateUser(user, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult DeleteUser(int userId)
        {
            string errorMessage = string.Empty;
            bool status = ln.DeleteUser(userId, ref errorMessage);
            return Json(new { status, errorMessage });
        }
        #endregion
    }
}