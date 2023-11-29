using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Catalogo
{
    public class Proveedor_VM
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Direccion { get; set; }
        public bool Activo { get; set; }
        public Nullable<int> CreadoPor { get; set; }
        public Nullable<int> EditadoPor { get; set; }
        public Nullable<int> EliminadoPor { get; set; }
        public Nullable<System.DateTime> FechaCreacion { get; set; }
        public Nullable<System.DateTime> FechaActualizacion { get; set; }
        public Nullable<System.DateTime> FechaEliminacion { get; set; }
    }
}
