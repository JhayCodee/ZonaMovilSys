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
                .Join(_db.DetalleFacturaVenta,
                      factura => factura.IdFacturaVenta,
                      detalle => detalle.IdFacturaVenta,
                      (factura, detalle) => new { factura, detalle })
                .Join(_db.Producto,
                      fd => fd.detalle.IdProducto,
                      producto => producto.IdProducto,
                      (fd, producto) => new
                      {
                          fd.factura,
                          fd.detalle,
                          producto.PrecioCompra,
                          producto.PrecioVenta
                      })
                .GroupBy(fd => new { Year = fd.factura.Fecha.Year, Month = fd.factura.Fecha.Month })
                .Select(group => new GananciasPorMes
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    TotalGanancias = group.Sum(fd =>
                        (fd.detalle.Cantidad * fd.detalle.PrecioUnitario) -
                        (fd.detalle.Cantidad * fd.PrecioCompra) -
                        (fd.factura.Descuento ?? 0))
                })
                .ToList();
        }

        public TotalProductosVendidos ObtenerTotalProductosVendidos()
        {
            var yearActual = DateTime.Now.Year;
            var mesActual = DateTime.Now.Month;

            return new TotalProductosVendidos
            {
                Cantidad = _db.DetalleFacturaVenta
                    .Where(d => d.FacturaVenta.Activo && d.FacturaVenta.Fecha.Year == yearActual && d.FacturaVenta.Fecha.Month == mesActual)
                    .Sum(d => d.Cantidad)
            };
        }

        public List<MarcaVendida> ObtenerMarcasMasVendidas()
        {
            var yearActual = DateTime.Now.Year;
            var mesActual = DateTime.Now.Month;

            return _db.DetalleFacturaVenta
                .Where(d => d.FacturaVenta.Activo && d.FacturaVenta.Fecha.Year == yearActual && d.FacturaVenta.Fecha.Month == mesActual)
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
            var yearActual = DateTime.Now.Year;
            var mesActual = DateTime.Now.Month;

            return _db.DetalleFacturaVenta
                .Where(d => d.FacturaVenta.Activo && d.FacturaVenta.Fecha.Year == yearActual && d.FacturaVenta.Fecha.Month == mesActual)
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

        public List<CostosIngresosDiarios> ObtenerCostosIngresosDiarios()
        {
            var yearActual = DateTime.Now.Year;
            var mesActual = DateTime.Now.Month;

            var result = _db.FacturaVenta
                .Where(f => f.Activo && f.Fecha.Year == yearActual && f.Fecha.Month == mesActual)
                .Join(_db.DetalleFacturaVenta,
                      factura => factura.IdFacturaVenta,
                      detalle => detalle.IdFacturaVenta,
                      (factura, detalle) => new { factura, detalle })
                .Join(_db.Producto,
                      fd => fd.detalle.IdProducto,
                      producto => producto.IdProducto,
                      (fd, producto) => new
                      {
                          fd.factura,
                          fd.detalle,
                          producto.PrecioCompra,
                          producto.PrecioVenta
                      })
                .GroupBy(fd => fd.factura.Fecha.Day)
                .Select(group => new CostosIngresosDiarios
                {
                    Dia = group.Key,
                    Costos = group.Sum(fd => fd.detalle.Cantidad * fd.PrecioCompra),
                    Ingresos = group.Sum(fd => fd.detalle.Cantidad * fd.detalle.PrecioUnitario)
                })
                .OrderBy(ci => ci.Dia)
                .ToList();

            return result;
        }
    }
}
