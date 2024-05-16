using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Dtos;
using quizzy.Entities;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace quizzy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly QuizzyDbContext _context;

        public QuizController(QuizzyDbContext context)
        {
            _context = context;
        }

        // GET: api/Quiz
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetQuizDto>>> GetQuizzes()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .ToListAsync();

            var quizDtos = quizzes.Select(quiz => new GetQuizDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                Questions = quiz.Questions.Select(q => new GetQuestionDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Options = q.Options.Select(o => new GetOptionDto
                    {
                        OptionId = o.OptionId,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            }).ToList();

            return quizDtos;
        }


        // GET: api/Quiz/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetQuizDto>> GetQuiz(Guid id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new GetQuizDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                Questions = quiz.Questions.Select(q => new GetQuestionDto
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Options = q.Options.Select(o => new GetOptionDto
                    {
                        OptionId = o.OptionId,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return quizDto;
        }

        // POST: api/Quiz
        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuizWithQuestionsAndOptions(CreateQuizDto quizDto)
        {
            // Create quiz
            var quiz = new Quiz { Title = quizDto.Title, Description = quizDto.Description };
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            // Create questions
            foreach (var questionDto in quizDto.Questions)
            {
                var question = new Question { Title = questionDto.Title, QuizId = quiz.QuizId };
                _context.Questions.Add(question);

                // Create options for each question
                foreach (var optionDto in questionDto.Options)
                {
                    var option = new Option { Text = optionDto.Title, IsCorrect = optionDto.IsCorrect, Question = question };
                    _context.Options.Add(option);
                }
            }

            await _context.SaveChangesAsync();

            return StatusCode(201, "Quiz creted successfully");
        }

        // PUT: api/Quiz/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuiz(Guid id, UpdateQuizDto updatedQuizDto)
        {
            //if (id != updatedQuizDto.QuizId)
            //{
            //    return BadRequest("Mismatch between provided ID and quiz ID in the payload.");
            //}

            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (existingQuiz == null)
            {
                return NotFound("Quiz not found.");
            }

            // Delete the existing quiz
            _context.Quizzes.Remove(existingQuiz);

            // Create a new quiz
            var newQuiz = new Quiz
            {
                QuizId = id,
                Title = updatedQuizDto.Title,
                Description = updatedQuizDto.Description,
                Questions = updatedQuizDto.Questions.Select(q => new Question
                {
                    QuestionId = q.QuestionId,
                    Title = q.Title,
                    Options = q.Options.Select(o => new Option
                    {
                        OptionId = o.OptionId,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            // Add the new quiz to the context
            _context.Quizzes.Add(newQuiz);

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Quiz updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the quiz: {ex.Message}");
            }

        }

        // DELETE: api/Quiz/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return Ok("Quiz deleted successfully");
        }

        private bool QuizExists(Guid id)
        {
            return _context.Quizzes.Any(e => e.QuizId == id);
        }
    }
}
