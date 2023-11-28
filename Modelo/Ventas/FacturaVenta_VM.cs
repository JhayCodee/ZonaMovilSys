using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Ventas
{
    public class FacturaVenta_VM
    {
        public int IdFacturaVenta { get; set; }
        public string NumeroFactura { get; set; }
        public System.DateTime Fecha { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }
        public bool Activo { get; set; }
        public int IdCliente { get; set; }
        public int CreadoPor { get; set; }
        public Nullable<int> AnuladoPor { get; set; }
        public Nullable<System.DateTime> FechaAnulacion { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string RazonAnulamiento { get; set; }
        public string Cliente { get; set; }
        public string Empleado { get; set; }

        public List<DetalleFacturaVenta_VM> Detalles { get; set; }
    }

    public class DetalleFacturaPrint_VM
    {
        public string NumeroFactura { get; set; }
        public string Cliente { get; set; }
        public string NombreProducto { get; set; }
        public string Almacenamiento { get; set; }
        public string RAM { get; set; }
        public string IMEI { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }
        public bool Activo { get; set; }
    }

}
