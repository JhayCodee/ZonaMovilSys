using Datos;
using Modelo.Catalogo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Catalogo
{
    public class Categoria_LN
    {
        private readonly Contexto _db;

        public Categoria_LN()
        {
            _db = new Contexto();
        }

        public bool GetCategorias(ref List<Categoria_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.Categoria
                        .Where(x => x.Activo)
                        .Select(x => new Categoria_VM
                        {
                            IdCategoria = x.IdCategoria,
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
