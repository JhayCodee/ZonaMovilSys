using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Ventas
{
    public class DetalleFacturaVenta_VM
    {
        public int IdDetalleFacturaVenta { get; set; }
        public int IdFacturaVenta { get; set; }
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string IMEI { get; set; }
    }
}
