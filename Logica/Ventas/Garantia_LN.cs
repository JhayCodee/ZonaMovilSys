using Datos;
using Modelo.Ventas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                            IMEI = dfv.IMEI,
                            FechaFin = g.FechaFin,
                            FechaEstimadaEntrega = g.FechaEstimadaEntrega,
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
                // Encuentra la garantía en la base de datos
                var garantiaDb = _db.Garantia.FirstOrDefault(g => g.IdGarantia == garantia.IdGarantia);

                if (garantiaDb == null)
                {
                    errorMessage = "Garantía no encontrada.";
                    return false;
                }

                garantiaDb.RazonReclamo = garantia.RazonReclamo;
                garantiaDb.FechaEstimadaEntrega = garantia.FechaEstimadaEntrega;
                garantiaDb.Estado = 0; // 0 representa en reparacion

                // Guarda los cambios en la base de datos
                _db.SaveChanges();

                return true; 
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message; 
                return false; 
            }
        }

        public bool EntregarGarantia(int id, ref string errorMessage)
        {
            try
            {
                var garantiaDb = _db.Garantia.FirstOrDefault(g => g.IdGarantia == id);

                if (garantiaDb == null)
                {
                    errorMessage = "Garantía no encontrada.";
                    return false;
                }

                garantiaDb.Estado = 3; //3 representa "Entregado" "Reparado"

                _db.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

    }
}
