using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Entities;
using quizzy.Validators;
using quizzy.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace quizzy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly QuizzyDbContext _context;

        public UserController(QuizzyDbContext context)
        {
            _context = context;
        }

        // Get all users
        //[Authorize]
        [HttpGet]
        public async Task<ActionResult<List<GetUserDto>>> GetUsersAsync()
        {
            try
            {
                var users = await _context.Users
                                            .Select(u => new { u.Id, u.Name, u.Email, u.RoleID })
                                            .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {

                // Return a 500 Internal Server Error status code with an error message
                return StatusCode(500, "An error occurred while fetching users. Please try again later.");
            }
        }

        // Get user by Id
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserDto>> GetUserByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            var response = new GetUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
            return Ok(user);
        }

        // Create user
        //[HttpPost]
        //public async Task<ActionResult<AppUser>> AddUserAsync(AppUser user)
        //{
        //    try
        //    {
        //        // Check if the provided id already exists
        //        if (_context.Users.Any(u => u.Id == user.Id))
        //        {
        //            return Conflict("User ID already exists.");
        //        }

        //        // Check if the provided email already exists
        //        if (_context.Users.Any(u => u.Email == user.Email))
        //        {
        //            return Conflict("Email address already exists.");
        //        }

        //        // Validate the email address
        //        if (!EmailValidator.IsValidEmail(user.Email))
        //        {
        //            return BadRequest("Invalid email address.");
        //        }

        //        // Validate the password
        //        if (!PasswordValidator.IsValidPassword(user.Password))
        //        {
        //            return BadRequest("Invalid password.");
        //        }

        //        // Hash password 
        //        user.Password = Hasher.PasswordHasher.HashPasswordBCrypt(user.Password);

        //        // Add the user to the context
        //        await _context.Users.AddAsync(user);
        //        await _context.SaveChangesAsync();

        //        // Return a 201 Created status code with the newly created user
        //        return StatusCode(201, user);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Return a 500 Internal Server Error status code with an error message
        //        return StatusCode(500, "An error occurred while adding the user. Please try again later.");
        //    }
        //}

        // Update a user by ID
        //[HttpPut("{id}")]
        //public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserDto updatedUser)
        //{
        //    try
        //    {
        //        var existingUser = await _context.Users.FindAsync(id);

        //        if (existingUser == null)
        //        {
        //            return NotFound("User not found");
        //        }
        //        // Check if the provided email already exists
        //        if (_context.Users.Any(u => u.Email == updatedUser.Email))
        //        {
        //            return Conflict("Email address already exists.");
        //        }

        //        // Validate the email address
        //        if (!EmailValidator.IsValidEmail(updatedUser.Email))
        //        {
        //            return BadRequest("Invalid email address.");
        //        }

        //        // Validate the password
        //        if (!PasswordValidator.IsValidPassword(updatedUser.Password))
        //        {
        //            return BadRequest("Invalid password.");
        //        }

        //        existingUser.Name = updatedUser.Name;
        //        existingUser.Email = updatedUser.Email;
        //        // Hash password 
        //        existingUser.Password = Hasher.PasswordHasher.HashPasswordBCrypt(updatedUser.Password);

        //        _context.Users.Update(existingUser);
        //        await _context.SaveChangesAsync();

        //        return Ok(existingUser);

        //    }
        //    catch (Exception ex)
        //    {
        //        // Return a 500 Internal Server Error status code with an error message
        //        return StatusCode(500, "An error occurred while adding the user. Please try again later.");
        //    }
        //}

        // Update user's name by ID

        [Authorize]
        [HttpPut("{id}/name")]
        public async Task<ActionResult> UpdateUserNameAsync(Guid id, [FromBody] string name)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Name = name;
            await _context.SaveChangesAsync();

            return Ok("Name updated successfully");
        }

        // Update user's email by ID
        [Authorize]
        [HttpPut("{id}/email")]
        public async Task<ActionResult> UpdateUserEmailAsync(Guid id, [FromBody] string email)
        {
            // Validate email format
            if (!Validators.EmailValidator.IsValidEmail(email))
            {
                return BadRequest("Invalid email format");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict("Email already exists");
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            user.Email = email;
            await _context.SaveChangesAsync();

            return Ok("Email address updated successfully");
        }

        // Update user's password by ID
        //[HttpPut("{id}/password")]
        //public async Task<ActionResult> UpdateUserPasswordAsync(Guid id, [FromBody] string password)
        //{
        //    // Validate password
        //    if (!Validators.PasswordValidator.IsValidPassword(password))
        //    {
        //        return BadRequest("Invalid password format");
        //    }

        //    var user = await _context.Users.FindAsync(id);

        //    if (user == null)
        //    {
        //        return NotFound("User not found");
        //    }

        //    // Hash the password
        //    user.Password = Hasher.PasswordHasher.HashPasswordBCrypt(password);
        //    await _context.SaveChangesAsync();

        //    return Ok("Password updated successfully");
        //}

        // Delete a user by ID

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully");
        }
    }
}
