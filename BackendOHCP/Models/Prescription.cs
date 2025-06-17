using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendOHCP.Models
{
    public class Prescription
    {
        [Key]
        public int PrescriptionId { get; set; }

        [ForeignKey("Appointment")]
        public int AppointmentId { get; set; }

        [ForeignKey("Doctor")]
        public int DoctorId { get; set; }

        [ForeignKey("Patient")]
        public int PatientId { get; set; }

        [Required]
        public string Medications { get; set; } = null!; // Lưu JSON chuỗi các thuốc

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual Appointment Appointment { get; set; } = null!;
        public virtual User Doctor { get; set; } = null!;
        public virtual User Patient { get; set; } = null!;
    }
}
