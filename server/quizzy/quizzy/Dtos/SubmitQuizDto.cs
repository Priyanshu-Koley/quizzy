using quizzy.Entities;

namespace quizzy.Dtos
{
    public class SubmitQuizDto
    {
        public List<AnswerDto> Answers { get; set; }
        public int NoOfAttemptedQuestions { get; set; }
        public int NoOfCorrectAnswers { get; set; }
        public int NoOfWrongAnswers { get; set; }
        public int ObtainedMarks { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public double TimeTakenInSecs { get; set; }
    }
}
