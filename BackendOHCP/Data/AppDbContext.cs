using BackendOHCP.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendOHCP.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }

        public DbSet<User>           Users           => Set<User>();
        public DbSet<DoctorProfile>  DoctorProfiles  => Set<DoctorProfile>();
        public DbSet<Appointment>    Appointments    => Set<Appointment>();
        public DbSet<MedicalRecord>  MedicalRecords  => Set<MedicalRecord>();
        public DbSet<AIDiagnostic>   AIDiagnostics   => Set<AIDiagnostic>();
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Message> Messages { get; set; }

        public DbSet<VideoSession> VideoSessions { get; set; }


    protected override void OnModelCreating(ModelBuilder mb)
    {
      base.OnModelCreating(mb);

       // 1-to-1: Appointment ⟷ VideoSession
      mb.Entity<VideoSession>()
      .HasOne(vs => vs.Appointment)
      .WithOne(a => a.VideoSession)
      .HasForeignKey<VideoSession>(vs => vs.AppointmentId)
      .OnDelete(DeleteBehavior.Cascade);

      // Cấu hình Unique index cho Email
      mb.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();

      // Cấu hình quan hệ giữa DoctorProfile và User (1:1)
      mb.Entity<DoctorProfile>()
        .HasOne(dp => dp.User)
        .WithOne(u => u.DoctorProfile)
        .HasForeignKey<DoctorProfile>(dp => dp.UserId);

      // Cấu hình quan hệ giữa Appointment và User (1:N)
      mb.Entity<Appointment>()
        .HasOne(a => a.Patient)
        .WithMany(u => u.AppointmentsAsPatient)
        .HasForeignKey(a => a.PatientId);

      mb.Entity<Appointment>()
        .HasOne(a => a.Doctor)
        .WithMany(u => u.AppointmentsAsDoctor)
        .HasForeignKey(a => a.DoctorId);

      mb.Entity<Appointment>()
        .HasIndex(a => new { a.DoctorId, a.AppointmentTime });

      // Cấu hình khóa chính cho MedicalRecord
      mb.Entity<MedicalRecord>()
        .HasKey(mr => mr.RecordId);  // Đảm bảo RecordId là khóa chính

      // MedicalRecord - Patient (always required)
      mb.Entity<MedicalRecord>()
        .HasOne(m => m.Patient)
        .WithMany(u => u.MedicalRecords)
        .HasForeignKey(m => m.PatientId)
        .OnDelete(DeleteBehavior.Cascade);

      // MedicalRecord - Doctor (nullable)
      mb.Entity<MedicalRecord>()
        .HasOne(m => m.Doctor)
        .WithMany()
        .HasForeignKey(m => m.DoctorId)
        .OnDelete(DeleteBehavior.SetNull); // Nếu bác sĩ bị xóa thì DoctorId set null

      // Cấu hình quan hệ giữa AIDiagnostic và User (Patient)
      mb.Entity<AIDiagnostic>()
        .HasOne(d => d.Patient)  // Mỗi AIDiagnostic có một Patient
        .WithMany(u => u.AIDiagnostics)  // Một Patient có thể có nhiều AIDiagnostics
        .HasForeignKey(d => d.PatientId)  // Khóa ngoại cho PatientId
        .OnDelete(DeleteBehavior.Cascade);  // Xóa AIDiagnostics khi Patient bị xóa (nếu cần)

      // Nếu cần, bạn có thể thêm cấu hình khóa chính tại đây, nhưng Entity Framework Core sẽ tự động sử dụng 'DiagId' là khóa chính
      mb.Entity<AIDiagnostic>()
        .HasKey(d => d.DiagId);  // Đảm bảo rằng 'DiagId' là khóa chính của AIDiagnostic

      mb.Entity<Prescription>(p =>
      {
        p.HasOne(x => x.Doctor).WithMany().HasForeignKey(x => x.DoctorId).OnDelete(DeleteBehavior.Restrict);
        p.HasOne(x => x.Patient).WithMany().HasForeignKey(x => x.PatientId).OnDelete(DeleteBehavior.Restrict);
        p.HasOne(x => x.Appointment).WithMany().HasForeignKey(x => x.AppointmentId).OnDelete(DeleteBehavior.Restrict);
      });
    }
    }
}
