using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Answer
    {
        [Key]
        public Guid AnswerId { get; set; } // Primary Key

        public bool IsCorrect { get; set; }

        //Foreign Keys
        public Guid ResultId { get; set; }
        [ForeignKey("ResultId")]
        public virtual Result Result { get; set; }

        public Guid QuestionId { get; set; }
        [ForeignKey("QuestionId")]
        public virtual Question Question { get; set; }

        public Guid OptionId { get; set; }
        [ForeignKey("OptionId")]
        public virtual Option Option { get; set; }

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual AppUser AppUser { get; set; }

        public Guid QuizId { get; set; }
        [ForeignKey("QuizId")]
        public virtual Quiz Quiz { get; set; }
    }
}
