using Microsoft.EntityFrameworkCore;
using quizzy.Data;
using System;
using quizzy.Controllers;
using quizzy.Entities;
using System.Numerics;
using quizzy.ServiceInterfaces;
using quizzy.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using quizzy.Automapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddControllers();

//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.MaxDepth = int.MaxValue; // Set your desired depth here
//    });

// Register AutoMapper and add profiles
builder.Services.AddAutoMapper(typeof(MappingProfile));

//.AddJsonOptions(options =>
//{
//    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//});

builder.Services.AddCors();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("TokenKey"))),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true, // Ensure token lifetime validation
            ClockSkew = TimeSpan.Zero // No tolerance for expiration time
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("TeacherOnly", policy => policy.RequireRole("Teacher"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
    options.AddPolicy("CanSubmit", policy => policy.RequireClaim("ResultId"));

    // Admin and Teacher can access
    options.AddPolicy("AdminTeacher", policy => policy.RequireRole("Admin", "Teacher"));
    // Admin, Teacher, and Student can access
    options.AddPolicy("AdminTeacherStudent", policy => policy.RequireRole("Admin", "Teacher", "Student"));
});

builder.Services.AddDbContext<QuizzyDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    //options.UseLazyLoadingProxies();
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policy => policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:4200", "http://localhost:3000")
                         );

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
