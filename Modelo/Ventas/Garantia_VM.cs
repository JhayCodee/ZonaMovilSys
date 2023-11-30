using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Ventas
{
    public class Garantia_VM
    {
        public int IdGarantia { get; set; }
        public string NumeroFactura { get; set; }
        public string Cliente { get; set; }
        public string NombreProducto { get; set; }
        public string RazonReclamo { get; set; }
        public DateTime FechaFin { get; set; }
        public DateTime? FechaEstimadaEntrega { get; set; }
        public int Estado { get; set; }
        public string IMEI { get; set; }

    }

}
