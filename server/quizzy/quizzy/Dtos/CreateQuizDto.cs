namespace quizzy.Dtos
{
    using System.Collections.Generic;

    public class CreateQuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }

    public class QuestionDto
    {
        public string Title { get; set; }
        public List<OptionDto> Options { get; set; }
    }

    public class OptionDto
    {
        public string Title { get; set; }
        public bool IsCorrect { get; set; }
    }

}
