public class Appointment
{
    public int AppointmentId { get; set; }
    public int PatientId { get; set; }
    public int DoctorId { get; set; }
    public DateTime AppointmentTime { get; set; }
    public string Mode { get; set; } = null!; // "video","audio","chat"
    public string CareOption { get; set; } = null!;
    public string Status { get; set; } = "Scheduled";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string? CancelReason { get; set; }
    public User Patient { get; set; } = null!;
    public User Doctor { get; set; } = null!;
    public VideoSession? VideoSession { get; set; }
}