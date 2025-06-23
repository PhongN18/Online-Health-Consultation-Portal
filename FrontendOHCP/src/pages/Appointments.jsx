import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/api"; // Đảm bảo đúng đường dẫn axios instance

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách lịch hẹn (bệnh nhân hoặc bác sĩ)
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments"); // Đảm bảo backend trả về mảng appointments
        setAppointments(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("Không thể tải lịch hẹn!");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Hàm kiểm tra: lịch hẹn video, sắp đến/đang diễn ra
  const canJoinVideoCall = (appointment) => {
    if (appointment.mode !== "video" || appointment.status !== "Upcoming") return false;
    const now = new Date();
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
    // Chỉ cho phép join trước 10 phút và sau 60 phút kể từ giờ hẹn
    return (
      now >= new Date(appointmentTime.getTime() - 10 * 60000) &&
      now <= new Date(appointmentTime.getTime() + 60 * 60000)
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Your Appointments</h2>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : appointments.length === 0 ? (
        <div>Bạn chưa có lịch hẹn nào.</div>
      ) : (
        <table className="w-full table-auto bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-3 text-left">Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={a.appointmentId || i} className="border-b last:border-none">
                <td className="p-3">{a.doctorName || a.doctor}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>
                  <span
                    className={
                      a.status === "Upcoming"
                        ? "text-blue-600"
                        : a.status === "Completed"
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {a.status}
                  </span>
                </td>
                <td>
                  {canJoinVideoCall(a) && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      onClick={() => navigate(`/video-call/${a.appointmentId}`)}
                    >
                      Tham gia Video Call
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
