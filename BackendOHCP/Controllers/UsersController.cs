//Chỉ Admin có thể truy cập
using BackendOHCP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendOHCP.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        // GET: api/users
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(new { message = "Only admins can view all users." });
        }

        // POST: api/users
        [HttpPost]
        public IActionResult CreateUser([FromBody] RegisterRequest registerRequest)
        {
            return Ok(new { message = "Admin created a new user." });
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            return Ok(new { message = $"User with id {id} has been deleted by admin." });
        }
    }
}
