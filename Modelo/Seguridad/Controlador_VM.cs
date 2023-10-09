using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Seguridad
{
    public class Controlador_VM
    {
        public int IdControlador { get; set; }
        public string NombreControlador { get; set; }
        public Nullable<int> IdModulo { get; set; }
        public bool Activo { get; set; }
        public string Modulo { get; set; }
        public string Icono { get; set; }
    }
}
