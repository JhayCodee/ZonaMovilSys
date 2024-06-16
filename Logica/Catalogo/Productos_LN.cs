using Datos;
using Modelo.Catalogo;
using Modelo.utils;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;
using static System.ActivationContext;

namespace Logica.Catalogo
{
    public class Productos_LN
    {
        private readonly Contexto _db;

        public Productos_LN()
        {
            _db = new Contexto();
        }

        public bool GetProductos(ref List<Producto_VM> data, ref string errorMessage)
        {
            try
            {
                data = ( from p in _db.Producto.AsNoTracking()
                         join vu1 in _db.ValoresUnidadMedida on p.RAM equals vu1.IdValUniMed
                         join vu2 in _db.ValoresUnidadMedida on p.GarantiaMeses equals vu2.IdValUniMed
                         join vu3 in _db.ValoresUnidadMedida on p.Almacenamiento equals vu3.IdValUniMed
                         join um in _db.UnidadMedida on vu1.IdUnidadMedida equals um.idUnidadMedida
                         join um2 in _db.UnidadMedida on vu2.IdUnidadMedida equals um2.idUnidadMedida
                         join um3 in _db.UnidadMedida on vu3.IdUnidadMedida equals um3.idUnidadMedida
                         select new Producto_VM
                         {
                            IdProducto=p.IdProducto,
                            Nombre=p.Nombre,
                            Modelo=p.Modelo,
                            Descripcion=p.Descripcion,
                            Stock=p.Stock,
                            PrecioVenta=p.PrecioVenta,
                            PrecioCompra=p.PrecioCompra,
                            GarantiaMeses=vu2.Valor,
                            Almacenamiento=vu3.Valor,
                            RAM= vu1.Valor,
                            Activo= p.Activo,
                            Marca= p.Marca.Nombre,
                            Color=p.Color.Nombre,
                            Categoria=p.Categoria.Nombre,
                            Bateria=p.Bateria,
                            Nuevo=p.Nuevo,
                            Esim=p.eSim,
                            Proveedor=p.Proveedor.Nombre,
                            Imei=p.IMEI,
                            CodigoBarra=p.CodigoBarra



                             
                         }


                    ).ToList();

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public List<DropDown> GetMarcas()
        {
            return _db.Marca
                .Where(m => m.Activo)
                .Select(m => new DropDown
                {
                    Id = m.IdMarca,
                    Value = m.Nombre
                }).ToList();
        }

        public List<DropDown> GetColores()
        {
            return _db.Color
                .Where(c => c.Activo)
                .Select(c => new DropDown
                {
                    Id = c.IdColor,
                    Value = c.Nombre
                }).ToList();
        }

        public List<DropDown> GetCategorias()
        {
            return _db.Categoria
                .Where(c => c.Activo)
                .Select(c => new DropDown
                {
                    Id = c.IdCategoria,
                    Value = c.Nombre
                }).ToList();
        }
        public List<DropDown> GetProveedores()
        {
            return _db.Proveedor
                .Where(c => c.Activo)
                .Select(c => new DropDown
                {
                    Id = c.IdProveedor,
                    Value = c.Nombre
                }).ToList();
        }

        public List<DropDown> GetValoresGb()
        {
            return _db.ValoresUnidadMedida
                          .Where(v => v.UnidadMedida.NombreUnidadMedida == "Gb")
                          .Select(v => new DropDown
                          {
                              Id = v.IdValUniMed,
                              Value = v.Valor.ToString() + " Gb"
                          }).ToList();
        }
        
        public List<DropDown> GetValoresMeses()
        {
            return _db.ValoresUnidadMedida
                      .Where(v => v.UnidadMedida.NombreUnidadMedida == "Meses")
                      .Select(v => new DropDown
                      {
                          Id = v.IdValUniMed,
                          Value = v.Valor.ToString() + " Meses"
                      }).ToList();
        }


        public bool GetProductById(int productId, ref Producto_VM data, ref string errorMessage)
        {
            try
            {
                var product = _db.Producto.FirstOrDefault(p => p.IdProducto == productId);
                if (product != null)
                {
                    string esimText = product.eSim == true ? " con eSim" : "";
                    string nuevoText = product.Nuevo == true ? " Nuevo" : "";
                    string bateriaText = product.Bateria.HasValue ? $" Batería: {product.Bateria}%" : "";

                    string detalleCelular;
                    if (product.Categoria?.Nombre == "Accesorio")
                    {
                        detalleCelular = product.Nombre;
                    }
                    else
                    {
                        detalleCelular = product.Nombre +
                                         " RAM " + (product.ValoresUnidadMedida2?.Valor.ToString() ?? "N/A") +
                                         "Gb Almacenamiento: " + (product.ValoresUnidadMedida?.Valor.ToString() ?? "N/A") +
                                         "Gb" + esimText + nuevoText + bateriaText;
                    }

                    data = new Producto_VM
                    {
                        IdProducto = product.IdProducto,
                        Nombre = product.Nombre,
                        Modelo = product.Modelo,
                        Descripcion = product.Descripcion,
                        Stock = product.Stock,
                        PrecioCompra = product.PrecioCompra,
                        PrecioVenta = product.PrecioVenta,
                        Almacenamiento = product.Almacenamiento,
                        GarantiaMeses = product.GarantiaMeses,
                        RAM = product.RAM,
                        Activo = product.Activo,
                        IdMarca = product.IdMarca,
                        IdCategoria = product.IdCategoria,
                        IdColor = product.IdColor,
                        CreadoPor = product.CreadoPor,
                        EditadoPor = product.EditadoPor,
                        EliminadoPor = product.EliminadoPor,
                        FechaCreacion = product.FechaCreacion,
                        FechaActualizacion = product.FechaActualizacion,
                        FechaEliminacion = product.FechaEliminacion,
                        Marca = product.Marca?.Nombre,
                        Color = product.Color?.Nombre,
                        Categoria = product.Categoria?.Nombre,
                        Bateria = product.Bateria,
                        Nuevo = product.Nuevo,
                        Esim = product.eSim,
                        Proveedor = product.Proveedor?.Nombre,
                        Imei = product.IMEI,
                        CodigoBarra = product.CodigoBarra,
                        DetalleCelular = detalleCelular
                    };
                }
                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }


        public bool CreateProduct(Producto_VM product, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));
                
               _db.sp_Producto_Create(
                                        product.Nombre,
                                       product.Modelo,
                                       product.Descripcion,
                                       product.Stock,
                                      product.PrecioCompra,
                                      product.PrecioVenta,
                                     product.Almacenamiento,
                                       product.GarantiaMeses,
                                       product.RAM,
                                      true,
                                       product.IdMarca,
                                        product.IdCategoria,
                                       product.IdColor,
                                       product.Bateria,
                                       product.Nuevo,
                                       product.Esim,
                                       product.IdProveedor,
                                       product.Imei,
                                       product.CodigoBarra,
                                       product.CreadoPor,
                                        isSuccessParam,
                                        errorMsgParam
                                    );
                
                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                   return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }

        public bool UpdateProduct(Producto_VM product, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Producto_Update(
                    product.IdProducto,
                    product.Nombre,
                    product.Modelo,
                    product.Descripcion,
                    product.Stock,
                    product.PrecioCompra,
                    product.PrecioVenta,
                    product.Almacenamiento,
                    product.GarantiaMeses,
                    product.RAM,
                    true,
                    product.IdMarca,
                    product.IdCategoria,
                    product.IdColor,
                   product.Bateria,
                    product.Nuevo,
                    product.Esim,
                    product.IdProveedor,
                    product.Imei,
                    product.CodigoBarra,
                    product.EditadoPor,
                    isSuccessParam,
                    errorMsgParam
                );

                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                errorMessage = ex.Message;
                return false;
            }
        }


        public bool DeleteProduct(int productId, int eliminadoPor, ref string errorMessage)
        {
            try
            {
                ObjectParameter isSuccessParam = new ObjectParameter("IsSuccess", typeof(int));
                ObjectParameter errorMsgParam = new ObjectParameter("ErrorMsg", typeof(string));

                _db.sp_Producto_Delete(productId, eliminadoPor, isSuccessParam, errorMsgParam);

                if ((int)isSuccessParam.Value == 0)
                {
                    errorMessage = errorMsgParam.Value.ToString();
                    return false;
                }

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
