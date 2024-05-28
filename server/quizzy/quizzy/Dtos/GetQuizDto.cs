using quizzy.Entities;

namespace quizzy.Dtos
{
    public class GetQuizDto
    {
        public Guid QuizId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
        public Guid CreatedBy { get; set; }
        public int TotalTimeInSeconds { get; set; }
        public bool Active { get; set; }
        public List<GetQuestionDto> Questions { get; set; }
    }

    public class GetQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; }
        public int QuestionNo { get; set; }
        public int Marks { get; set; }
        public List<GetOptionDto> Options { get; set; }
    }

    public class GetOptionDto
    {
        public Guid OptionId { get; set; }
        public int OptionNo { get; set; }
        public string Title { get; set; }
        public bool IsCorrect { get; set; }
    }


}
