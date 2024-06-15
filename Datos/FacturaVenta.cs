//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class FacturaVenta
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public FacturaVenta()
        {
            this.DetalleFacturaVenta = new HashSet<DetalleFacturaVenta>();
        }
    
        public int IdFacturaVenta { get; set; }
        public string NumeroFactura { get; set; }
        public System.DateTime Fecha { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Impuesto { get; set; }
        public decimal Total { get; set; }
        public bool Activo { get; set; }
        public int IdCliente { get; set; }
        public int CreadoPor { get; set; }
        public Nullable<int> AnuladoPor { get; set; }
        public Nullable<System.DateTime> FechaAnulacion { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public string RazonAnulamiento { get; set; }
        public Nullable<decimal> Descuento { get; set; }
    
        public virtual Cliente Cliente { get; set; }
        public virtual Usuario Usuario { get; set; }
        public virtual Usuario Usuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DetalleFacturaVenta> DetalleFacturaVenta { get; set; }
    }
}
