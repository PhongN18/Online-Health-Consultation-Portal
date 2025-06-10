namespace BackendOHCP.Models;

public class MedicalRecord
{
    public int RecordId { get; set; }           // Khóa chính (Primary Key)

    public int PatientId { get; set; }          // Khóa ngoại tới User (Patient)
    public int? DoctorId { get; set; }           // Khóa ngoại tới User (Doctor)

    public string RecordType { get; set; } = ""; // VD: "visit_summary", ...
    public string FilePath { get; set; } = "";   // Đường dẫn file bệnh án (nếu có)
    public string? Description { get; set; }     // Mô tả thêm (tùy chọn)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quan hệ với bảng User (Bệnh nhân và Bác sĩ)
    public User Patient { get; set; } = null!;
    public User? Doctor { get; set; }  
}
