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
            // Kiểm tra nếu doctor và patient hợp lệ
            if (request.PatientId == 0 || request.DoctorId == 0)
                return BadRequest(new { message = "Patient and Doctor must be specified." });

            // Kiểm tra nếu thời gian đã được đặt
            var conflict = _context.Appointments.Any(a =>
                a.DoctorId == request.DoctorId &&
                a.AppointmentTime == request.AppointmentTime);

            if (conflict)
                return BadRequest(new { message = "Time slot not available." });

            // Tạo lịch hẹn mới
            var newAppointment = new Appointment
            {
                PatientId = request.PatientId,
                DoctorId = request.DoctorId,
                AppointmentTime = request.AppointmentTime,
                CareOption = request.CareOption,
                Mode = "Video",
                Status = "Scheduled", // Chế độ mặc định là scheduled
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(newAppointment);
            _context.SaveChanges();

            return Ok(newAppointment);
        }

        [Authorize(Roles = "patient")]
        [HttpGet("{userId}")]
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
                .Where(a => a.AppointmentTime.Date >= today && a.AppointmentTime.Date <= next7Days)
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
                .Where(a => a.AppointmentTime.Date < today)
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
        // DELETE: api/Appointments/{id}
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpDelete("{id}")]
        public IActionResult CancelAppointment(int id)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            _context.Appointments.Remove(appointment);
            _context.SaveChanges();

            return Ok(new { message = "Appointment canceled." });
        }


        // 5. (Nâng cao) Xem các slot trống của doctor theo ngày
        // GET: api/Appointments/doctor/{doctorId}/available-slots
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("doctor/{doctorId}/available-slots")]
        public IActionResult GetAvailableSlots(int doctorId, [FromQuery] DateTime date)
        {
            // Giả sử một ngày khám từ 8h đến 17h, mỗi slot 1 giờ
            var allSlots = Enumerable.Range(8, 10)
                .Select(h => new DateTime(date.Year, date.Month, date.Day, h, 0, 0))
                .ToList();

            var bookedSlots = _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentTime.Date == date.Date)
                .Select(a => a.AppointmentTime)
                .ToList();

            var availableSlots = allSlots
                .Where(slot => !bookedSlots.Any(booked => booked.Hour == slot.Hour))
                .ToList();

            return Ok(availableSlots);
        }

    }
}
