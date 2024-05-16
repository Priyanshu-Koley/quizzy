using Microsoft.EntityFrameworkCore;
using quizzy.Entities;

namespace quizzy.Data
{
    public class QuizzyDbContext : DbContext
    {
        public QuizzyDbContext(DbContextOptions options) : base(options) { }


        public DbSet<AppUser> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }
    }
}
