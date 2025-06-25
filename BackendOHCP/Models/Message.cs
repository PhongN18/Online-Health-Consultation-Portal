// Models/Message.cs
public class Message
{
    public int AppointmentId { get; set; }
    public Appointment Appointment { get; set; }
    public int MessageId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Content { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;

    public User Sender { get; set; }
    public User Receiver { get; set; }
}
