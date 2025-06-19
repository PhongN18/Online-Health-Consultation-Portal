using Microsoft.AspNetCore.SignalR;
using BackendOHCP.Data;
using BackendOHCP.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
public class ChatHub : Hub
{
    private readonly AppDbContext _context;
    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    // Gửi tin nhắn realtime + lưu vào DB
    public async Task SendMessage(int senderId, int receiverId, string content)
    {
        // 1. Lưu vào DB
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Content = content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // 2. Gửi tới receiver (theo UserId)
        await Clients.User(receiverId.ToString()).SendAsync(
            "ReceiveMessage",
            new
            {
                message.MessageId,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.SentAt
            }
        );

        // 3. (Optional) Gửi lại chính sender để cập nhật UI
        await Clients.User(senderId.ToString()).SendAsync(
            "ReceiveMessage",
            new
            {
                message.MessageId,
                message.SenderId,
                message.ReceiverId,
                message.Content,
                message.SentAt
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
