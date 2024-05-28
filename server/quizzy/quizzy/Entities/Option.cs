using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Option
    {
        [Key]
        public Guid OptionId { get; set; }
        public required string Title { get; set; }
        public required bool IsCorrect { get; set; }
        public required int OptionNo { get; set; }

        // Foreign Key
        public Guid QuestionId { get; set; }

        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; }
    }
}
