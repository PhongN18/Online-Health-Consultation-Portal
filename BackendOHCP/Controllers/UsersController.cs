using BackendOHCP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BackendOHCP.Data;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_context.Users.ToList());
        }

        // POST: api/users
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult CreateUser([FromBody] RegisterRequest registerRequest)
        {
            return Ok(new { message = "Admin created a new user." });
        }

        // DELETE: api/users/{id}
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            return Ok(new { message = $"User with id {id} has been deleted by admin." });
        }

        // ✅ PUT: api/users/{id}
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest req)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // Get the logged-in user's ID and role from JWT claims
            var currentUserId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

            // Allow only the user themselves or an admin to update
            if (currentUserId != id && currentUserRole != "admin")
                return Forbid("You are not allowed to update this user's info.");

            // Update user fields (optional chaining for null checks)
            user.FirstName = req.FirstName ?? user.FirstName;
            user.LastName = req.LastName ?? user.LastName;
            user.Gender = req.Gender ?? user.Gender;
            user.DateOfBirth = req.DateOfBirth ?? user.DateOfBirth;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User updated successfully.",
                user = new
                {
                    user.UserId,
                    user.Email,
                    user.Role,
                    user.FirstName,
                    user.LastName,
                    user.Gender,
                    user.DateOfBirth,
                    user.CreatedAt
                }
            });
        }
    }
}
