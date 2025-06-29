//quản lý bệnh án
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendOHCP.Data;
using BackendOHCP.Models;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicalRecordsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMedicalRecord([FromBody] MedicalRecordCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Optional: Validate referenced entities
            var patient = await _context.Users.FindAsync(request.PatientId);
            if (patient == null || patient.Role != "patient")
                return BadRequest("Invalid patient ID");

            if (request.DoctorId.HasValue)
            {
                var doctor = await _context.Users.FindAsync(request.DoctorId.Value);
                if (doctor == null || doctor.Role != "doctor")
                    return BadRequest("Invalid doctor ID");
            }

            if (request.AppointmentId.HasValue)
            {
                var appointment = await _context.Appointments.FindAsync(request.AppointmentId.Value);
                if (appointment == null)
                    return BadRequest("Invalid appointment ID");
            }

            var record = new MedicalRecord
            {
                AppointmentId = request.AppointmentId,
                PatientId = request.PatientId,
                DoctorId = request.DoctorId,
                RecordType = request.RecordType,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medical record created successfully" });
        }


        [Authorize(Roles = "patient")]
        [HttpGet("member/{userId}")]
        public async Task<IActionResult> GetMedicalRecordsForMember(int userId)
        {
            var records = await _context.MedicalRecords
                .Where(r => r.PatientId == userId)
                .Include(r => r.Doctor)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.RecordId,
                    r.RecordType,
                    r.Description,
                    r.CreatedAt,
                    DoctorName = r.Doctor != null
                        ? r.Doctor.FirstName + " " + r.Doctor.LastName
                        : "Unknown"
                })
                .ToListAsync();

            return Ok(records);
        }

        [Authorize(Roles = "doctor")]
        [HttpGet("provider/{doctorId}")]
        public async Task<IActionResult> GetRecordsByProvider(int doctorId)
        {
            var records = await _context.MedicalRecords
                .Where(m => m.DoctorId == doctorId)
                .Include(m => m.Patient)
                .Select(m => new
                {
                    m.RecordId,
                    m.RecordType,
                    m.Description,
                    m.CreatedAt,
                    PatientName = m.Patient.FirstName + " " + m.Patient.LastName
                })
                .ToListAsync();

            return Ok(records);
        }

        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var records = await _context.MedicalRecords
                .Where(r => r.AppointmentId == appointmentId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(records);
        }

    }
}
