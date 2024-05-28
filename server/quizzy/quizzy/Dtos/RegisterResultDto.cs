using System.ComponentModel.DataAnnotations;

namespace quizzy.Dtos
{
    public class RegisterResultDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Guid RoleID { get; set; }
    }
}
