import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios.get(`http://localhost:5232/api/DoctorProfiles/${id}`)
      .then(res => {
        setDoctor(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không tìm thấy bác sĩ hoặc lỗi kết nối API.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  if (error || !doctor)
    return (
      <div className="text-center py-10 text-red-500 font-bold">
        {error || "Không tìm thấy bác sĩ này."}
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-xl shadow">
        <img
          src={
            doctor.avatar ||
            "https://randomuser.me/api/portraits/lego/2.jpg"
          }
          className="w-32 h-32 rounded-full object-cover border"
          alt={doctor.Specialization}
        />
        <h2 className="text-2xl font-bold text-blue-700">{doctor.Specialization || "Doctor"}</h2>
        <div className="font-semibold text-lg text-gray-800">
          {doctor.Qualification}
        </div>
        <div className="text-gray-500">
          Kinh nghiệm: {doctor.ExperienceYears} năm
        </div>
        <div className="text-yellow-500">Rating: {Number(doctor.Rating).toFixed(1)}</div>
        {/* Có thể thêm các thông tin mô tả, mô hình mở rộng */}
        <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl text-lg hover:bg-blue-600 transition">
          Book Appointment
        </button>
      </div>
    </div>
  );
}
