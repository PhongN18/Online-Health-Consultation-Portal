using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendOHCP.Data;
using BackendOHCP.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Patient đặt lịch hẹn mới
        // POST: api/Appointments
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpPost]
        public IActionResult CreateAppointment([FromBody] AppointmentRequest request)
        {
            // 1. Validate patient & doctor
            if (request.PatientId == 0 || request.DoctorId == 0)
                return BadRequest(new { message = "Patient and Doctor must be specified." });

            // 2. Check time slot conflict for doctor
            bool conflict = _context.Appointments.Any(a =>
                a.DoctorId == request.DoctorId &&
                a.AppointmentTime == request.AppointmentTime);
            if (conflict)
                return BadRequest(new { message = "Time slot not available." });

            // 3. Create new Appointment
            var newAppointment = new Appointment
            {
                PatientId       = request.PatientId,
                DoctorId        = request.DoctorId,
                AppointmentTime = request.AppointmentTime,
                CareOption      = request.CareOption,
                Mode            = "Video",      // e.g. "Video" or "Chat"
                Status          = "Scheduled",
                CreatedAt       = DateTime.UtcNow
            };

            _context.Appointments.Add(newAppointment);
            _context.SaveChanges();  // cần save để EF gán AppointmentId

            // 4. Nếu là video, tạo luôn VideoSession record
            if (newAppointment.Mode.Equals("Video", StringComparison.OrdinalIgnoreCase))
            {
                var session = new VideoSession
                {
                    AppointmentId = newAppointment.AppointmentId,
                    RoomName      = $"room-{newAppointment.AppointmentId}-{Guid.NewGuid():N}".Substring(0, 16),
                    StartedAt     = null,
                    EndedAt       = null
                };
                _context.VideoSessions.Add(session);
                _context.SaveChanges();
            }

            // 5. Trả về appointment (và bạn có thể include VideoSession nếu muốn)
            return Ok(newAppointment);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("member/{userId}")]
        public IActionResult GetPatientAppointments(int userId)
        {
            // Load appointments where the logged-in user is the patient
            var appointments = _context.Appointments
                .Where(a => a.Patient.UserId == userId)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.DoctorProfile)
                .OrderBy(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.Status,
                    a.CreatedAt,
                    Doctor = new
                    {
                        a.Doctor.UserId,
                        FullName = a.Doctor.FirstName + " " + a.Doctor.LastName,
                        a.Doctor.Email,
                        a.Doctor.DoctorProfile.Specialization,
                        a.Doctor.DoctorProfile.Qualification,
                        a.Doctor.DoctorProfile.ExperienceYears,
                        a.Doctor.DoctorProfile.Rating
                    }
                })
                .ToList();

            return Ok(appointments);
        }

        [Authorize(Roles = "patient, doctor, admin")]
        [HttpGet("doctor/{doctorId}")]
        public IActionResult GetDoctorAppointments(int doctorId)
        {
            if (doctorId <= 0)
                return BadRequest(new { message = "Invalid or missing doctorId." });

            var now = DateTime.UtcNow;
            var today = now.Date;
            var next7Days = today.AddDays(7);

            var allAppointments = _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .Include(a => a.Patient)
                .ToList();

            var upcoming = allAppointments
                .Where(a =>
                    a.AppointmentTime.Date >= today &&
                    a.AppointmentTime.Date <= next7Days &&
                    a.Status == "Scheduled") // ✅ only Scheduled appointments
                .OrderBy(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.Status,
                    a.CreatedAt,
                    Patient = new
                    {
                        a.Patient.UserId,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName,
                        a.Patient.Email,
                        a.Patient.Gender,
                        a.Patient.DateOfBirth
                    }
                })
                .ToList();

            var past = allAppointments
                .Where(a =>
                    a.AppointmentTime.Date < today || a.Status != "Scheduled") // ✅ any status not Scheduled or earlier than today
                .OrderByDescending(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.Status,
                    a.CreatedAt,
                    Patient = new
                    {
                        a.Patient.UserId,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName,
                        a.Patient.Email,
                        a.Patient.Gender,
                        a.Patient.DateOfBirth
                    }
                })
                .ToList();

            var all = allAppointments
                .OrderBy(a => a.AppointmentTime)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.Status,
                    a.CreatedAt,
                    Patient = new
                    {
                        a.Patient.UserId,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName,
                        a.Patient.Email,
                        a.Patient.Gender,
                        a.Patient.DateOfBirth
                    }
                })
                .ToList();

            return Ok(new
            {
                all,
                upcoming,
                past
            });
        }

        // 3. Bệnh nhân/doctor reschedule (đổi lịch)
        // PUT: api/Appointments/{id}
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpPut("{id}")]
        public IActionResult RescheduleAppointment(int id, [FromBody] DateTime newTime)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            // Kiểm tra nếu doctorId và patientId hợp lệ
            if (appointment.DoctorId == 0 || appointment.PatientId == 0)
            {
                return BadRequest(new { message = "DoctorId and PatientId are required." });
            }

            // Kiểm tra slot trống cho doctor
            var conflict = _context.Appointments.Any(a =>
                a.DoctorId == appointment.DoctorId &&
                a.AppointmentTime == newTime &&
                a.AppointmentId != id); // Tránh check lại chính nó

            if (conflict)
                return BadRequest(new { message = "Time slot not available." });

            // Cập nhật thời gian của lịch hẹn
            appointment.AppointmentTime = newTime;
            _context.SaveChanges();

            return Ok(appointment);
        }


        // 4. Bệnh nhân/doctor/admin hủy lịch
        // PUT: api/Appointments/{id}/cancel
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpPut("{id}/cancel")]
        public IActionResult CancelAppointment(int id, [FromBody] CancelRequest req)
        {
            var appointment = _context.Appointments.FirstOrDefault(a => a.AppointmentId == id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            // Update appointment instead of deleting
            appointment.Status = "Cancelled";
            appointment.CancelReason = req.Reason ?? "Cancelled by user";
            _context.SaveChanges();

            return Ok(new { message = "Appointment status updated to Cancelled." });
        }

        // DTO class
        public class CancelRequest
        {
            public string Reason { get; set; }
        }

        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{id}")]
        public IActionResult GetAppointmentById(int id)
        {
            var appt = _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.AppointmentId == id)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.AppointmentTime,
                    a.Mode,
                    a.CareOption,
                    a.Status,
                    a.CreatedAt,
                    Patient = new
                    {
                        a.Patient.UserId,
                        FullName = a.Patient.FirstName + " " + a.Patient.LastName,
                        a.Patient.Email,
                        a.Patient.Gender,
                        a.Patient.DateOfBirth
                    }
                })
                .FirstOrDefault();

            if (appt == null)
                return NotFound(new { message = "Appointment not found." });

            return Ok(appt);
        }
        
        [HttpGet("{id}/details")]
        public IActionResult GetAppointment(int id)
        {
            var appointment = _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)         // include thêm Patient
                .FirstOrDefault(a => a.AppointmentId == id);

            if (appointment == null)
                return NotFound();

            return Ok(new {
                appointment.AppointmentId,
                appointment.Mode,
                appointment.PatientId,
                appointment.DoctorId,
                Doctor = appointment.Doctor == null
                    ? null
                    : new {
                        appointment.Doctor.UserId,
                        appointment.Doctor.FirstName,
                        appointment.Doctor.LastName
                    },
                Patient = appointment.Patient == null
                    ? null
                    : new {
                        appointment.Patient.UserId,
                        appointment.Patient.FirstName,
                        appointment.Patient.LastName
                    }
            });
        }

    }
}
