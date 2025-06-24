using System;

namespace BackendOHCP.Models
{
    // DTO (Data Transfer Object) cho việc tạo hoặc cập nhật lịch hẹn
    public class AppointmentRequest
    {
        // ID của bệnh nhân (Không bắt buộc)
        public int PatientId { get; set; }

        // ID của bác sĩ (Không bắt buộc)
        public int DoctorId { get; set; }

        // Thời gian hẹn (Không bắt buộc)
        public DateTime AppointmentTime { get; set; }

        // Chế độ hẹn (video, audio, chat...) (Không bắt buộc)
        public string Mode { get; set; } = string.Empty;  // Mặc định là string rỗng
        public string CareOption { get; set; } = "Primary Care";
        public string? CancelReason { get; set; } = string.Empty;
    }
}
