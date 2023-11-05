using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Ventas
{
    [VerificaSession]
    public class GarantiasController : BaseController
    {
        // GET: Garantias
        [AuthorizeUser(idOperacion: 11)]
        public ActionResult Index()
        {
            return View();
        }
    }
}