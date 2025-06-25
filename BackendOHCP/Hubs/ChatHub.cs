using Microsoft.AspNetCore.SignalR;
using BackendOHCP.Data;
using BackendOHCP.Models;
using Microsoft.AspNetCore.Authorization;
namespace BackendOHCP.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly AppDbContext _context;
    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    // Gửi tin nhắn realtime + lưu vào DB
    public async Task SendMessage(int senderId, int receiverId, string content, int appointmentId)
    {
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Content = content,
            SentAt = DateTime.UtcNow,
            IsRead = false,
            AppointmentId = appointmentId
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        await Clients.User(receiverId.ToString()).SendAsync(
            "ReceiveMessage",
            new
            {
                message.MessageId,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.SentAt,
                message.AppointmentId
            }
        );
        await Clients.User(senderId.ToString()).SendAsync(
            "ReceiveMessage",
            new
            {
                message.MessageId,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.SentAt,
                message.AppointmentId
            }
        );
    }


    // Kết nối: map ConnectionId với UserId (dùng Claim)
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("userId")?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
        await base.OnConnectedAsync();
    }
}
