using BackendOHCP.Models;
using BackendOHCP.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _auth;

        public AdminController(AppDbContext context, AuthService auth)
        {
            _context = context;
            _auth = auth;
        }

        // 1. Admin login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email && u.Role == "admin");

            if (user == null || !_auth.VerifyPassword(user.PasswordHash, req.Password))
                return Unauthorized(new { message = "Invalid credentials." });

            return Ok(new
            {
                token = _auth.GenerateJwtToken(user),
            });
        }

        // 2. Dashboard summary
        [HttpGet("summary")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetSummary()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPatients = await _context.Users.CountAsync(p => p.Role == "patient");
            var verifiedDoctors = await _context.DoctorProfiles.CountAsync(p => p.Verified);
            var pendingDoctors = await _context.DoctorProfiles.CountAsync(p => !p.Verified);
            var pendingCancellations = await _context.Appointments
                .Where(a => a.CancelApproved == null && a.CancelReason != null)
                .Include(a => a.Doctor)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    DoctorName = a.Doctor.FirstName + " " + a.Doctor.LastName
                })
                .ToListAsync();

            return Ok(new
            {
                totalUsers,
                verifiedDoctors,
                pendingDoctors,
                totalPatients,
                pendingCancellations = pendingCancellations.Count,
                pendingCancellationsPreview = pendingCancellations
            });
        }

        // 3. Get list of unverified doctors
        [HttpGet("pending-doctors")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetPendingDoctors()
        {
            var pendingDoctors = await _context.DoctorProfiles
                .Where(p => !p.Verified)
                .Include(p => p.User)
                .Select(p => new
                {
                    p.DoctorProfileId,
                    p.Specialization,
                    p.Qualification,
                    p.ExperienceYears,
                    p.Verified,
                    CareOptions = p.CareOptions.Select(c => c.CareOption.ToString("g")),
                    p.User.FirstName,
                    p.User.LastName
                })
                .ToListAsync();

            return Ok(pendingDoctors);
        }

        // 4. Approve doctor by ID
        [HttpPost("verify-doctor/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> VerifyDoctor(int id)
        {
            var doctor = await _context.DoctorProfiles.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found." });

            doctor.Verified = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor profile verified successfully." });
        }

        [HttpPost("reject-doctor/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> RejectDoctor(int id)
        {
            var profile = await _context.DoctorProfiles.FindAsync(id);
            if (profile == null)
                return NotFound();

            _context.DoctorProfiles.Remove(profile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor profile rejected and removed." });
        }

        // GET: api/admin/pending-cancellations
        [HttpGet("pending-cancellations")]
        public IActionResult GetPendingCancellationRequests()
        {
            var pendingRequests = _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Where(a => a.CancelReason != null && a.CancelApproved == null)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.CancelReason,
                    PatientName = a.Patient.FirstName + " " + a.Patient.LastName,
                    DoctorName = a.Doctor.FirstName + " " + a.Doctor.LastName
                })
                .ToList();

            return Ok(pendingRequests);
        }

        // POST: api/admin/approve-cancellation
        [HttpPost("approve-cancellation/{id}")]
        public IActionResult ApproveCancellation(int id)
        {
            var appt = _context.Appointments.FirstOrDefault(a => a.AppointmentId == id);
            if (appt == null)
                return NotFound(new { message = "Appointment not found." });

            appt.Status = "Cancelled";
            appt.CancelApproved = true;

            _context.SaveChanges();
            return Ok(new { message = "Appointment cancellation approved." });
        }

        // POST: api/admin/reject-cancellation
        [HttpPost("reject-cancellation/{id}")]
        public IActionResult RejectCancellation(int id)
        {
            var appt = _context.Appointments.FirstOrDefault(a => a.AppointmentId == id);
            if (appt == null)
                return NotFound(new { message = "Appointment not found." });

            appt.Status = "Scheduled";
            appt.CancelApproved = false;

            _context.SaveChanges();
            return Ok(new { message = "Cancellation request rejected and appointment remains scheduled." });
        }

    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
