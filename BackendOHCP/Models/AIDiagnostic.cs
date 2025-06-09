namespace BackendOHCP.Models;

public class AIDiagnostic
{
    public int DiagId { get; set; } // Đây là khóa chính
    public int PatientId { get; set; } // Khóa ngoại tới User (Patient)
    public string SymptomText { get; set; } = null!;
    public string Source { get; set; } = "infermedica"; // Nguồn AI (mặc định)
    public string DiagnosisJson { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User Patient { get; set; } = null!;  // Quan hệ với User (Patient)
}
