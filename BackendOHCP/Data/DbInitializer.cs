using Microsoft.AspNetCore.Identity;
using BackendOHCP.Models;

namespace BackendOHCP.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any()) return; // Already seeded

            var hasher = new PasswordHasher<User>();

            // Sample Users
            var admin = new User
            {
                Email = "admin@ohcp.com",
                Role = "admin",
                PasswordHash = hasher.HashPassword(null, "Admin@123"),
                FirstName = "System",
                LastName = "Administrator",
                Gender = "male",
                DateOfBirth = new DateTime(1990, 1, 1)
            };

            var patient = new User
            {
                Email = "patient@ohcp.com",
                Role = "patient",
                PasswordHash = hasher.HashPassword(null, "Patient@123"),
                FirstName = "Jane",
                LastName = "Doe",
                Gender = "female",
                DateOfBirth = new DateTime(1998, 5, 10)
            };

            var doctor1 = new User
            {
                Email = "doc1@ohcp.com",
                Role = "doctor",
                PasswordHash = hasher.HashPassword(null, "Doctor1@123"),
                FirstName = "John",
                LastName = "Nguyen",
                Gender = "male",
                DateOfBirth = new DateTime(1985, 7, 20)
            };

            var doctor2 = new User
            {
                Email = "doc2@ohcp.com",
                Role = "doctor",
                PasswordHash = hasher.HashPassword(null, "Doctor2@123"),
                FirstName = "Linh",
                LastName = "Tran",
                Gender = "female",
                DateOfBirth = new DateTime(1982, 3, 15)
            };

            context.Users.AddRange(admin, patient, doctor1, doctor2);
            context.SaveChanges(); // Save to get UserIds

            // Add DoctorProfiles
            var profiles = new List<DoctorProfile>
            {
                new DoctorProfile
                {
                    UserId = doctor1.UserId,
                    Specialization = "Cardiology",
                    Qualification = "MD, PhD",
                    ExperienceYears = 10,
                    Rating = 4.7m
                },
                new DoctorProfile
                {
                    UserId = doctor2.UserId,
                    Specialization = "Dermatology",
                    Qualification = "MD",
                    ExperienceYears = 8,
                    Rating = 4.9m
                }
            };

            context.DoctorProfiles.AddRange(profiles);
            context.SaveChanges();
        }
    }
}
