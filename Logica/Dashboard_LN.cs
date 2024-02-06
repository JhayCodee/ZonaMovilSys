using Datos;
using Modelo.utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica
{
    public class Dashboard_LN
    {
        private readonly Contexto _db;

        public Dashboard_LN()
        {
            _db = new Contexto();
        }

        public List<GananciasPorMes> ObtenerGananciasPorMes()
        {
            var yearActual = DateTime.Now.Year;
            var mesActual = DateTime.Now.Month;

            return _db.FacturaVenta
                .Where(f => f.Activo && f.Fecha.Year == yearActual && f.Fecha.Month == mesActual)
                .GroupBy(f => new { Year = f.Fecha.Year, Month = f.Fecha.Month })
                .Select(group => new GananciasPorMes
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    TotalGanancias = group.Sum(f => f.Total)
                })
                .ToList();
        }


        public TotalProductosVendidos ObtenerTotalProductosVendidos()
        {
            return new TotalProductosVendidos
            {
                Cantidad = _db.DetalleFacturaVenta
                    .Where(d => d.FacturaVenta.Activo)
                    .Sum(d => d.Cantidad)
            };
        }

        public List<MarcaVendida> ObtenerMarcasMasVendidas()
        {
            return _db.DetalleFacturaVenta
                .Where(d => d.FacturaVenta.Activo)
                .GroupBy(d => d.Producto.Marca.Nombre)
                .Select(group => new MarcaVendida
                {
                    Marca = group.Key,
                    CantidadVendida = group.Sum(d => d.Cantidad)
                })
                .OrderByDescending(x => x.CantidadVendida)
                .ToList();
        }

        public List<ProductoVendido> ObtenerProductosMasVendidos()
        {
            return _db.DetalleFacturaVenta
                .Where(d => d.FacturaVenta.Activo)
                .GroupBy(d => d.Producto.Nombre)
                .Select(group => new ProductoVendido
                {
                    Producto = group.Key,
                    CantidadVendida = group.Sum(d => d.Cantidad)
                })
                .OrderByDescending(x => x.CantidadVendida)
                .Take(5)
                .ToList();
        }
    }
}
