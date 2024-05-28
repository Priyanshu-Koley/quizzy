using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using quizzy.Entities;

namespace quizzy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly QuizzyDbContext _context;

        public RoleController(QuizzyDbContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminTeacher")]
        public async Task<ActionResult<Role>> GetRole(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // POST: api/Roles
        [HttpPost]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return StatusCode(201, role);
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateRole(Guid id, Role role)
        {
            if (id != role.Id)
            {
                return BadRequest();
            }

            _context.Entry(role).State = EntityState.Modified;
            //_context.Update(role);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(200, new
            {
                message = "Role updated successfully"
            });
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return StatusCode(200, new
            {
                message = "Role deleted successfully"
            });
        }

        private bool RoleExists(Guid id)
        {
            return _context.Roles.Any(e => e.Id == id);
        }
    }
}
