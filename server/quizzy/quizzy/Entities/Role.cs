using System.ComponentModel.DataAnnotations;

namespace quizzy.Entities
{
    public class Role
    {
        [Key]
        public Guid Id { get; set; }
        public required string RoleName { get; set; }
        public string? Description { get; set; }
    }
}
