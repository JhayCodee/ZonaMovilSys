﻿using Datos;
using Modelo.utils;
using Modelo.Ventas;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Logica.Ventas
{
    public class Ventas_LN
    {
        private readonly Contexto _db;

        public Ventas_LN()
        {
            _db = new Contexto();
        }

        public bool GetFacturas(ref List<FacturaVenta_VM> data, ref string errorMessage)
        {
            try
            {
                data = _db.FacturaVenta
                        .Select(f => new FacturaVenta_VM
                        {
                            IdFacturaVenta = f.IdFacturaVenta,
                            NumeroFactura = f.NumeroFactura,
                            Fecha = f.Fecha,
                            Subtotal = f.Subtotal,
                            Impuesto = f.Impuesto,
                            Total = f.Total,
                            Cliente = f.Cliente.Nombres + " " + f.Cliente.Apellidos, 
                            Activo = f.Activo
                        })
                        .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public List<DropDown> GetClientesDropdown()
        {
            var clientes = _db.Cliente
                 .Where(c => c.Activo)
                 .AsNoTracking() // Mejora el rendimiento ya que no se necesita seguimiento
                 .Select(c => new DropDown
                 {
                     Id = c.IdCliente,
                     Value = c.Nombres + " " + c.Apellidos + " - " + c.Cedula
                 })
                 .ToList();


            return clientes;
        }

        public List<DropDown> GetProductosDropdown()
        {
            var productos = (from p in _db.Producto
                             join c in _db.Categoria on p.IdCategoria equals c.IdCategoria
                             join col in _db.Color on p.IdColor equals col.IdColor
                             where p.Activo
                             select new DropDown
                             {
                                 Id = p.IdProducto,
                                 Value = p.Nombre + " " + p.Modelo +
                                         (c.Nombre == "Celular" ? " - RAM: " + p.RAM + " - Almacenamiento: " + p.Almacenamiento : "") +
                                         " - Color: " + col.Nombre
                             }).AsNoTracking().ToList();

            return productos;
        }

        public bool GetDetalleFactura(int idFacturaVenta, ref List<DetalleFacturaPrint_VM> detalles, ref string errorMessage)
        {
            try
            {
                detalles = _db.FacturaVenta
                            .Where(f => f.IdFacturaVenta == idFacturaVenta)
                            .SelectMany(f => f.DetalleFacturaVenta, (f, dfv) => new { f, dfv })
                            .Join(_db.Producto, fd => fd.dfv.IdProducto, p => p.IdProducto, (fd, p) => new { fd.f, fd.dfv, p })
                            .Join(_db.Cliente, fpd => fpd.f.IdCliente, c => c.IdCliente, (fpd, c) => new DetalleFacturaPrint_VM
                            {
                                NumeroFactura = fpd.f.NumeroFactura,
                                Cliente = c.Nombres + " " + c.Apellidos,
                                NombreProducto = fpd.p.Nombre,
                                Almacenamiento = fpd.p.Almacenamiento,
                                RAM = fpd.p.RAM,
                                IMEI = fpd.dfv.IMEI,
                                Cantidad = fpd.dfv.Cantidad,
                                PrecioUnitario = fpd.dfv.PrecioUnitario,
                                Fecha = fpd.f.Fecha,
                                Subtotal = fpd.f.Subtotal,
                                Impuesto = fpd.f.Impuesto,
                                Total = fpd.f.Total,
                                Activo = fpd.f.Activo
                            })
                            .ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }
       
        public bool GetDetalleAnulacion (int id, ref FacturaVenta_VM facturaVenta, ref string errorMessage)
        {
            try
            {
               facturaVenta = _db.FacturaVenta
                    .Where(f => f.IdFacturaVenta == id)
                    .Select(f => new FacturaVenta_VM
                    {
                        RazonAnulamiento = f.RazonAnulamiento,
                        FechaAnulacion = f.FechaAnulacion,
                        Empleado = _db.Usuario.Where(x => x.IdUsuario ==  f.AnuladoPor).Select(x => x.Nombre + " " + x.Apellidos).FirstOrDefault()
                    })
                    .FirstOrDefault();

                return facturaVenta != null;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool CrearFacturaVenta(FacturaVenta_VM facturaVenta, ref string errorMessage)
        {
            try
            {
                using (var dbContextTransaction = _db.Database.BeginTransaction())
                {
                    try
                    {
                        // Obtener el último número de factura y generar el nuevo número
                        var ultimoNumero = _db.FacturaVenta.Max(f => f.NumeroFactura);
                        var nuevoNumero = (ultimoNumero == null ? 0 : int.Parse(ultimoNumero)) + 1;
                        var numeroFactura = nuevoNumero.ToString().PadLeft(6, '0'); // Rellenar con ceros a la izquierda si es necesario

                        // Crear el encabezado de la factura
                        var factura = new FacturaVenta
                        {
                            NumeroFactura = numeroFactura,
                            Fecha = facturaVenta.Fecha,
                            Subtotal = facturaVenta.Subtotal,
                            Impuesto = facturaVenta.Impuesto,
                            Total = facturaVenta.Total,
                            IdCliente = facturaVenta.IdCliente,
                            CreadoPor = facturaVenta.CreadoPor,
                            Activo = true,
                            FechaCreacion = DateTime.Now
                        };

                        _db.FacturaVenta.Add(factura);
                        _db.SaveChanges();

                        // Procesar cada detalle de la factura
                        foreach (var detalle in facturaVenta.Detalles)
                        {
                            var producto = _db.Producto.FirstOrDefault(p => p.IdProducto == detalle.IdProducto);
                            if (producto == null)
                            {
                                throw new Exception($"Producto con ID {detalle.IdProducto} no encontrado.");
                            }

                            if (producto.Stock < detalle.Cantidad)
                            {
                                throw new Exception($"Stock insuficiente para el producto ID {detalle.IdProducto}.");
                            }

                            // Validación para IMEI en caso de categoría "Celular"
                            if (producto.Categoria.Nombre.Equals("Celular") && string.IsNullOrEmpty(detalle.IMEI))
                            {
                                throw new Exception($"IMEI requerido para el producto celular ID {detalle.IdProducto}.");
                            }

                            // Crear detalle de factura
                            var detalleFactura = new DetalleFacturaVenta
                            {
                                IdFacturaVenta = factura.IdFacturaVenta,
                                IdProducto = detalle.IdProducto,
                                Cantidad = detalle.Cantidad,
                                PrecioUnitario = detalle.PrecioUnitario,
                                IMEI = detalle.IMEI
                            };

                            _db.DetalleFacturaVenta.Add(detalleFactura);

                            // Actualizar el stock del producto
                            producto.Stock -= detalle.Cantidad;
                            _db.Entry(producto).State = EntityState.Modified;
                        }

                        _db.SaveChanges();
                        dbContextTransaction.Commit();

                        return true;
                    }
                    catch (Exception ex)
                    {
                        dbContextTransaction.Rollback();
                        errorMessage = ex.Message;
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool AnularFacturaVenta(int idFacturaVenta, int anuladoPor, string razonAnulamiento, ref string errorMessage)
        {
            try
            {
                using (var dbContextTransaction = _db.Database.BeginTransaction())
                {
                    try
                    {
                        var factura = _db.FacturaVenta.FirstOrDefault(f => f.IdFacturaVenta == idFacturaVenta);
                        if (factura == null)
                        {
                            throw new Exception($"Factura con ID {idFacturaVenta} no encontrada.");
                        }

                        // Marcar la factura como inactiva
                        factura.Activo = false;
                        factura.AnuladoPor = anuladoPor;
                        factura.FechaAnulacion = DateTime.Now;
                        factura.RazonAnulamiento = razonAnulamiento;
                        _db.Entry(factura).State = EntityState.Modified;

                        // Obtener los detalles de la factura
                        var detallesFactura = _db.DetalleFacturaVenta.Where(d => d.IdFacturaVenta == idFacturaVenta).ToList();

                        // Procesar cada detalle para devolver el stock
                        foreach (var detalle in detallesFactura)
                        {
                            var producto = _db.Producto.FirstOrDefault(p => p.IdProducto == detalle.IdProducto);
                            if (producto != null)
                            {
                                // Devolver el stock del producto
                                producto.Stock += detalle.Cantidad;
                                _db.Entry(producto).State = EntityState.Modified;
                            }
                        }

                        _db.SaveChanges();
                        dbContextTransaction.Commit();

                        return true;
                    }
                    catch (Exception ex)
                    {
                        dbContextTransaction.Rollback();
                        errorMessage = ex.Message;
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }


    }
}
