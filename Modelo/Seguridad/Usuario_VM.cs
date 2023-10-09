using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Seguridad
{
    public class Usuario_VM
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string NombreUsuario { get; set; }
        public string Correo { get; set; }
        public string Cedula { get; set; }
        public Nullable<int> IdRol { get; set; }
        public bool Activo { get; set; }
    }
}
