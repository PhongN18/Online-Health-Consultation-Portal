using Microsoft.AspNetCore.SignalR;
using BackendOHCP.Data;
using BackendOHCP.Models;
using Microsoft.AspNetCore.Authorization;
namespace BackendOHCP.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IServiceProvider _serviceProvider;
    private readonly AppDbContext _context;
    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    private static readonly Dictionary<int, HashSet<int>> VideoJoinStatus = new();

    public async Task JoinVideoCall(int appointmentId, int userId)
    {
        if (!VideoJoinStatus.ContainsKey(appointmentId))
            VideoJoinStatus[appointmentId] = new HashSet<int>();

        VideoJoinStatus[appointmentId].Add(userId);
        await Groups.AddToGroupAsync(Context.ConnectionId, $"appointment-{appointmentId}");

        // Notify the other user
        await Clients.OthersInGroup($"appointment-{appointmentId}")
            .SendAsync("PartnerJoinedCall");

        // If both joined, mark as completed
        if (VideoJoinStatus[appointmentId].Count >= 2)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var appt = await db.Appointments.FindAsync(appointmentId);
                if (appt != null)
                {
                    appt.Status = "Completed";
                    await db.SaveChangesAsync();
                }
            }

            await Clients.Group($"appointment-{appointmentId}")
                .SendAsync("AppointmentEnded");

            VideoJoinStatus.Remove(appointmentId);
        }
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

    public async Task JoinAppointmentGroup(int appointmentId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"appointment-{appointmentId}");
    }

    private static readonly Dictionary<int, HashSet<string>> EndConfirmations = new();

    public async Task ConfirmEnd(int appointmentId, int userId)
    {
        if (!EndConfirmations.ContainsKey(appointmentId))
            EndConfirmations[appointmentId] = new HashSet<string>();

        EndConfirmations[appointmentId].Add(Context.ConnectionId);

        var group = EndConfirmations[appointmentId];
        if (group.Count >= 2) // Both confirmed
        {
            // update database to mark appointment as completed
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var appt = await context.Appointments.FindAsync(appointmentId);
                if (appt != null)
                {
                    appt.Status = "Completed";
                    await context.SaveChangesAsync();
                }
            }

            await Clients.Group($"appointment-{appointmentId}").SendAsync("AppointmentEnded");
            EndConfirmations.Remove(appointmentId);
        }
        else
        {
            await Clients.OthersInGroup($"appointment-{appointmentId}").SendAsync("PartnerConfirmedEnd");
        }
    }
}
