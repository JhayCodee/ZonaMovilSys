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
    
    public partial class ReporteGarantiasPorPeriodo_Result
    {
        public int IdGarantia { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
        public string Estado { get; set; }
        public Nullable<System.DateTime> FechaEntregaEstimada { get; set; }
        public string Producto { get; set; }
        public string NumeroFactura { get; set; }
        public Nullable<System.DateTime> FechaEvento { get; set; }
        public Nullable<System.DateTime> NuevaFechaFin { get; set; }
        public string DescripcionEvento { get; set; }
    }
}
