using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizzy.Entities
{
    public class Question
    {
        [Key]
        public Guid QuestionId { get; set; }
        public required string Title { get; set; }
        public required int QuestionNo { get; set; }
        public required int Marks { get; set; }
        public virtual ICollection<Option> Options { get; set; }

        // Foreign Key
        public Guid QuizId { get; set; }

        [ForeignKey("QuizId")]
        public virtual Quiz Quiz { get; set; }
    }
}
