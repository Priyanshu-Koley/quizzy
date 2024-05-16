using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Option
    {
        [Key]
        public Guid OptionId { get; set; }
        public required string Text { get; set; }
        public bool IsCorrect { get; set; }

        // Foreign Key
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; }
    }
}
