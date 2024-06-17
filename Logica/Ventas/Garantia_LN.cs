using Datos;
using Modelo.Ventas;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity.Core.Objects;

namespace Logica.Ventas
{
    public class Garantia_LN
    {
        private readonly Contexto _db;

        public Garantia_LN()
        {
            _db = new Contexto();
        }

        public bool GetGarantias(ref List<Garantia_VM> data, ref string errorMessage)
        {
            try
            {
                data = (from g in _db.Garantia.AsNoTracking()
                        join dfv in _db.DetalleFacturaVenta on g.IdDetalleFacturaVenta equals dfv.IdDetalleFacturaVenta
                        join fv in _db.FacturaVenta on dfv.IdFacturaVenta equals fv.IdFacturaVenta
                        join p in _db.Producto on dfv.IdProducto equals p.IdProducto
                        join c in _db.Cliente on fv.IdCliente equals c.IdCliente
                        select new Garantia_VM
                        {
                            IdGarantia = g.IdGarantia,
                            NumeroFactura = fv.NumeroFactura,
                            Cliente = c.Nombres + " " + c.Apellidos,
                            NombreProducto = p.Nombre,
                            IMEI = p.IMEI,
                            FechaFin = g.FechaFin,
                            FechaEstimadaEntrega = g.FechaEntregaEstimada,
                            Estado = g.Estado
                        }).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool ReclamarGarantia(Garantia_VM garantia, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("Success", typeof(bool));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMessage", typeof(string));

                _db.sp_ReclamarGarantia(
                    garantia.IdGarantia,
                    "Reclamación de garantía: " + garantia.RazonReclamo,
                    garantia.FechaEstimadaEntrega,
                    isSuccessParam,
                    errorMsgParam
                );

                bool success = (bool)isSuccessParam.Value;
                errorMessage = errorMsgParam.Value as string;

                return success;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool FinalizarGarantia(int idGarantia, ref string errorMessage)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Encuentra la garantía en la base de datos
                    var garantiaDb = _db.Garantia.FirstOrDefault(g => g.IdGarantia == idGarantia);

                    if (garantiaDb == null)
                    {
                        errorMessage = "Garantía no encontrada.";
                        return false;
                    }

                    // Actualiza el estado de la garantía a "vencido"
                    garantiaDb.Estado = 2; // 2 representa vencido
                    garantiaDb.FechaEntregaEstimada = null;

                    // Guarda los cambios en la base de datos
                    _db.SaveChanges();

                    // Registra el evento en la tabla EventosGarantia
                    var eventoGarantia = new EventosGarantia
                    {
                        IdGarantia = garantiaDb.IdGarantia,
                        FechaEvento = DateTime.Now,
                        DescripcionEvento = "Finalización de garantía",
                        NuevaFechaFin = null // No estamos extendiendo la garantía, solo finalizándola
                    };
                    _db.EventosGarantia.Add(eventoGarantia);
                    _db.SaveChanges();

                    // Confirma la transacción
                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    // Revierte la transacción en caso de error
                    transaction.Rollback();
                    errorMessage = ex.Message;
                    return false;
                }
            }
        }

        public bool EntregarGarantia(int idGarantia, ref string errorMessage)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Encuentra la garantía en la base de datos
                    var garantiaDb = _db.Garantia.FirstOrDefault(g => g.IdGarantia == idGarantia);

                    if (garantiaDb == null)
                    {
                        errorMessage = "Garantía no encontrada.";
                        return false;
                    }

                    // Actualiza el estado de la garantía a "entregado"
                    garantiaDb.Estado = 3; // 3 representa entregado
                    garantiaDb.FechaEntregaEstimada = null;
                    garantiaDb.FechaFin = DateTime.Now;

                    // Guarda los cambios en la base de datos
                    _db.SaveChanges();

                    // Registra el evento en la tabla EventosGarantia
                    var eventoGarantia = new EventosGarantia
                    {
                        IdGarantia = garantiaDb.IdGarantia,
                        FechaEvento = DateTime.Now,
                        DescripcionEvento = "Entrega de garantía",
                        NuevaFechaFin = null // No estamos extendiendo la garantía, solo entregándola
                    };
                    _db.EventosGarantia.Add(eventoGarantia);
                    _db.SaveChanges();

                    // Confirma la transacción
                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    // Revierte la transacción en caso de error
                    transaction.Rollback();
                    errorMessage = ex.Message;
                    return false;
                }
            }
        }

        public bool ExtenderGarantia(int idGarantia, DateTime nuevaFechaFin, ref string errorMessage)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Encuentra la garantía en la base de datos
                    var garantiaDb = _db.Garantia.FirstOrDefault(g => g.IdGarantia == idGarantia);

                    if (garantiaDb == null)
                    {
                        errorMessage = "Garantía no encontrada.";
                        return false;
                    }

                    // Actualiza la fecha de fin de la garantía
                    garantiaDb.FechaFin = nuevaFechaFin;
                    garantiaDb.Estado = 1; // activo nuevamente

                    // Guarda los cambios en la base de datos
                    _db.SaveChanges();

                    // Registra el evento en la tabla EventosGarantia
                    var eventoGarantia = new EventosGarantia
                    {
                        IdGarantia = garantiaDb.IdGarantia,
                        FechaEvento = DateTime.Now,
                        DescripcionEvento = "Extensión de garantía",
                        NuevaFechaFin = nuevaFechaFin
                    };
                    _db.EventosGarantia.Add(eventoGarantia);
                    _db.SaveChanges();

                    // Confirma la transacción
                    transaction.Commit();

                    return true;
                }
                catch (Exception ex)
                {
                    // Revierte la transacción en caso de error
                    transaction.Rollback();
                    errorMessage = ex.Message;
                    return false;
                }
            }
        }

    }
}
