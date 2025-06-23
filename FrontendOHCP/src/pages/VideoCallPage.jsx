import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall"; // Đảm bảo đúng đường dẫn!
import { Button } from "../components/ui/button";
import { Send } from "lucide-react";

export default function VideoCallPage() {
  const { appointmentId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [doctor, setDoctor] = useState({ name: "Bác sĩ", avatar: "https://randomuser.me/api/portraits/men/50.jpg" });
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { from: "doctor", text: "Chào bạn! Bắt đầu gọi video nhé?", time: "10:20" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  // Lấy roomName từ API dựa vào appointmentId
  useEffect(() => {
    async function fetchRoomName() {
      setLoading(true);
      try {
        const res = await fetch(`/api/videosession/appointment/${appointmentId}`);
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

  // Lấy tên bác sĩ nếu cần
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/appointments/${appointmentId}`);
        const data = await res.json();
        setDoctor({
          name: data.doctor?.firstName + " " + data.doctor?.lastName || "Bác sĩ",
          avatar: data.doctor?.avatar || "https://randomuser.me/api/portraits/men/50.jpg"
        });
      } catch {
        setDoctor({
          name: "Bác sĩ",
          avatar: "https://randomuser.me/api/portraits/men/50.jpg"
        });
      }
    }
    fetchDoctor();
  }, [appointmentId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages(msgs => [
      ...msgs,
      { from: "patient", text: input, time: new Date().toLocaleTimeString().slice(0,5) }
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-[1500px] h-[90vh] rounded-2xl shadow-2xl bg-white flex overflow-hidden border border-gray-100">
        {/* LEFT: Video Call */}
        <div className="flex-[2_2_0%] flex flex-col items-center justify-center bg-black">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-blue-300 font-bold text-lg">
              Đang kết nối phòng video...
            </div>
          ) : (
            <VideoCall roomName={roomName} />
          )}
        </div>
        {/* RIGHT: Chat */}
        <div className="flex-1 bg-[#f7faff] flex flex-col h-full border-l">
          <div className="p-5 border-b flex items-center gap-3">
            <img src={doctor.avatar} alt="doctor" className="rounded-full w-12 h-12 border" />
            <div>
              <div className="font-semibold text-gray-700">{doctor.name}</div>
              <div className="text-xs text-gray-400">Bác sĩ</div>
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 p-3 overflow-y-auto" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex mb-2 ${msg.from === "doctor" ? "justify-start" : "justify-end"}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow
                  ${msg.from === "doctor" ? "bg-white text-gray-700" : "bg-blue-100 text-blue-800"}`}>
                  <span>{msg.text}</span>
                  <span className="ml-2 text-xs text-gray-400">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Chat input */}
          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t bg-white">
            <input
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
            />
            <Button type="submit" size="icon" className="rounded-xl">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
