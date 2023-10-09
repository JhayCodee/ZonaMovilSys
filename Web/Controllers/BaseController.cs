using Modelo.Seguridad;
using Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers
{
    public class BaseController : Controller
    {
        private readonly Acceso_LN ln;

        public BaseController()
        {
            ln = new Acceso_LN();
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            if (Session["User"] != null)
            {
                if (Session["AllowedOperationsLoaded"] == null)
                {
                    var user = (Usuario_VM)Session["User"];
                    var allowedControllers = ln.GetAllowedControllersForUser(user);

                    Session["ModulesWithControllers"] = allowedControllers;
                    Session["AllowedOperationsLoaded"] = true;
                }

                // Asigna el valor de Session a ViewBag
                ViewBag.ModulesWithControllers = Session["ModulesWithControllers"];
            }
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);

            var user = GetLoggedUser();
            if (user != null)
            {
                System.Diagnostics.Debug.WriteLine($"Usuario logeado: {user.NombreUsuario}, Email: {user.Correo}, Rol: {user.IdRol}");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("No hay usuario logeado.");  
            }
        }

        public Usuario_VM GetLoggedUser()
        {
            return (Usuario_VM)Session["User"];
        }
    }
}