using quizzy.Entities;

namespace quizzy.ServiceInterfaces
{
    public interface ITokenService
    {
        public string CreateToken(AppUser user);
    }
}
