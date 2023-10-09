using Datos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seguridad
{
    public class abcd
    {
        public int Getid()
        {
            using (var context = new Contexto())
            {
                return (int)context.Usuario.Select(u => u.IdRol).FirstOrDefault();
            }
        }


    }
}
