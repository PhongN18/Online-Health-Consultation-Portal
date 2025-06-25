namespace BackendOHCP.DTOs
{
    public class SendMessageRequest
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public int AppointmentId { get; set; } // Gắn với cuộc hẹn
    }
}
