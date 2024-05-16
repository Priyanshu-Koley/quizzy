using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Dtos;
using quizzy.Entities;
using quizzy.ServiceInterfaces;
using quizzy.Validators;

namespace quizzy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly QuizzyDbContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(QuizzyDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResultDto>> Login(LoginDto loginDto)
        {
            try
            {
                // Find the user
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);

                if (user == null)
                {
                    return Unauthorized("Email does not exists");
                }

                // Combine the provided password with the stored salt and hash it
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(loginDto.Password, user.PasswordSalt);

                // Check the hashed password and the DB password matches or not
                if (hashedPassword == user.PasswordHash)
                {
                    return new LoginResultDto
                    {
                        Token = _tokenService.CreateToken(user)
                    };
                }
                else
                {
                    return Unauthorized("Incorrect password");
                }
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error status code with an error message
                return StatusCode(500, "An error occurred while logging in. Please try again later.");
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResultDto>> Register(RegisterDto registerDto)
        {
            try
            {

                // Check if the provided email already exists
                if (_context.Users.Any(u => u.Email == registerDto.Email))
                {
                    return Conflict("Email address already exists");
                }

                // Validate the email address
                if (!EmailValidator.IsValidEmail(registerDto.Email))
                {
                    return BadRequest("Invalid email address");
                }

                // Validate the password
                if (!PasswordValidator.IsValidPassword(registerDto.Password))
                {
                    return BadRequest("Invalid password");
                }

                // Generate salt
                var passwordSalt = Hasher.PasswordHasher.GetSaltBCrypt();

                // Hash password 
                var passwordHash = Hasher.PasswordHasher.HashPasswordBCrypt(registerDto.Password, passwordSalt);

                // Create a user
                var user = new AppUser
                {
                    Name = registerDto.Name,
                    Email = registerDto.Email,
                    RoleID = registerDto.RoleId,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                };

                // Add the user to the context
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                // Return a 201 Created status code with the newly created user
                return StatusCode(201, new RegisterResultDto
                {
                    Token = _tokenService.CreateToken(user)
                });
            }
            catch (Exception ex)
            {
                // Return a 500 Internal Server Error status code with an error message
                return StatusCode(500, "An error occurred while registering the user. Please try again later.");
            }
        }
    }
}
