using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Catalogo
{
    public class Producto_VM
    { 
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string Modelo { get; set; }
        public string Descripcion { get; set; }
        public int Stock { get; set; }
        public decimal PrecioCompra { get; set; }
        public decimal PrecioVenta { get; set; }
        public int? Almacenamiento { get; set; }
        public Nullable<int> GarantiaMeses { get; set; }
        public int? RAM { get; set; }
        public bool Activo { get; set; }
        public string Marca { get; set; }
        public string Categoria { get; set; }
        public string Color { get; set; }
        public int? Bateria { get; set; }
        public bool? Nuevo { get; set; }
        public bool? Esim { get; set; }
        public string Proveedor { get; set; }
        public string Imei { get; set; }
        public string CodigoBarra { get; set; }
        public int CreadoPor { get; set; }
        public Nullable<int> EditadoPor { get; set; }
        public Nullable<int> EliminadoPor { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public Nullable<System.DateTime> FechaActualizacion { get; set; }
        public Nullable<System.DateTime> FechaEliminacion { get; set; }
        public Nullable<int> IdMarca { get; set; }
        public Nullable<int> IdCategoria { get; set; }
        public Nullable<int> IdColor { get; set; }
        public Nullable<int> IdProveedor { get; set; }
    }
}
