namespace quizzy.Dtos
{
    public class StartQuizDto
    {
        public Guid UserId { get; set; }
        public Guid QuizId { get; set; }
        public DateTime StartTime { get; set; } = DateTime.UtcNow;
        public string UserIpAddress { get; set; }

    }
}
