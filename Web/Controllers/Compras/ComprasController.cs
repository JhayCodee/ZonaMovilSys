using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Compras
{
    [VerificaSession]
    public class ComprasController : BaseController
    {
        [AuthorizeUser(idOperacion: 12)]
        public ActionResult Index()
        {
            return View();
        }
    }
}