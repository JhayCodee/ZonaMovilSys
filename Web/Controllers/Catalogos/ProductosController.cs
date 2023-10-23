using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Catalogos
{
    [VerificaSession]
    public class ProductosController : BaseController
    {
        [AuthorizeUser(idOperacion: 8)]
        // GET: Productos
        public ActionResult Index()
        {
            return View();
        }





    }
}