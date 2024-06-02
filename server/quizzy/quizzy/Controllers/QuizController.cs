using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Dtos;
using quizzy.Entities;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace quizzy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly QuizzyDbContext _context;
        private readonly IMapper _mapper;

        public QuizController(QuizzyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Quiz
        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetQuizDto>>> GetQuizzes()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .OrderByDescending(q => q.CreationTime) // Order by creation time
                .ToListAsync();

            //var quizDtos = quizzes.Select(quiz => new GetQuizDto
            //{
            //    QuizId = quiz.QuizId,
            //    Title = quiz.Title,
            //    Description = quiz.Description,
            //    CreationTime = quiz.CreationTime,
            //    CreatedBy = quiz.CreatedBy,
            //    Questions = quiz.Questions.Select(q => new GetQuestionDto
            //    {
            //        QuestionId = q.QuestionId,
            //        Title = q.Title,
            //        QuestionNo = q.QuestionNo,
            //        Options = q.Options.Select(o => new GetOptionDto
            //        {
            //            OptionId = o.OptionId,
            //            OptionNo = o.OptionNo,
            //            Text = o.Text,
            //            IsCorrect = o.IsCorrect
            //        }).ToList()
            //    }).ToList()
            //}).ToList();

            var quizzesDto = _mapper.Map<List<GetQuizDto>>(quizzes);

            return Ok(quizzesDto);
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

            var quizDto = _mapper.Map<GetQuizDto>(quiz);

            return quizDto;
        }

        // POST: api/Quiz
        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuizWithQuestionsAndOptions(CreateQuizDto quizDto)
        {
            // Create quiz
            //var quiz = new Quiz { Title = quizDto.Title, Description = quizDto.Description, CreationTime = DateTime.UtcNow, CreatedBy = quizDto.CreatedBy };
            //_context.Quizzes.Add(quiz);
            //await _context.SaveChangesAsync();

            //// Create questions
            //foreach (var questionDto in quizDto.Questions)
            //{
            //    var question = new Question { Title = questionDto.Title, QuizId = quiz.QuizId, QuestionNo = questionDto.QuestionNo };
            //    _context.Questions.Add(question);

            //    // Create options for each question
            //    foreach (var optionDto in questionDto.Options)
            //    {
            //        var option = new Option { Title = optionDto.Title, IsCorrect = optionDto.IsCorrect, Question = question, OptionNo = optionDto.OptionNo };
            //        _context.Options.Add(option);
            //    }
            //}

            var newQuiz = _mapper.Map<Quiz>(quizDto);
            _context.Add(newQuiz);

            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Quiz creted successfully" });
        }

        // PUT: api/Quiz/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateQuiz(Guid id, UpdateQuizDto updatedQuizDto)
        {

            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (existingQuiz == null)
            {
                return NotFound(new { message = "Quiz not found." });
            }

            // Delete the existing quiz
            _context.Quizzes.Remove(existingQuiz);

            // Create a new quiz
            //var newQuiz = new Quiz
            //{
            //    QuizId = id,
            //    Title = updatedQuizDto.Title,
            //    Description = updatedQuizDto.Description,
            //    CreationTime = updatedQuizDto.CreationTime,
            //    Questions = updatedQuizDto.Questions.Select(q => new Question
            //    {
            //        QuestionId = q.QuestionId,
            //        Title = q.Title,
            //        Options = q.Options.Select(o => new Option
            //        {
            //            OptionId = o.OptionId,
            //            Title = o.Title,
            //            IsCorrect = o.IsCorrect
            //        }).ToList()
            //    }).ToList()
            //};

            var updateQuiz = _mapper.Map<Quiz>(updatedQuizDto);

            // Add the new quiz to the context
            _context.Quizzes.Add(updateQuiz);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Quiz updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating the quiz: {ex.Message}" });
            }

        }

        [HttpPut("active/{id}")]
        public async Task<ActionResult> UpdateQuizStatus(Guid id, bool status)
        {

            var existingQuiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.QuizId == id);

            if (existingQuiz == null)
            {
                return NotFound(new { message = "Quiz not found." });
            }

            existingQuiz.Active = status;
            _context.Quizzes.Update(existingQuiz);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Quiz status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating the quiz: {ex.Message}" });
            }
        }
        // DELETE: api/Quiz/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(Guid id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Quiz deleted successfully"
            });
        }


        private bool QuizExists(Guid id)
        {
            return _context.Quizzes.Any(e => e.QuizId == id);
        }
    }
}
