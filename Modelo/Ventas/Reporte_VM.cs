using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Ventas
{
    public class Reporte_VM
    {
        public DateTime FechaVenta { get; set; }
        public string NumeroFactura { get; set; }
        public string Cliente { get; set; }
        public string Producto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioTotal { get; set; }
        public decimal Descuento { get; set; }
        public string Vendedor { get; set; }
        public string RutaImagenProducto { get; set; } // Propiedad para la ruta de la imagen del producto

        public DateTime Fechainicio { get; set; }
        public DateTime FechaFin { get; set; }

    }

    public class ReporteFinancieroVM : Reporte_VM
    {
        public decimal TotalVenta { get; set; }
        public decimal TotalCosto { get; set; }
        public decimal GananciaBruta { get; set; }
        public decimal GananciaNeta { get; set; }
    }

    public class ReporteVentasPorPeriodoVM
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public List<Reporte_VM> Reportes { get; set; }
    }

    public class ReporteInventarioVM
    {
        public string Producto { get; set; }
        public string Modelo { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal PrecioVenta { get; set; }
        public int CantidadDisponible { get; set; }
        public decimal CostoTotalInventario { get; set; }
        public decimal ValorVentaPotencial { get; set; }
        public string Categoria { get; set; }
        public string Marca { get; set; }
    }

    public class ReporteClienteVM
    {
        public int IdCliente { get; set; }
        public string Cliente { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public string Departamento { get; set; }
        public int TotalCompras { get; set; }
        public decimal MontoTotalGastado { get; set; }
    }

    public class ReporteGarantiaVM
    {
        public int IdGarantia { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaEntregaEstimada { get; set; }
        public string Producto { get; set; }
        public string NumeroFactura { get; set; }
        public DateTime? FechaEvento { get; set; }
        public DateTime? NuevaFechaFin { get; set; }
        public string DescripcionEvento { get; set; }
    }

}
