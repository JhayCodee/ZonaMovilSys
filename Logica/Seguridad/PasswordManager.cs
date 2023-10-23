using System;
using System.Security.Cryptography;
using System.Text;

namespace Logica.Seguridad
{
    public class PasswordManager
    {
        private const int SaltSize = 16; // bytes
        private const int HashSize = 20; // bytes
        private const int Iterations = 10000;

        public string HashPassword(string password)
        {
            // Genera una sal aleatoria
            byte[] salt;
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(salt = new byte[SaltSize]);
            }

            // Deriva un hash
            byte[] hash;
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
            {
                hash = pbkdf2.GetBytes(HashSize);
            }

            // Combina la sal y el hash
            byte[] hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

            // Devuelve como cadena Base64
            return Convert.ToBase64String(hashBytes);
        }

        public bool VerifyPassword(string enteredPassword, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);

            // Extrae la sal y el hash del hash almacenado
            byte[] salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);
            byte[] storedPwdHash = new byte[HashSize];
            Array.Copy(hashBytes, SaltSize, storedPwdHash, 0, HashSize);

            // Genera el hash de la contraseña ingresada usando la sal extraída
            byte[] testHash;
            using (var pbkdf2 = new Rfc2898DeriveBytes(enteredPassword, salt, Iterations))
            {
                testHash = pbkdf2.GetBytes(HashSize);
            }

            // Compara los hashes
            for (int i = 0; i < HashSize; i++)
            {
                if (testHash[i] != storedPwdHash[i]) return false;
            }

            return true;
        }
    }
}
