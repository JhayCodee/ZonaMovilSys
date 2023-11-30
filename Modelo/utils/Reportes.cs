using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.utils
{
    public class Reportes
    {
        public int Year { get; set; }
    }

    public class GananciasPorMes
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalGanancias { get; set; }
    }

    public class TotalProductosVendidos
    {
        public int Cantidad { get; set; }
    }

    public class MarcaVendida
    {
        public string Marca { get; set; }
        public int CantidadVendida { get; set; }
    }

    public class ProductoVendido
    {
        public string Producto { get; set; }
        public int CantidadVendida { get; set; }
    }

}
