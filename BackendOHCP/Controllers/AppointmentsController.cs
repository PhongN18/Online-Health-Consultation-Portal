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
        [Authorize(Roles = "patient,admin")]
        [HttpPost]
        public IActionResult CreateAppointment([FromBody] Appointment newAppointment)
        {
            // Kiểm tra slot đã bị book chưa (cùng doctor, cùng appointmentTime)
            var conflict = _context.Appointments.Any(a =>
                a.DoctorId == newAppointment.DoctorId &&
                a.AppointmentTime == newAppointment.AppointmentTime);

            if (conflict)
                return BadRequest(new { message = "Time slot not available." });

            newAppointment.Status = "scheduled";
            newAppointment.CreatedAt = DateTime.UtcNow;

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
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpPut("{id}")]
        public IActionResult RescheduleAppointment(int id, [FromBody] DateTime newTime)
        {
            var appointment = _context.Appointments.Find(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            // Kiểm tra slot trống cho doctor
            var conflict = _context.Appointments.Any(a =>
                a.DoctorId == appointment.DoctorId &&
                a.AppointmentTime == newTime &&
                a.AppointmentId != id);

            if (conflict)
                return BadRequest(new { message = "Time slot not available." });

            appointment.AppointmentTime = newTime;
            _context.SaveChanges();

            return Ok(appointment);
        }

        // 4. Bệnh nhân/doctor/admin hủy lịch
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
