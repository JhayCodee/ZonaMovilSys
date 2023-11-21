﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modelo.Catalogo
{
    public class Cliente_VM
    {
        public int IdCliente { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Cedula { get; set; }
        public string Correo { get; set; }
        public string Telefono { get; set; }
        public int? CreadoPor { get; set; }
        public int? EditadoPor { get; set; }
        public int? EliminadoPor { get; set; }
        public bool Activo { get; set; }
    }
}
