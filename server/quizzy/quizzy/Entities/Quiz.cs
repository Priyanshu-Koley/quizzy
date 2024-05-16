using System.ComponentModel.DataAnnotations;

namespace quizzy.Entities
{
    public class Quiz
    {
        [Key]
        public Guid QuizId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public virtual ICollection<Question> Questions { get; set; }
    }
}
