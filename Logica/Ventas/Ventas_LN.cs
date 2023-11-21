using Datos;
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

        public bool CrearFacturaVentaaaaaa(FacturaVenta_VM facturaVenta, ref string errorMessage)
        {
            try
            {
                // Convertir los detalles de la factura a JSON
                string detalleFacturaVentaJSON = JsonConvert.SerializeObject(facturaVenta.Detalles);

                // Parámetros para el procedimiento almacenado
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                // Llamada al procedimiento almacenado
                _db.sp_FacturaVenta_Create(
                    facturaVenta.NumeroFactura,
                    facturaVenta.Fecha,
                    facturaVenta.Subtotal,
                    facturaVenta.Impuesto,
                    facturaVenta.Total,
                    facturaVenta.IdCliente,
                    facturaVenta.CreadoPor,
                    detalleFacturaVentaJSON,
                    isSuccessParam,
                    errorMsgParam
                );

                // Verificar si el procedimiento se ejecutó con éxito
                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                // Captura y devuelve el mensaje de error
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

    }
}
