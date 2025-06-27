import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

export default function VideoCallPage() {
  const { appointmentId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoomName() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/videosession/appointment/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setRoomName(data.roomName);
      } catch {
        setRoomName("");
      } finally {
        setLoading(false);
      }
    }
    fetchRoomName();
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="w-full max-w-[1800px] h-[92vh] rounded-3xl shadow-2xl bg-white flex items-center justify-center border border-gray-100 p-4">
        {loading ? (
          <div className="w-full flex items-center justify-center text-blue-300 font-bold text-xl">
            Đang kết nối phòng video...
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Link className="absolute top-[-6%] left-10" to='/'>Back to Home</Link>
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border bg-black">
              <VideoCall roomName={roomName} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}