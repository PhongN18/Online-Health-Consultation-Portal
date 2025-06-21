import DoctorCard from "@/components/doctors/DoctorCard";

const doctors = [
  { name: "Dr. Jane Smith", specialty: "Cardiologist", avatar: "" },
  { name: "Dr. John Doe", specialty: "Dermatologist", avatar: "" },
  { name: "Dr. Alice Brown", specialty: "Neurologist", avatar: "" },
  { name: "Dr. Mark Lee", specialty: "Pediatrician", avatar: "" },
];

export default function Doctors() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Our Doctors</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {doctors.map((doc, i) => (
          <DoctorCard key={i} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
