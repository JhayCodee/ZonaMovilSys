using Logica.Catalogo;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Filters;

namespace Web.Controllers.Catalogos
{
    [VerificaSession]
    public class ColoresController : BaseController
    {
        private readonly Color_LN _ln;

        public ColoresController()
        {
            _ln = new Color_LN();
        }

        // GET: Colores
        [AuthorizeUser(idOperacion: 4)]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetColores()
        {
            List<Color_VM> data = new List<Color_VM>();
            string errorMessage = string.Empty;

            bool status = _ln.GetColores(ref data, ref errorMessage);

            return Json(new { status, data, errorMessage });
        }
    }
}