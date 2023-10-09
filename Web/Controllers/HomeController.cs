using Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers
{
    [VerificaSession]
    public class HomeController : BaseController
    {
        [AuthorizeUser(idOperacion: 2)]
        public ActionResult Index()
        {
            return View();
        }

        [AuthorizeUser(idOperacion: 3)]
        public ActionResult About()
        {
            return View();
        }

        [AuthorizeUser(idOperacion: 4)]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}