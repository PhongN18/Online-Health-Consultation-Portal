namespace BackendOHCP.Models
{
    public class DoctorProfile
    {
        public int DoctorProfileId { get; set; }
        public int UserId { get; set; }
        public string Specialization { get; set; } = null!;
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public decimal? Rating { get; set; }

        public User? User { get; set; }
        public ICollection<DoctorCareOption> CareOptions { get; set; } = new List<DoctorCareOption>();

    }
}