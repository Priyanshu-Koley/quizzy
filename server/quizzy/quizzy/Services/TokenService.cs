using Microsoft.IdentityModel.Tokens;
using quizzy.Data;
using quizzy.Entities;
using quizzy.ServiceInterfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace quizzy.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly QuizzyDbContext _context;
        public TokenService(IConfiguration configuration, QuizzyDbContext context)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));
            _context = context;
        }

        public async Task<string> CreateToken(AppUser user, int lifeTimeInMins)
        {
            var Role = await _context.Roles.FindAsync(user.RoleID);
            var claims = new List<Claim>
            {
                new Claim("userId", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, Role!.RoleName),
                new Claim("roleId", user.RoleID.ToString())
            };

            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(lifeTimeInMins),
                SigningCredentials = credentials
            };

            var tokenhandler = new JwtSecurityTokenHandler();

            var token = tokenhandler.CreateToken(tokenDescriptor);

            return tokenhandler.WriteToken(token);
        }
    }
}
