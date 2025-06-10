using Microsoft.AspNetCore.Mvc;
using BackendOHCP.Data;
using BackendOHCP.Models;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorProfilesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DoctorProfilesController(AppDbContext context) => _context = context;

        [HttpPost]
        public IActionResult Create([FromBody] DoctorProfile profile)
        {
            _context.DoctorProfiles.Add(profile);
            _context.SaveChanges();
            return Ok(profile);
        }

        [HttpGet("{userId}")]
        public IActionResult GetByUserId(int userId)
        {
            var profile = _context.DoctorProfiles.FirstOrDefault(p => p.UserId == userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpPut("{userId}")]
        public IActionResult Update(int userId, [FromBody] DoctorProfile updated)
        {
            var profile = _context.DoctorProfiles.FirstOrDefault(p => p.UserId == userId);
            if (profile == null) return NotFound();

            profile.Specialization = updated.Specialization;
            profile.Qualification = updated.Qualification;
            profile.ExperienceYears = updated.ExperienceYears;
            profile.Rating = updated.Rating;

            _context.SaveChanges();
            return Ok(profile);
        }

        [HttpDelete("{userId}")]
        public IActionResult Delete(int userId)
        {
            var profile = _context.DoctorProfiles.FirstOrDefault(p => p.UserId == userId);
            if (profile == null) return NotFound();

            _context.DoctorProfiles.Remove(profile);
            _context.SaveChanges();
            return Ok(new { message = "Deleted" });
        }
    }
}
