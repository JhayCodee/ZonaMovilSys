using Datos;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Color_LN
    {
        private readonly Contexto _db;

        public Color_LN()
        {
            _db = new Contexto();

        }

        public bool GetColores(ref List<Color_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Color
                        .Where(x => x.Activo)
                        .Select(x => new Color_VM
                        {
                            IdColor = x.IdColor,
                            Nombre = x.Nombre
                        }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
    }
}
