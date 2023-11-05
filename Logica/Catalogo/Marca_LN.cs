using Datos;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Marca_LN
    {
        private readonly Contexto _db;

        public Marca_LN()
        {
            _db = new Contexto();
        }

        public bool GetMarcas(ref List<Marca_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Marca
                        .Where(x => x.Activo)
                        .Select(x => new Marca_VM { 
                            IdMarca = x.IdMarca,
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
