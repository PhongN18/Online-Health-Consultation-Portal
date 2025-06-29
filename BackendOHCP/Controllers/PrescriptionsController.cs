using System.Net.Http.Json;
using System.Text.Json.Serialization;
using BackendOHCP.Data;
using BackendOHCP.Models;
using BackendOHCP.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;



namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PrescriptionsController(AppDbContext context) => _context = context;

        // POST: api/prescriptions
        [Authorize(Roles = "doctor")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PrescriptionRequest req)
        {
            // Optionally: kiểm tra trùng appointment và quyền doctor
            var appointment = await _context.Appointments.FindAsync(req.AppointmentId);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            // Cho phép tạo khi status scheduled hoặc completed đều hợp lệ
            var prescription = new Prescription
            {
                AppointmentId = req.AppointmentId,
                DoctorId = req.DoctorId,
                PatientId = req.PatientId,
                Medications = JsonConvert.SerializeObject(req.Medications),
                Notes = req.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();
            return Ok(new { prescriptionId = prescription.PrescriptionId });
        }

        // GET: api/prescriptions?patientId={id}
        [Authorize(Roles = "doctor,patient")]
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int? patientId, [FromQuery] int? doctorId)
        {
            IQueryable<Prescription> query = _context.Prescriptions;

            if (patientId.HasValue)
                query = query.Where(p => p.PatientId == patientId);
            if (doctorId.HasValue)
                query = query.Where(p => p.DoctorId == doctorId);

            var list = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
            return Ok(list);
        }

        // GET: api/prescriptions/{id}
        [Authorize(Roles = "doctor,patient")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            return Ok(prescription);
        }

        // PUT: api/prescriptions/{id}
        [Authorize(Roles = "doctor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PrescriptionUpdateRequest req)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();

            // Giới hạn thời gian sửa, vd 1h sau khi tạo
            if ((DateTime.UtcNow - prescription.CreatedAt).TotalHours > 1)
                return BadRequest(new { message = "Cannot edit prescription after 1 hour." });

            prescription.Medications = JsonConvert.SerializeObject(req.Medications);

            prescription.Notes = req.Notes;

            _context.Prescriptions.Update(prescription);
            await _context.SaveChangesAsync();
            return Ok(prescription);
        }

        // DELETE: api/prescriptions/{id}
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }

        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var prescriptions = await _context.Prescriptions
                .Where(p => p.AppointmentId == appointmentId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(prescriptions);
        }
    }
}
