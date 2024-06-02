using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using AutoMapper;
using quizzy.Data;
using quizzy.ServiceInterfaces;
using Microsoft.EntityFrameworkCore;

namespace quizzy.Controllers
{
    // Define model for audit history change email
    public class InviteUserEmailModel
    {
        public required string Name { get; set; } = string.Empty; // Name of the recipient
        public required string ToEmail { get; set; } = string.Empty; // Email address of the recipient
        public required string Password { get; set; } = string.Empty; // Password of the recipient
    }
    public class QuizAddedEmailModel
    {
        public required string QuizName { get; set; } = string.Empty; // QuizName
        public required string CreatedBy { get; set; } = string.Empty; // Quiz CreatedBy
    }

    // Controller for handling email-related operations
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        // Sender's email address and key
        public string FromEmail = "priyanshukoley0@gmail.com";
        public string Key = "oinq humj srsb kqry";

        private readonly QuizzyDbContext _context;
        private readonly IMapper _mapper;

        public EmailController(QuizzyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Endpoint for sending audit updation email
        [HttpPost("InviteUser")]
        public async Task<ActionResult> InviteUser(InviteUserEmailModel emailData)
        {
            var Subject = $"Invitation from Quizzy";

            // Construct the email message
            var message = new MailMessage()
            {
                From = new MailAddress(FromEmail), // Sender email address
                Subject = Subject, // Email subject
                IsBodyHtml = true, // Flag to set body to HTML
                                   // Email body

                Body = $"""
                <html>
                    <body style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px 0px;">
                        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <p>Hello {emailData.Name},</p>
                            <p style="color: #555;">You are invited to come and join quizzy and participate in the Quizzes!</p>
                            <small>Please note the bellow login credentials for future</small>
                            <ul>
                                <li>Email: {emailData.ToEmail}</li>
                                <li>Password: {emailData.Password}</li>
                            </ul>
                            <p style="color: #555;">Please click the button bellow to login to your account.</p>
                            <div>
                                <a href="http://localhost:3000" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Login</a>
                            </div>
                            <p style="color: #555;">Warm regards,<br>Quizzy</p>
                        </div>
                    </body>
                </html>
                """,
            };

            // Add recipient's email address
            message.To.Add(new MailAddress(emailData.ToEmail));

            // Create new SMTP client
            var smtp = new SmtpClient("smtp.gmail.com")
            {
                // Using google SMTP server
                Port = 587,
                Credentials = new NetworkCredential(FromEmail, Key),
                EnableSsl = true,
            };
            // Sent Email
            smtp.Send(message);

            // Return success message
            return Ok(new { message = "Invitation Sent" });
        }


        [HttpPost("QuizAdded")]
        public async Task<ActionResult> QuizAdded(QuizAddedEmailModel emailData)
        {
            var Subject = $"New Quiz added in Quizzy";

            // Construct the email message
            var message = new MailMessage()
            {
                From = new MailAddress(FromEmail), // Sender email address
                Subject = Subject, // Email subject
                IsBodyHtml = true, // Flag to set body to HTML
                                   // Email body

                Body = $"""
                <html>
                    <body style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 20px 0px;">
                        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <p>Hey!!</p>
                            <p style="color: #555;">A new quiz named {emailData.QuizName} has been added by {emailData.CreatedBy}!</p>
                            
                            <p style="color: #555;">Please click the button bellow to login to your account and participate in it.</p>
                            <div>
                                <a href="http://localhost:3000" style="display: inline-block; padding: 10px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Login</a>
                            </div>
                            <p style="color: #555;">Warm regards,<br>Quizzy</p>
                        </div>
                    </body>
                </html>
                """,
            };
            var StudentRole = await _context.Roles.FirstOrDefaultAsync(role => role.RoleName == "Student");
            var ToEmailAddresses = _context.Users.Where(user => user.RoleID == StudentRole.RoleId);


            // Add recipient's email address
            await ToEmailAddresses.ForEachAsync(user =>
            {
                message.To.Add(new MailAddress(user.Email));
            });

            // Create new SMTP client
            var smtp = new SmtpClient("smtp.gmail.com")
            {
                // Using google SMTP server
                Port = 587,
                Credentials = new NetworkCredential(FromEmail, Key),
                EnableSsl = true,
            };
            // Sent Email
            smtp.Send(message);

            // Return success message
            return Ok(new { message = "Quiz update sent" });
        }



    }
}