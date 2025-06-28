using Microsoft.AspNetCore.Identity;
using BackendOHCP.Models;
using System;
using System.Linq;

namespace BackendOHCP.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any()) return; // Already seeded

            var hasher = new PasswordHasher<User>();
            var rnd = new Random();

            // Seed Admin + Patient
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

            context.Users.AddRange(admin, patient);
            context.SaveChanges();

            // Generate 50 doctors
            var careOptions = Enum.GetValues(typeof(CareOptionType)).Cast<CareOptionType>().ToList();
            var doctorUsers = new List<User>();
            var doctorProfiles = new List<DoctorProfile>();
            var doctorCareOptions = new List<DoctorCareOption>();

            for (int i = 1; i <= 50; i++)
            {
                var doctor = new User
                {
                    Email = $"doctor{i}@ohcp.com",
                    Role = "doctor",
                    PasswordHash = hasher.HashPassword(null, $"Doctor{i}@123"),
                    FirstName = $"Doctor{i}",
                    LastName = $"Lastname{i}",
                    Gender = i % 2 == 0 ? "male" : "female",
                    DateOfBirth = new DateTime(1980 + (i % 20), (i % 12) + 1, (i % 28) + 1),
                    CreatedAt = DateTime.UtcNow.AddDays(-i)
                };

                doctorUsers.Add(doctor);
            }

            context.Users.AddRange(doctorUsers);
            context.SaveChanges(); // To get UserIds

            foreach (var doctor in doctorUsers)
            {
                var profile = new DoctorProfile
                {
                    UserId = doctor.UserId,
                    Specialization = $"Specialty {rnd.Next(1, 10)}",
                    Qualification = "MD",
                    ExperienceYears = rnd.Next(3, 20),
                    Rating = Math.Round((decimal)(rnd.NextDouble() * 2 + 3), 1) // Between 3.0 and 5.0
                };

                doctorProfiles.Add(profile);
            }

            context.DoctorProfiles.AddRange(doctorProfiles);
            context.SaveChanges(); // Save to get DoctorProfileIds

            // Assign random care options
            foreach (var profile in doctorProfiles)
            {
                var numOptions = rnd.Next(1, 5); // 1 to 4 care options
                var shuffled = careOptions.OrderBy(_ => rnd.Next()).Take(numOptions).ToList();

                foreach (var option in shuffled)
                {
                    doctorCareOptions.Add(new DoctorCareOption
                    {
                        DoctorProfileId = profile.DoctorProfileId,
                        CareOption = option
                    });
                }
            }

            context.DoctorCareOptions.AddRange(doctorCareOptions);
            context.SaveChanges();
        }
    }
}
