using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BackendOHCP.Data;
using BackendOHCP.Models;
using BackendOHCP.Models.Auth; // Thêm namespace này nếu để request model tại đây
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class VideoSessionController : ControllerBase
{
    private readonly AppDbContext _context;

    public VideoSessionController(AppDbContext context)
    {
        _context = context;
    }

    // Tạo video session khi appointment là "video"
    [Authorize]
    [HttpPost]
    public IActionResult Create([FromBody] CreateVideoSessionRequest req)
    {
        var appointmentId = req.AppointmentId;

        // Kiểm tra xem appointment này đã có VideoSession chưa
        if (_context.VideoSessions.Any(v => v.AppointmentId == appointmentId))
            return BadRequest(new { message = "Video session already exists." });

        var roomName = $"health-video-{appointmentId}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        var session = new VideoSession
        {
            AppointmentId = appointmentId,
            RoomName = roomName,
            StartedAt = null,
            EndedAt = null
        };

        _context.VideoSessions.Add(session);
        _context.SaveChanges();
        return Ok(session);
    }

    // Lấy roomName cho 1 appointment
    [Authorize]
    [HttpGet("appointment/{appointmentId}")]
    public IActionResult GetByAppointment(int appointmentId)
    {
        var session = _context.VideoSessions.FirstOrDefault(x => x.AppointmentId == appointmentId);
        if (session == null) return NotFound();
        return Ok(new { roomName = session.RoomName });
    }
}
