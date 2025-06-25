using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BackendOHCP.Data;
using BackendOHCP.Models;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/auth/member")]
    public class MemberAuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _auth;

        public MemberAuthController(AppDbContext context, AuthService auth)
        {
            _context = context;
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                Email = req.Email,
                PasswordHash = _auth.HashPassword(req.Password),
                Role = "patient",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                token = _auth.GenerateJwtToken(user),
                user = new
                {
                    user.UserId,
                    user.Email,
                    user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email && u.Role == "patient");
            if (user == null || !_auth.VerifyPassword(user.PasswordHash, req.Password))
                return Unauthorized(new { message = "Invalid credentials." });

            return Ok(new
            {
                token = _auth.GenerateJwtToken(user),
            });
        }

        [HttpGet("me")]
        [Authorize(Roles = "patient")]
        public async Task<IActionResult> Me()
        {
            var email = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
                        User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                        User.Identity?.Name;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Unable to identify user." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Role == "patient");
            if (user == null)
                return Unauthorized(new { message = "Patient not found." });

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                user.FirstName,
                user.LastName,
                user.Gender,
                user.DateOfBirth,
                user.CreatedAt
            });
        }
    }

}
