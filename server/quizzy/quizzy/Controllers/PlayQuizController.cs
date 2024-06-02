using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Dtos;
using quizzy.Entities;
using quizzy.ServiceInterfaces;
using quizzy.Services;

namespace quizzy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayQuizController : ControllerBase
    {
        private readonly QuizzyDbContext _context;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public PlayQuizController(QuizzyDbContext context, IMapper mapper, ITokenService tokenService)
        {
            _context = context;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("startQuiz")]
        [Authorize]
        public async Task<ActionResult> StartQuiz(StartQuizDto startQuizDto)
        {

            var result = await _context.Results
                .Where(r => r.UserId == startQuizDto.UserId && r.QuizId == startQuizDto.QuizId)
                .FirstOrDefaultAsync();

            if (result != null)
            {
                return (StatusCode(409, new { message = "Quiz already submitted" }));
            }

            Guid ResultId = Guid.NewGuid();

            startQuizDto.ResultId = ResultId;

            var user = await _context.Users.FindAsync(startQuizDto.UserId);

            var token = await _tokenService.CreateToken(user, 10, ResultId);

            var ResultData = _mapper.Map<Result>(startQuizDto);

            await _context.Results.AddAsync(ResultData);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating the quiz: {ex.Message}" });
            }
        }


        [HttpPut("submitQuiz/{resultId}")]
        [Authorize(Policy = "CanSubmit")]
        public async Task<ActionResult> SubmitQuiz(SubmitQuizDto submitQuizDto, Guid resultId)
        {
            var result = await _context.Results.Include(r => r.Answers).FirstOrDefaultAsync(r => r.ResultId == resultId);
            if (result == null)
            {
                return BadRequest(new { message = "Invalid result id" });
            }
            else if (result.EndTime != null)
            {
                return BadRequest(new { message = "Quiz already submitted" });
            }

            _mapper.Map(submitQuizDto, result);

            _context.Results.Update(result);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Quiz submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while updating the quiz: {ex.Message}" });
            }
        }

        [HttpGet("playedQuizzes/{userId}")]
        //[Authorize(Policy = "StudentOnly")]
        public async Task<ActionResult<List<GetResultDto>>> GetPlayedQuizzes(Guid userId)
        {
            var results = await _context.Results
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.StartTime)
                .ToListAsync();

            if (results == null || results.Count == 0)
            {
                return NotFound(new { message = "No results found for the given user." });
            }

            var resultDtos = _mapper.Map<List<GetResultDto>>(results);

            return Ok(resultDtos);
        }

        [HttpGet("playedQuizResult/{resultId}")]
        //[Authorize(Policy = "StudentOnly")]
        public async Task<ActionResult<GetResultDto>> GetPlayedQuizResult(Guid resultId)
        {
            var result = await _context.Results
                .Include(r => r.Answers)
                .FirstOrDefaultAsync(r => r.ResultId == resultId);

            if (result == null)
            {
                return NotFound(new { message = "Result not found" });
            }

            var resultDto = _mapper.Map<GetResultDto>(result);

            return Ok(resultDto);
        }

    }
}
