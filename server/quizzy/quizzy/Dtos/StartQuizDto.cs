using quizzy.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzy.Dtos
{
    public class StartQuizDto
    {
        public required Guid UserId { get; set; }
        public required Guid QuizId { get; set; }
        public Guid ResultId { get; set; }
        public required int TotalMarks { get; set; }
    }
}
