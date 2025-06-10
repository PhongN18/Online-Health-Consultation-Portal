namespace BackendOHCP.Models
{
    public class MedicalRecordCreateRequest
    {
        public int PatientId { get; set; }
        public int? DoctorId { get; set; }
        public string RecordType { get; set; } = null!;
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
    }
}
