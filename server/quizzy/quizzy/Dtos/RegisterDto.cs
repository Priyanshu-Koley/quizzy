using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace quizzy.Dtos
{
    public class RegisterDto
    {
        [Required]
        [MinLength(8)]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        public Guid RoleId { get; set; }
    }
}
