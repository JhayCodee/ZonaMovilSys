using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers
{
    [VerificaSession]
    public class DashboardController : BaseController
    {
        [AuthorizeUser(idOperacion: 2)]
        public ActionResult Index()
        {
            return View(); 
        }

    }
}