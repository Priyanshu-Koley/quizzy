namespace quizzy.Dtos
{
    public class GetQuizDto
    {
        public Guid QuizId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<GetQuestionDto> Questions { get; set; }
    }

    public class GetQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; }
        public ICollection<GetOptionDto> Options { get; set; }
    }

    public class GetOptionDto
    {
        public Guid OptionId { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

}
