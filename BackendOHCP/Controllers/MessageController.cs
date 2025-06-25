using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackendOHCP.Data;
using BackendOHCP.Models;
using BackendOHCP.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BackendOHCP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        // Gửi tin nhắn mới (bắt buộc phải gắn với 1 appointment có mode chat)
        [Authorize]
        [HttpPost]
        public IActionResult SendMessage([FromBody] SendMessageRequest req)
        {
            // Kiểm tra tồn tại appointment và mode phải là "chat"
            var appointment = _context.Appointments.FirstOrDefault(a => a.AppointmentId == req.AppointmentId);
            if (appointment == null || appointment.Mode != "chat")
                return BadRequest(new { message = "Invalid or non-chat appointment" });

            // Chỉ cho phép patient/doctor đúng của cuộc hẹn
            if (!(req.SenderId == appointment.PatientId || req.SenderId == appointment.DoctorId))
                return Forbid();

            var msg = new Message
            {
                SenderId = req.SenderId,
                ReceiverId = req.ReceiverId,
                Content = req.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false,
                AppointmentId = req.AppointmentId // Gắn vào để truy vấn theo từng cuộc chat
            };
            _context.Messages.Add(msg);
            _context.SaveChanges();
            return Ok(msg);
        }

        // Lấy toàn bộ tin nhắn của 1 appointment (chat theo từng lịch hẹn)
        [Authorize]
        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetMessagesByAppointment(int appointmentId)
        {
            var messages = await _context.Messages
                .Where(m => m.AppointmentId == appointmentId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
            return Ok(messages);
        }

        // Lấy lịch sử chat giữa 2 user (nếu muốn, có thể truyền thêm appointmentId để lọc theo cuộc hẹn)
        [Authorize]
        [HttpGet]
        public IActionResult GetMessages([FromQuery] int senderId, [FromQuery] int receiverId, [FromQuery] int? appointmentId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Messages
                .Where(m =>
                    ((m.SenderId == senderId && m.ReceiverId == receiverId) ||
                    (m.SenderId == receiverId && m.ReceiverId == senderId))
                );

            // Nếu có truyền appointmentId thì lọc theo cuộc hẹn đó
            if (appointmentId.HasValue)
            {
                query = query.Where(m => m.AppointmentId == appointmentId.Value);
            }

            query = query.OrderBy(m => m.SentAt);

            var total = query.Count();
            var messages = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { total, messages });
        }

        // Đánh dấu đã đọc
        [Authorize]
        [HttpPut("{id}/mark-read")]
        public IActionResult MarkAsRead(int id)
        {
            var msg = _context.Messages.Find(id);
            if (msg == null) return NotFound();

            msg.IsRead = true;
            _context.SaveChanges();
            return Ok(msg);
        }
    }
}
