using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Result
    {
        [Key]
        public Guid ResultId { get; set; } // Primary Key

        public virtual ICollection<Answer>? Answers { get; set; }
        public int? NoOfAttemptedQuestions { get; set; }
        public int? NoOfCorrectAnswers { get; set; }
        public int? NoOfWrongAnswers { get; set; }
        [Required]
        public int TotalMarks { get; set; }
        public int? ObtainedMarks { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double? TimeTakenInSecs { get; set; }

        //Foreign Keys
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual AppUser AppUser { get; set; }

        public Guid QuizId { get; set; }
        [ForeignKey("QuizId")]
        public virtual Quiz Quiz { get; set; }
    }
}
