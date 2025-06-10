//Xử lý đăng ký, đăng nhập và xác thực (JWT)
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using BackendOHCP.Data;
using BackendOHCP.Models;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly PasswordHasher<User> _hasher = new();

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            // Kiểm tra nếu email đã tồn tại trong hệ thống
            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
                return BadRequest(new { message = "Email already exists." });

            var user = new User
            {
                Email = req.Email,
                PasswordHash = _hasher.HashPassword(null, req.Password),
                Role = req.Role.ToLower(),
                FirstName = req.FirstName,
                LastName = req.LastName,
                CreatedAt = DateTime.UtcNow
            };

            // Thêm user vào DB
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Register success!" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            // Lấy user từ email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            // Kiểm tra password của user
            var result = _hasher.VerifyHashedPassword(null, user.PasswordHash, req.Password);
            if (result != PasswordVerificationResult.Success)
                return Unauthorized(new { message = "Invalid email or password." });

            // Tạo JWT token với các claim cần thiết
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role), // Role để phân quyền trong hệ thống
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Tạo token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(12), // Token hết hạn sau 12h
                signingCredentials: creds
            );

            // Trả về token
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expires = token.ValidTo
            });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            // Lấy email của người dùng từ JWT token
            var email = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.Identity.Name ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            // Lấy user từ email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return Unauthorized(new { message = "User not found." });

            // Trả về thông tin người dùng
            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                user.FirstName,
                user.LastName,
                user.CreatedAt
            });
        }
    }
}
