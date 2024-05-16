using quizzy.Entities;

namespace quizzy.Dtos
{
    public class GetUserDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public Guid RoleId { get; set; }
    }
}
