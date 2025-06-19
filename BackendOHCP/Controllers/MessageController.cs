using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackendOHCP.Data;
using BackendOHCP.Models;
using System.Linq;
using BackendOHCP.Models.DTOs;

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

        // Gửi tin nhắn mới
        [Authorize]
        [HttpPost]
        public IActionResult SendMessage([FromBody] SendMessageRequest req)
        {
            var msg = new Message
            {
                SenderId = req.SenderId,
                ReceiverId = req.ReceiverId,
                Content = req.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };
            _context.Messages.Add(msg);
            _context.SaveChanges();
            return Ok(msg);
        }



        // Lấy lịch sử chat giữa 2 user (có phân trang)
        [Authorize]
        [HttpGet]
        public IActionResult GetMessages([FromQuery] int senderId, [FromQuery] int receiverId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Messages
                .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) ||
                            (m.SenderId == receiverId && m.ReceiverId == senderId))
                .OrderBy(m => m.SentAt);

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
