using System.Security.Cryptography;
using System.Text;

namespace quizzy.Hasher
{
    public class PasswordHasher
    {
        // Hashing using bcrypt
        public static string HashPasswordBCrypt(string password, string salt)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, salt);
        }
        public static string HashPasswordBCrypt(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public static string GetSaltBCrypt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt();
        }

        // Using SHA256

        // Hash password
        public static string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        // Verify password
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // Compute the hash of the input password
                byte[] hashedBytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convert the hashed bytes to a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < hashedBytes.Length; i++)
                {
                    builder.Append(hashedBytes[i].ToString("x2"));
                }
                string hashedInputPassword = builder.ToString();

                // Compare the hashed input password with the stored hashed password
                return string.Equals(hashedInputPassword, hashedPassword);
            }
        }
    }
}
