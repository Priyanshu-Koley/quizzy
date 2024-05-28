using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Quiz
    {
        [Key]
        public Guid QuizId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTime CreationTime { get; set; }
        public required int TotalTimeInSeconds { get; set; }
        public required bool Active { get; set; } = true;
        public virtual ICollection<Question> Questions { get; set; }

        //Foreign Key
        public Guid CreatedBy { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual AppUser AppUser { get; set; }

    }
}
