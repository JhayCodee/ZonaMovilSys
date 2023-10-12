using Datos;
using Modelo.Seguridad;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Seguridad
{
    public class Controlador_LN
    {
        private readonly Contexto _db;

        public Controlador_LN()
        {
            _db = new Contexto();
        }

        public bool GetControllers(ref List<Controlador_VM> data, ref string errorMessage)
        {
            try
            {
                data = (from c in _db.Controlador
                                     join m in _db.Modulo on c.IdModulo equals m.IdModulo
                                     where c.Activo
                                     select new Controlador_VM
                                     {
                                         IdControlador = c.IdControlador,
                                         NombreControlador = c.NombreControlador,
                                         IdModulo = m.IdModulo,
                                         Activo = c.Activo,
                                         Modulo = m.NombreModulo,
                                         Icono = c.Icono
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
