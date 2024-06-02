namespace quizzy.Dtos
{
    public class GetResultDto
    {
        public Guid ResultId { get; set; }
        public List<GetAnswerDto>? Answers { get; set; }
        public int? NoOfAttemptedQuestions { get; set; }
        public int? NoOfCorrectAnswers { get; set; }
        public int? NoOfWrongAnswers { get; set; }
        public int TotalMarks { get; set; }
        public int? ObtainedMarks { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public double? TimeTakenInSecs { get; set; }
        public Guid UserId { get; set; }
        public Guid QuizId { get; set; }
    }


    public class GetAnswerDto
    {
        public bool IsCorrect { get; set; }
        public Guid ResultId { get; set; }
        public Guid QuestionId { get; set; }
        public Guid OptionId { get; set; }
        public Guid UserId { get; set; }
        public Guid QuizId { get; set; }
    }

   
}
