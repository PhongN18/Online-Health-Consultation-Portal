public class VideoSession
{
    public int VideoSessionId { get; set; }
    public int AppointmentId { get; set; }
    public string RoomName { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
}
