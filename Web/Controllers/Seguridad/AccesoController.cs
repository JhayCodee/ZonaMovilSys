﻿using Modelo.Seguridad;
using Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Web.Controllers.Seguridad
{
    public class AccesoController : Controller
    {
        private readonly Acceso_LN ln;

        public AccesoController()
        {
            ln = new Acceso_LN();
        }

        // GET: Acceso
        public ActionResult Login()
        {
            // Configurar encabezados para evitar el almacenamiento en caché de la página de login
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
            Response.Cache.SetNoStore();

            // Limpiar la sesión
            Session["User"] = null;
            Session["AllowedOperationsLoaded"] = null;
            return View();
        }

        [HttpPost]
        public ActionResult Login(string email, string password)
        {
            string errorMsg;
            Usuario_VM oUser = ln.GetUserByEmailAndPassword(email, password, out errorMsg);

            if (!string.IsNullOrEmpty(errorMsg))
            {
                ViewBag.Error = errorMsg;
                return View();
            }

            Session["User"] = oUser;
            ViewBag.UserName = oUser.Nombre + " " + oUser.Apellidos;
            return RedirectToAction("Index", "Dashboard");
        }


        public ActionResult Logout()
        {
            Session["User"] = null;
            Session["AllowedOperationsLoaded"] = null;
            return RedirectToAction("Login", "Acceso"); 
        }
    }
}