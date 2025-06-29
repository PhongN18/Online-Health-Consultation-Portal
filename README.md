# 🩺 Online Health Consultation Portal (OHCP)

A full-stack telemedicine platform for booking and managing doctor appointments, conducting video consultations, and storing medical records and prescriptions.

---

## 🚀 Tech Stack

- **Backend:** ASP.NET Core Web API (C#)
- **Frontend:** React (JavaScript) + Tailwind CSS
- **Database:** MySQL (via XAMPP)
- **Authentication:** JWT-based

---

## 🖥️ Project Structure

```
/BackendOHCP/ → ASP.NET Core Web API project
/FrontendOHCP/ → React client app
```

---

## 🔧 Requirements

- [.NET 7 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Node.js + npm](https://nodejs.org/) (v18+)
- [XAMPP](https://www.apachefriends.org/) or MySQL server (running)
- Visual Studio / VS Code

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PhongN18/Online-Health-Consultation-Portal.git
cd "Online Health Consultation Portal"
```

### 2. Configure the Database

1. Start XAMPP and ensure MySQL is running.
2. Create a database named ohcp_db in phpMyAdmin or MySQL CLI.
3. Update the connection string in:
   `BackendOHCP/appsettings.json`:

```json
    "ConnectionStrings": {
        "DefaultConnection": "Server=localhost;Database=healthdb;User=root;Password=;"
    },
    "Jwt": {
        "Key": "secret_jwt_key",
        "Issuer": "backendohcp",
        "Audience": "backendohcp"
    }
```

### 3. Run Backend (ASP.NET Core)

```bash
cd BackendOHCP
dotnet restore
dotnet ef database update        # Apply migrations
dotnet run
```

The backend will start on `https://localhost:5232` or `http://localhost:7189`.

### 4. Run Frontend (React + Tailwind)

```bash
cd FrontendOHCP
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default).

### 5. Seed Data

The backend includes a `DbInitializer` that seeds:

- 1 admin
- 100 patients
- 50 doctors (with care options, profiles)
- 500 appointments
- Medical records & prescriptions (linked to completed appointments)

⚠️ **Note**: The database will be seeded automatically on first run if empty.

### 🧪 Testing

- Login as admin/doctor/patient:

* Admin: admin@ohcp.com / Admin@123
* Doctor: doctor{i}@ohcp.com / Doctor{i}@123 - i from 1 to 50
* Patient: patient{i}@ohcp.com / Patient{i}@123 - i from 1 to 100
