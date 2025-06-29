import { Button } from "@/components/ui/button";
import { UserContext } from "@/contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

export default function VideoCallPage() {
  const { apptId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [roomRes, apptRes] = await Promise.all([
          fetch(`/api/videosession/appointment/${apptId}`, { headers }),
          fetch(`/api/appointments/${apptId}`, { headers }),
        ]);

        if (!roomRes.ok || !apptRes.ok) throw new Error("Fetch failed");

        const roomData = await roomRes.json();
        const apptData = await apptRes.json();

        setRoomName(roomData.roomName);
        setAppointment(apptData);
      } catch (err) {
        console.error(err);
        setRoomName("");
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apptId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center pt-16">
      <div className="relative w-[1200px] h-[92vh] rounded-3xl shadow-2xl bg-white flex items-center justify-center border border-gray-100 p-4">
        {loading ? (
          <div className="w-full text-center text-blue-300 font-bold text-xl">
            Đang kết nối phòng video...
          </div>
        ) : (
          <>
            <Link
              className="absolute top-[-7%] left-0 bg-[var(--primary-blue)] hover:bg-[var(--dark-blue)] text-white px-4 py-2 rounded-2xl transition"
              to={role === "member" ? `/member/appointment/${apptId}` : `/provider/appointment/${apptId}`}
            >
              Back
            </Link>

            {role === "provider" && (
              <Button
                onClick={() => navigate(`/provider/appointment/${apptId}/record`)}
                className="absolute top-[-7%] right-0 bg-[var(--primary-blue)] text-white px-4 py-2 rounded-2xl hover:bg-[var(--dark-blue)]"
              >
                Create Medical Record
              </Button>
            )}

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
