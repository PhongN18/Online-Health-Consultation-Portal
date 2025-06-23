const records = [
  { name: "MRI Scan.pdf", date: "2025-05-30", link: "#" },
  { name: "Prescription.jpg", date: "2025-05-10", link: "#" },
];

export default function MedicalRecords() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Medical Records</h2>
      <div className="space-y-4">
        {records.map((r, i) => (
          <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-gray-400">{r.date}</div>
            </div>
            <a href={r.link} className="text-blue-500 hover:underline">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}
