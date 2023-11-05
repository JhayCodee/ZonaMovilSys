using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Catalogos
{
    [VerificaSession]
    public class ClientesController : BaseController
    {

        [AuthorizeUser(idOperacion: 6)]
        public ActionResult Index()
        {
            return View();
        }
    }
}