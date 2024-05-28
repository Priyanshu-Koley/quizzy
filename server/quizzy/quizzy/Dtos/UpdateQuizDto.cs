namespace quizzy.Dtos
{
    public class UpdateQuizDto
    {
        public Guid QuizId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationTime { get; set; }
        public Guid CreatedBy { get; set; }
        public int TotalTimeInSeconds { get; set; }
        public bool Active { get; set; }
        public List<UpdateQuestionDto> Questions { get; set; }
    }
    public class UpdateQuestionDto
    {
        public string Title { get; set; }
        public int QuestionNo { get; set; }
        public int Marks { get; set; }
        public List<UpdateOptionDto> Options { get; set; }
    }

    public class UpdateOptionDto
    {
        public string Title { get; set; }
        public int OptionNo { get; set; }
        public bool IsCorrect { get; set; }
    }

}
