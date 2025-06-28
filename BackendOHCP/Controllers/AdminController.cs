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

        [HttpGet("patients")]
        public async Task<IActionResult> GetPatients(
    [FromQuery] int? userId,
    [FromQuery] string? email,
    [FromQuery] string? firstName,
    [FromQuery] string? lastName,
    [FromQuery] string? dateOfBirth,
    [FromQuery] string? age,
    [FromQuery] string? gender,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _context.Users.Where(u => u.Role == "patient");

            if (userId.HasValue)
                query = query.Where(u => u.UserId == userId.Value);
            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(u => u.Email.ToLower().Contains(email.ToLower()));
            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(u => u.FirstName.ToLower().Contains(firstName.ToLower()));
            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(u => u.LastName.ToLower().Contains(lastName.ToLower()));
            if (!string.IsNullOrWhiteSpace(gender))
                query = query.Where(u => u.Gender.ToLower() == gender.ToLower());
            if (!string.IsNullOrWhiteSpace(dateOfBirth) && DateTime.TryParse(dateOfBirth, out var dob))
                query = query.Where(u => u.DateOfBirth.HasValue && u.DateOfBirth.Value.Date == dob.Date);
            if (!string.IsNullOrWhiteSpace(age) && int.TryParse(age, out var ageInt))
            {
                var today = DateTime.Today;
                var minDob = today.AddYears(-ageInt - 1).AddDays(1);
                var maxDob = today.AddYears(-ageInt);
                query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            var totalCount = await query.CountAsync();
            var patients = await query
                .OrderBy(u => u.LastName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.UserId,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Gender,
                    u.DateOfBirth
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                data = patients
            });
        }

        // Update a patient by userId
        [HttpPut("patient/{userId}")]
        public async Task<IActionResult> UpdatePatient(int userId, [FromBody] UpdatePatientRequest req)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId && u.Role == "patient");
            if (user == null)
                return NotFound(new { message = "Patient not found." });

            user.FirstName = req.FirstName?.Trim();
            user.LastName = req.LastName?.Trim();
            user.Email = req.Email?.Trim();
            user.Gender = req.Gender;

            if (!string.IsNullOrEmpty(req.DateOfBirth) && DateTime.TryParse(req.DateOfBirth, out var dob))
            {
                user.DateOfBirth = dob;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient updated successfully." });
        }


        // Delete a patient by userId
        [HttpDelete("patient/{userId}")]
        public async Task<IActionResult> DeletePatient(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId && u.Role == "patient");
            if (user == null)
                return NotFound(new { message = "Patient not found." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient deleted successfully." });
        }

        [HttpGet("care-options")]
        public IActionResult GetCareOptions()
        {
            var careOptions = Enum.GetNames(typeof(CareOptionType));
            return Ok(careOptions);
        }

        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors(
    [FromQuery] int? userId,
    [FromQuery] string? firstName,
    [FromQuery] string? lastName,
    [FromQuery] string? email,
    [FromQuery] string? specialization,
    [FromQuery] string? dateOfBirth,
    [FromQuery] string? gender,
    [FromQuery] string? careOptions,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
        {
            var query = _context.Users
                .Include(u => u.DoctorProfile)
                    .ThenInclude(dp => dp.CareOptions)
                .Where(u => u.Role == "doctor" && u.DoctorProfile.Verified);

            if (userId.HasValue)
                query = query.Where(u => u.UserId == userId);

            if (!string.IsNullOrWhiteSpace(firstName))
                query = query.Where(u => u.FirstName.ToLower().Contains(firstName.ToLower()));
            if (!string.IsNullOrWhiteSpace(lastName))
                query = query.Where(u => u.LastName.ToLower().Contains(lastName.ToLower()));
            if (!string.IsNullOrWhiteSpace(email))
                query = query.Where(u => u.Email.ToLower().Contains(email.ToLower()));
            if (!string.IsNullOrWhiteSpace(specialization))
                query = query.Where(u => u.DoctorProfile.Specialization.ToLower().Contains(specialization.ToLower()));
            if (!string.IsNullOrWhiteSpace(gender))
                query = query.Where(u => u.Gender.ToLower() == gender.ToLower());
            if (!string.IsNullOrWhiteSpace(dateOfBirth) && DateTime.TryParse(dateOfBirth, out var dob))
                query = query.Where(u => u.DateOfBirth.HasValue && u.DateOfBirth.Value.Date == dob.Date);

            // Filter by careOptions if provided
            if (!string.IsNullOrWhiteSpace(careOptions))
            {
                var selectedOptions = careOptions
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(opt => Enum.TryParse<CareOptionType>(opt, out var parsed) ? (CareOptionType?)parsed : null)
                    .Where(opt => opt.HasValue)
                    .Select(opt => opt.Value)
                    .ToList();

                foreach (var option in selectedOptions)
                {
                    query = query.Where(u =>
                        u.DoctorProfile.CareOptions.Any(c => c.CareOption == option));
                }
            }

            var totalCount = await query.CountAsync();

            var doctors = await query
                .OrderBy(u => u.LastName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new
                {
                    u.UserId,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Gender,
                    u.DateOfBirth,
                    Specialization = u.DoctorProfile.Specialization,
                    CareOptions = u.DoctorProfile.CareOptions.Select(c => c.CareOption.ToString()).ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                data = doctors
            });
        }

        [HttpPut("doctor/{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorUpdateDto updatedData)
        {
            var user = await _context.Users
                .Include(u => u.DoctorProfile)
                    .ThenInclude(dp => dp.CareOptions)
                .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "doctor");

            if (user == null || user.DoctorProfile == null)
                return NotFound("Doctor not found");

            // Update user info
            user.Email = updatedData.Email ?? user.Email;
            user.FirstName = updatedData.FirstName ?? user.FirstName;
            user.LastName = updatedData.LastName ?? user.LastName;
            user.Gender = updatedData.Gender ?? user.Gender;
            user.DateOfBirth = updatedData.DateOfBirth ?? user.DateOfBirth;

            // Update doctor profile
            var profile = user.DoctorProfile;
            profile.Specialization = updatedData.Specialization ?? profile.Specialization;
            profile.Qualification = updatedData.Qualification ?? profile.Qualification;
            profile.ExperienceYears = updatedData.ExperienceYears ?? profile.ExperienceYears;

            // Update care options if provided
            if (updatedData.CareOptions != null)
            {
                // Clear existing ones
                profile.CareOptions.Clear();

                // Add updated ones
                foreach (var optionStr in updatedData.CareOptions)
                {
                    if (Enum.TryParse<CareOptionType>(optionStr, out var option))
                    {
                        profile.CareOptions.Add(new DoctorCareOption
                        {
                            DoctorProfileId = profile.DoctorProfileId,
                            CareOption = option
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok("Doctor updated successfully");
        }

        [HttpDelete("doctor/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var user = await _context.Users
                .Include(u => u.DoctorProfile)
                .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "doctor");

            if (user == null)
                return NotFound("Doctor not found");

            _context.Users.Remove(user); // EF will cascade delete DoctorProfile if configured
            await _context.SaveChangesAsync();
            return Ok("Doctor deleted successfully");
        }


    }

    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UpdatePatientRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Gender { get; set; }
        public string? DateOfBirth { get; set; }
    }

    public class DoctorUpdateDto
    {
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string? Specialization { get; set; }
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public List<string>? CareOptions { get; set; }
    }

}
