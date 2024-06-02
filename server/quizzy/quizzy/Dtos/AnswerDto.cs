using quizzy.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace quizzy.Dtos
{
    public class AnswerDto
    {
        public bool IsCorrect { get; set; }

        ////Foreign Keys
        public Guid ResultId { get; set; }

        public Guid QuestionId { get; set; }

        public Guid OptionId { get; set; }

        public Guid UserId { get; set; }

        public Guid QuizId { get; set; }
    }
}
