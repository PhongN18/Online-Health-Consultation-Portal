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
        private readonly IWebHostEnvironment _env;
        public MedicalRecordsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // 1. Lấy danh sách bệnh án (theo patientId hoặc doctorId)
        [Authorize(Roles = "admin,doctor,patient")]
        [HttpGet]
        public IActionResult GetRecords([FromQuery] int? patientId, [FromQuery] int? doctorId)
        {
            var query = _context.MedicalRecords.AsQueryable();

            if (patientId != null)
                query = query.Where(r => r.PatientId == patientId);
            if (doctorId != null)
                query = query.Where(r => r.DoctorId == doctorId);

            var records = query.OrderByDescending(r => r.CreatedAt).ToList();
            return Ok(records);
        }

        // 2. Thêm bệnh án mới (POST - có thể kèm upload file)
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        [RequestSizeLimit(10_000_000)] // Giới hạn 10MB
        public async Task<IActionResult> Create([FromForm] MedicalRecordCreateRequest req)
        {
            string filePath = "";
            if (req.File != null)
            {
                var uploads = Path.Combine(_env.ContentRootPath, "UploadedRecords");
                if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

                var fileName = $"{Guid.NewGuid()}_{req.File.FileName}";
                filePath = Path.Combine("UploadedRecords", fileName);
                var fullPath = Path.Combine(_env.ContentRootPath, filePath);
                using (var stream = System.IO.File.Create(fullPath))
                {
                    await req.File.CopyToAsync(stream);
                }
            }

            var record = new MedicalRecord
            {
                PatientId = req.PatientId,
                DoctorId = req.DoctorId,
                AppointmentId = req.AppointmentId,
                RecordType = req.RecordType,
                FilePath = filePath,
                Description = req.Description,
                CreatedAt = DateTime.UtcNow
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(record);
        }

        // 3. Cập nhật thông tin bệnh án (PUT)
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] MedicalRecord updated)
        {
            var record = _context.MedicalRecords.Find(id);
            if (record == null) return NotFound();

            record.RecordType = updated.RecordType;
            record.Description = updated.Description ?? record.Description;
            _context.SaveChanges();
            return Ok(record);
        }

        // 4. Xoá bệnh án (DELETE)
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var record = _context.MedicalRecords.Find(id);
            if (record == null) return NotFound();

            // Xoá file vật lý nếu có
            if (!string.IsNullOrEmpty(record.FilePath))
            {
                var filePath = Path.Combine(_env.ContentRootPath, record.FilePath);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.MedicalRecords.Remove(record);
            _context.SaveChanges();
            return Ok(new { message = "Deleted" });
        }

        // 5. Download file bệnh án
        [Authorize(Roles = "admin,doctor,patient")]
        [HttpGet("{id}/download")]
        public IActionResult DownloadFile(int id)
        {
            var record = _context.MedicalRecords.Find(id);
            if (record == null || string.IsNullOrEmpty(record.FilePath))
                return NotFound(new { message = "File not found" });

            var fullPath = Path.Combine(_env.ContentRootPath, record.FilePath);
            if (!System.IO.File.Exists(fullPath))
                return NotFound(new { message = "File not found on server" });

            var contentType = "application/octet-stream";
            var fileName = Path.GetFileName(record.FilePath);
            var fileBytes = System.IO.File.ReadAllBytes(fullPath);

            return File(fileBytes, contentType, fileName);
        }
    }
}
