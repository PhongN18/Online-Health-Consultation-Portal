import { Card } from "@/components/ui/card";

export default function DoctorCard({ doctor }) {
  return (
    <Card className="p-4 flex flex-col items-center shadow-md hover:shadow-lg transition">
      <img
        src={doctor.avatar || "https://randomuser.me/api/portraits/med/men/75.jpg"}
        alt={doctor.name}
        className="w-20 h-20 rounded-full object-cover mb-3"
      />
      <h3 className="font-bold text-lg text-blue-700">{doctor.name}</h3>
      <div className="text-sm text-gray-500">{doctor.specialty}</div>
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">View Profile</button>
    </Card>
  );
}
