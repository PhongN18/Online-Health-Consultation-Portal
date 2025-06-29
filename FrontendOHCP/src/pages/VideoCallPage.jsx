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
  const [showModal, setShowModal] = useState(false);
  const [recordDescription, setRecordDescription] = useState("");
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

  const createMedicalRecord = async (desc) => {
    if (!appointment) return alert("Appointment not found!");
    const token = localStorage.getItem("token");
    console.log(appointment)

    const payload = {
      AppointmentId: parseInt(apptId),
      PatientId: appointment.patient.userId,
      DoctorId: appointment.doctor.userId,
      RecordType: "visit_summary",
      Description: desc
    };

    console.log(payload)

    try {
      const res = await fetch("/api/medicalrecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Medical record created successfully!");
        navigate(`/provider/appointment/${apptId}/record`);
      } else {
        const errorData = await res.json();
        alert(`Failed to create record: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  };
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
              <Button onClick={() => setShowModal(true)} className="absolute top-[-7%] right-0 bg-[var(--primary-blue)] text-white px-4 py-2 rounded-2xl hover:bg-[var(--dark-blue)]">
                Create Medical Record
              </Button>
            )}

            <div className="w-full h-full">
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border bg-black">
                <VideoCall roomName={roomName} />
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-[#00000090] z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
                  <h3 className="text-lg font-semibold mb-2">Write Visit Summary</h3>
                  <textarea
                    rows={5}
                    className="w-full border rounded p-2"
                    value={recordDescription}
                    onChange={(e) => setRecordDescription(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={() => setShowModal(false)} className="bg-gray-300">Cancel</Button>
                    <Button
                      onClick={async () => {
                        await createMedicalRecord(recordDescription);
                        setShowModal(false);
                      }}
                      className="bg-[var(--primary-blue)] text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
