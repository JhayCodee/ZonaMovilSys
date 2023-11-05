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

        #region VIEWS

        [AuthorizeUser(idOperacion: 3)]
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Perfil()
        {
            ViewBag.UserId = GetLoggedUser().IdUsuario; 
            ViewBag.UserdIdRol = GetLoggedUser().IdRol;
            return View();
        }

        #endregion


        #region REQUESTS

        [AuthorizeUser(idOperacion: 13)]
        [HttpPost]
        public JsonResult GetUsers()
        {
            List<Usuario_VM> data = new List<Usuario_VM>();
            string errorMessage = string.Empty;

            bool status = ln.GetUsers(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }

        [AuthorizeUser(idOperacion: 14)]
        [HttpPost]
        public JsonResult GetRoles()
        {
            List<DropDown> data = new List<DropDown>();
            string errorMessage = string.Empty;

            bool status = new Roles_LN().GetRolesDropDown(ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }

        [HttpPost]
        public JsonResult GetUserById(int userId)
        {
            Usuario_VM data = new Usuario_VM();
            string errorMessage = string.Empty;
            bool status = ln.GetUserById(userId, ref data, ref errorMessage);
            return Json(new { status, data, errorMessage });
        }


        #endregion

        #region CRUD

        [AuthorizeUser(idOperacion: 16)]
        [HttpPost]
        public JsonResult CreateUser(Usuario_VM user)
        {
            string errorMessage = string.Empty;
            bool status = ln.CreateUser(user, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [AuthorizeUser(idOperacion: 17)]
        [HttpPost]
        public JsonResult UpdateUser(Usuario_VM user)
        {
            string errorMessage = string.Empty;
            bool status = ln.UpdateUser(user, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [AuthorizeUser(idOperacion: 18)]
        [HttpPost]
        public JsonResult DeleteUser(int userId)
        {
            string errorMessage = string.Empty;
            bool status = ln.DeleteUser(userId, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [AuthorizeUser(idOperacion: 19)]
        [HttpPost]
        public JsonResult ActivateUser(int userId)
        {
            string errorMessage = string.Empty;
            bool status = ln.ActivateUser(userId, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateUserInfo(Usuario_VM user)
        {
            string errorMessage = string.Empty;
            bool status = ln.UpdateUserInfo(user, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        [HttpPost]
        public JsonResult UpdateUserPassword(string currentPassword, string newPassword, string confirmNewPassword, int userId)
        {
            string errorMessage = string.Empty;
            bool status = ln.UpdateUserPassword(currentPassword, newPassword, confirmNewPassword, userId, ref errorMessage);
            return Json(new { status, errorMessage });
        }

        #endregion
    }
}