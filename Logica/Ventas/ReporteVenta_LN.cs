using Datos;
using Modelo.Ventas;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Logica.Ventas
{
    public class ReporteVenta_LN
    {
        private readonly Contexto _db;

        public ReporteVenta_LN()
        {
            _db = new Contexto();
        }

        public bool ObtenerReporteVentasPorPeriodo(DateTime fechaInicio, DateTime fechaFin, out List<Reporte_VM> reportes)
        {
            reportes = _db.ReporteVentasPorPeriodo(fechaInicio, fechaFin).Select(x => new Reporte_VM
            {
                FechaVenta = x.FechaVenta,
                NumeroFactura = x.NumeroFactura,
                Cliente = x.Cliente ?? "N/A",
                Producto = x.Producto ?? "N/A",
                Cantidad = x.Cantidad,
                PrecioTotal = x.PrecioTotal ?? 0,
                Descuento = x.Descuento ?? 0,
                Vendedor = x.Vendedor ?? "N/A",
                Fechainicio = fechaInicio,
                FechaFin = fechaFin,
            }).ToList();

            return reportes.Count > 0;
        }

        public bool ObtenerReporteFinancieroPorPeriodo(DateTime fechaInicio, DateTime fechaFin, out List<ReporteFinancieroVM> reportes)
        {
            reportes = _db.ReporteFinancieroPorPeriodo(fechaInicio, fechaFin).Select(x => new ReporteFinancieroVM
            {
                FechaVenta = x.FechaVenta,
                NumeroFactura = x.NumeroFactura,
                Cliente = x.Cliente ?? "N/A",
                TotalVenta = x.TotalVenta ?? 0,
                TotalCosto = x.TotalCosto ?? 0,
                GananciaBruta = x.GananciaBruta ?? 0,
                Descuento = x.Descuento ?? 0,
                GananciaNeta = x.GananciaNeta ?? 0,
                Vendedor = x.Vendedor ?? "N/A",
            }).ToList();

            return reportes.Count > 0;
        }


        public bool ObtenerReporteInventarioActual(out List<ReporteInventarioVM> reportes)
        {
            reportes = _db.ReporteInventarioActual().Select(x => new ReporteInventarioVM
            {
                Producto = x.Producto ?? "N/A",
                Modelo = x.Modelo ?? "N/A",
                PrecioCompra = x.PrecioCompra,
                PrecioVenta = x.PrecioVenta,
                CantidadDisponible = x.CantidadDisponible,
                CostoTotalInventario = x.CostoTotalInventario ?? 0,
                ValorVentaPotencial = x.ValorVentaPotencial ?? 0,
                Categoria = x.Categoria ?? "N/A",
                Marca = x.Marca ?? "N/A"
            }).ToList();

            return reportes.Count > 0;
        }

        public bool ObtenerReporteClientes(DateTime fechaInicio, DateTime fechaFin, out List<ReporteClienteVM> reportes)
        {
            reportes = _db.ReporteClientes(fechaInicio, fechaFin).Select(x => new ReporteClienteVM
            {
                IdCliente = x.IdCliente,
                Cliente = x.Cliente ?? "N/A",
                Correo = x.Correo ?? "N/A",
                Telefono = x.Telefono ?? "N/A",
                Departamento = x.Departamento ?? "N/A",
                TotalCompras = x.TotalCompras ?? 0,
                MontoTotalGastado = x.MontoTotalGastado ?? 0
            }).ToList();

            return reportes.Count > 0;
        }

        public bool ObtenerReporteGarantiasPorPeriodo(DateTime fechaInicio, DateTime fechaFin, out List<ReporteGarantiaVM> reportes)
        {
            reportes = _db.ReporteGarantiasPorPeriodo(fechaInicio, fechaFin).Select(x => new ReporteGarantiaVM
            {
                IdGarantia = x.IdGarantia,
                FechaInicio = x.FechaInicio,
                FechaFin = x.FechaFin,
                Estado = x.Estado ?? "Desconocido",
                FechaEntregaEstimada = x.FechaEntregaEstimada,
                Producto = x.Producto ?? "N/A",
                NumeroFactura = x.NumeroFactura ?? "N/A",
                FechaEvento = x.FechaEvento,
                NuevaFechaFin = x.NuevaFechaFin,
                DescripcionEvento = x.DescripcionEvento ?? "N/A"
            }).ToList();

            return reportes.Count > 0;
        }
    }
}
