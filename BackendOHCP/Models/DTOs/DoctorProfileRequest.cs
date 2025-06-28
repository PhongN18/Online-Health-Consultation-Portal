using BackendOHCP.Models;

public class DoctorProfileRequest
{
    public int UserId { get; set; }
    public string Specialization { get; set; } = null!;
    public string? Qualification { get; set; }
    public int? ExperienceYears { get; set; }

    public List<CareOptionType> CareOptions { get; set; } = new();
}
