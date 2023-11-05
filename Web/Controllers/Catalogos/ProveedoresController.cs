using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Catalogos
{
    [VerificaSession]
    public class ProveedoresController : BaseController
    {
        // GET: Proveedores
        [AuthorizeUser(idOperacion: 9)]
        public ActionResult Index()
        {
            return View();
        }
    }
}