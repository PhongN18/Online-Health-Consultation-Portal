// Models/User.cs
using BackendOHCP.Models;

public class User
{
    public int    UserId       { get; set; }
    public string Email        { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Role         { get; set; } = null!;  // "patient","doctor","admin"
    public string? FirstName   { get; set; }
    public string? LastName    { get; set; }
    public DateTime CreatedAt  { get; set; } = DateTime.UtcNow;

    public DoctorProfile? DoctorProfile { get; set; }
    public ICollection<Appointment>? AppointmentsAsPatient { get; set; }
    public ICollection<Appointment>? AppointmentsAsDoctor  { get; set; }
    public ICollection<MedicalRecord>? MedicalRecords      { get; set; }
    public ICollection<AIDiagnostic>? AIDiagnostics        { get; set; }
}
