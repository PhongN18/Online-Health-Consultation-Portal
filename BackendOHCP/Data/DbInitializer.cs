using Microsoft.AspNetCore.Identity;
using BackendOHCP.Models;
using System;
using System.Linq;

namespace BackendOHCP.Data
{
    public static class DbInitializer
    {

        private static string NumberToLetters(int num)
        {
            string result = "";
            while (num > 0)
            {
                num--; // Adjust to 0-indexed
                result = (char)('A' + (num % 26)) + result;
                num /= 26;
            }
            return result;
        }
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
                Gender = "Male",
                DateOfBirth = new DateTime(1990, 1, 1)
            };

            context.Users.AddRange(admin);
            context.SaveChanges();

            var patientUsers = new List<User>();

            for (int i = 1; i <= 100; i++)
            {
                var suffix = NumberToLetters(i);
                var gender = rnd.Next(2) == 0 ? "Male" : "Female";
                var firstName = gender == "Male" ? $"John{suffix}" : $"Jane{suffix}";
                var lastName = $"Doe{suffix}";
                var dob = new DateTime(1980 + rnd.Next(30), rnd.Next(1, 13), rnd.Next(1, 28));

                var patient = new User
                {
                    Email = $"patient{i}@ohcp.com",
                    Role = "patient",
                    PasswordHash = hasher.HashPassword(null, $"Patient{i}@123"),
                    FirstName = firstName,
                    LastName = lastName,
                    Gender = gender,
                    DateOfBirth = dob,
                    CreatedAt = DateTime.UtcNow.AddDays(-rnd.Next(30, 365))
                };

                patientUsers.Add(patient);
            }

            context.Users.AddRange(patientUsers);
            context.SaveChanges();

            // Generate 50 doctors
            var careOptions = Enum.GetValues(typeof(CareOptionType)).Cast<CareOptionType>().ToList();
            var doctorUsers = new List<User>();
            var doctorProfiles = new List<DoctorProfile>();
            var doctorCareOptions = new List<DoctorCareOption>();

            for (int i = 1; i <= 50; i++)
            {
                var suffix = NumberToLetters(i);
                var gender = rnd.Next(2) == 0 ? "Male" : "Female";
                var firstName = gender == "Male" ? $"Simon{suffix}" : $"Sam{suffix}";
                var lastName = $"Johnson{suffix}";
                var doctor = new User
                {
                    Email = $"doctor{i}@ohcp.com",
                    Role = "doctor",
                    PasswordHash = hasher.HashPassword(null, $"Doctor{i}@123"),
                    FirstName = firstName,
                    LastName = lastName,
                    Gender = gender,
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

            var appointmentSlots = new[]
                {
                    new TimeSpan(8, 0, 0),
                    new TimeSpan(10, 30, 0),
                    new TimeSpan(14, 0, 0),
                    new TimeSpan(16, 30, 0),
                    new TimeSpan(20, 30, 0)
                };

            var appointmentStartDate = new DateTime(2025, 1, 1);
            var appointmentEndDate = new DateTime(2025, 7, 6);
            var utcPlus7 = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // For UTC+7
            var appointmentMap = new HashSet<string>(); // "doctorId|date|time" to avoid overlaps
            var appointments = new List<Appointment>();

            var allPatients = context.Users.Where(u => u.Role == "patient").ToList();
            var allDoctors = context.Users.Where(u => u.Role == "doctor").ToList();
            var allCareOptions = Enum.GetNames(typeof(CareOptionType));

            int maxAttempts = 2000;
            int count = 0;
            int attempts = 0;

            while (count < 500 && attempts < maxAttempts)
            {
                attempts++;
                var doctor = allDoctors[rnd.Next(allDoctors.Count)];
                var patient = allPatients[rnd.Next(allPatients.Count)];
                var dayOffset = rnd.Next((appointmentEndDate - appointmentStartDate).Days + 1);
                var date = appointmentStartDate.AddDays(dayOffset).Date;
                var slot = appointmentSlots[rnd.Next(appointmentSlots.Length)];

                var localDateTime = date.Add(slot);
                var utcDateTime = TimeZoneInfo.ConvertTimeToUtc(localDateTime, utcPlus7);

                string key = $"{doctor.UserId}|{date}|{slot}";
                if (appointmentMap.Contains(key)) continue;
                appointmentMap.Add(key);

                var status = "Scheduled";
                string? cancelReason = null;
                bool? cancelApproved = null;
                DateTime? cancelRequestedAt = null;

                if (utcDateTime < DateTime.UtcNow)
                {
                    if (rnd.NextDouble() < 0.75)
                    {
                        status = "Completed";
                    }
                    else
                    {
                        status = "Cancelled";
                        string initiator = rnd.Next(2) == 0 ? "Request by patient:" : "Request by doctor:";
                        cancelReason = initiator + " Cancellation reason.";
                        cancelApproved = true;
                        cancelRequestedAt = utcDateTime.AddDays(-rnd.Next(1, 7));
                    }
                }
                else
                {
                    var statuses = new[] { "Scheduled", "Cancelled", "Completed" };
                    status = statuses[rnd.Next(3)];

                    if (status == "Scheduled")
                    {
                        if (rnd.NextDouble() < 0.3)
                        {
                            string initiator = rnd.Next(2) == 0 ? "Request by patient:" : "Request by doctor:";
                            cancelReason = initiator + " Cancellation request.";
                            cancelApproved = rnd.Next(3) switch
                            {
                                0 => (bool?)null,
                                1 => true,
                                _ => false
                            };
                            cancelRequestedAt = utcDateTime.AddDays(-rnd.Next(1, 5));
                        }
                    }
                    else if (status == "Cancelled")
                    {
                        string initiator = rnd.Next(2) == 0 ? "Request by patient:" : "Request by doctor:";
                        cancelReason = initiator + " Cancellation reason.";
                        cancelApproved = true;
                        cancelRequestedAt = utcDateTime.AddDays(-rnd.Next(1, 5));
                    }
                    // "Completed" requires nothing
                }

                var appointment = new Appointment
                {
                    PatientId = patient.UserId,
                    DoctorId = doctor.UserId,
                    AppointmentTime = utcDateTime,
                    Mode = "video",
                    CareOption = allCareOptions[rnd.Next(allCareOptions.Length)],
                    Status = status,
                    CancelReason = cancelReason,
                    CancelApproved = cancelApproved,
                    CancelRequestedAt = cancelRequestedAt,
                    CreatedAt = DateTime.UtcNow
                };

                appointments.Add(appointment);
                count++;
            }

            context.Appointments.AddRange(appointments);
            context.SaveChanges();

        }
    }
}
