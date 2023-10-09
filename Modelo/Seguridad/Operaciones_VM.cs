using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Seguridad
{
    public class Operaciones_VM
    {
        public int IdOperacion { get; set; }
        public string NombreOperacion { get; set; }
        public Nullable<int> IdControlador { get; set; }
    }
}
