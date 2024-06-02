using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class AppUser
    {
        [Key]
        public Guid UserId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PasswordSalt { get; set; }
        public required string PasswordHash { get; set; }
        public Guid RoleID { get; set; }
        [ForeignKey("RoleID")]
        public virtual Role Role { get; set; }
    }
}
