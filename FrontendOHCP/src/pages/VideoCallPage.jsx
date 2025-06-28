import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

export default function VideoCallPage() {
  const { apptId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const context = useContext(UserContext)

  console.log(context)

  useEffect(() => {
    async function fetchRoomName() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/videosession/appointment/${apptId}`, {
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
  }, [apptId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center pt-16">
      <div className="relative w-[1200px] h-[92vh] rounded-3xl shadow-2xl bg-white flex items-center justify-center border border-gray-100 p-4">
        {loading ? (
          <div className="w-full flex items-center justify-center text-blue-300 font-bold text-xl">
            Đang kết nối phòng video...
          </div>
        ) : (
          <>
            <Link className="absolute block top-[-7%] bg-[var(--primary-blue)] hover:bg-[var(--dark-blue)] transition left-0 text-white px-4 py-2 rounded-2xl" to='/'>Back</Link>
            <div className="w-full h-full">
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border bg-black">
                <VideoCall roomName={roomName} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}