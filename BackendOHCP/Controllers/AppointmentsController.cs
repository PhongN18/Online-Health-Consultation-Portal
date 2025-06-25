using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendOHCP.Data;
using BackendOHCP.Models;

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
                Mode = request.Mode,
                Status = "scheduled", // Chế độ mặc định là scheduled
                CreatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(newAppointment);
            _context.SaveChanges();

            return Ok(newAppointment);
        }

        // 2. Bác sĩ hoặc admin xem lịch hẹn của mình (hoặc toàn bộ)
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public IActionResult GetAppointments([FromQuery] int? doctorId, [FromQuery] int? patientId)
        {
            IQueryable<Appointment> query = _context.Appointments;

            // Admin có thể xem hết, doctor chỉ xem của mình
            if (User.IsInRole("doctor"))
            {
                // Lấy doctorId từ User.Claims nếu có logic xác thực nâng cao
                if (doctorId == null) return BadRequest(new { message = "Missing doctorId." });
                query = query.Where(a => a.DoctorId == doctorId.Value);
            }
            else if (User.IsInRole("admin"))
            {
                if (doctorId != null)
                    query = query.Where(a => a.DoctorId == doctorId.Value);
                if (patientId != null)
                    query = query.Where(a => a.PatientId == patientId.Value);
            }

            var appointments = query
                .OrderBy(a => a.AppointmentTime)
                .ToList();

            return Ok(appointments);
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
        
        [HttpGet("{id}")]
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
