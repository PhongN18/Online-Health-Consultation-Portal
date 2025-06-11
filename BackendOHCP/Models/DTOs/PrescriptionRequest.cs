using System.Collections.Generic;

namespace BackendOHCP.Models.DTOs
{
    public class MedicationItem
    {
        public string Name { get; set; } = "";
        public string Dosage { get; set; } = "";
        public string Frequency { get; set; } = "";
    }

    public class PrescriptionRequest
    {
        public int AppointmentId { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public List<MedicationItem> Medications { get; set; } = new();
        public string? Notes { get; set; }
    }

    public class PrescriptionUpdateRequest
    {
        public List<MedicationItem> Medications { get; set; } = new();
        public string? Notes { get; set; }
    }

        public class SendMessageRequest
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
    }

}
