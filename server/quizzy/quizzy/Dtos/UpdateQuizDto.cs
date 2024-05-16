namespace quizzy.Dtos
{
    public class UpdateQuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<UpdateQuestionDto> Questions { get; set; }
    }

    public class UpdateOptionDto
    {
        public Guid OptionId { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class UpdateQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; }
        public List<UpdateOptionDto> Options { get; set; }
    }
}
