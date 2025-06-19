using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var doctors = await _context.DoctorProfiles
                .Include(dp => dp.User)
                .Select(dp => new
                {
                    dp.DoctorProfileId,
                    dp.UserId,
                    dp.Specialization,
                    dp.Qualification,
                    dp.ExperienceYears,
                    dp.Rating,
                    User = dp.User == null ? null : new
                    {
                        dp.User.UserId,
                        dp.User.Email,
                        dp.User.FirstName,
                        dp.User.LastName,
                        dp.User.Gender,
                        dp.User.DateOfBirth
                    }
                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("{doctorProfileId}")]
        public async Task<IActionResult> GetByDoctorId(int doctorProfileId)
        {
            var profile = await _context.DoctorProfiles
                .Include(p => p.User)
                .Where(p => p.DoctorProfileId == doctorProfileId)
                .Select(p => new
                {
                    p.DoctorProfileId,
                    p.UserId,
                    p.Specialization,
                    p.Qualification,
                    p.ExperienceYears,
                    p.Rating,
                    User = new
                    {
                        p.User.UserId,
                        p.User.Email,
                        p.User.FirstName,
                        p.User.LastName,
                        p.User.Gender,
                        p.User.DateOfBirth
                    }
                })
                .FirstOrDefaultAsync();

            if (profile == null)
                return NotFound();

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
