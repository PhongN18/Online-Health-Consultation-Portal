import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function ChatConsultationPage() {
  const { appointmentId } = useParams();
  const [partner, setPartner] = useState({ name: "Đối tác", avatar: "", userId: null });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [allowedChat, setAllowedChat] = useState(false); // chỉ cho phép bệnh nhân/bác sĩ thật chat
  const scrollRef = useRef();

  // Lấy user hiện tại
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const currentUserId = userInfo.userId;

  // Lấy thông tin appointment và partner (bác sĩ/bệnh nhân)
  useEffect(() => {
  async function fetchPartner() {
    try {
      const token = localStorage.getItem("token");
      const resApp = await fetch(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resApp.ok) {
        throw new Error("Không tìm thấy appointment");
      }

      const data = await resApp.json();
      // Chỉ chat khi mode === "chat"
      if (data.mode !== "chat") {
        setAllowedChat(false);
        setPartner({
          name: "Không xác định",
          avatar: "",
          userId: null,
          role: "",
        });
        return;
      }

      // Xác định partner object từ response
      let partnerObj = null;
      let partnerRole = "";
      if (currentUserId === data.patientId) {
        partnerObj = data.doctor;
        partnerRole = "doctor";
      } else if (currentUserId === data.doctorId) {
        partnerObj = data.patient;
        partnerRole = "patient";
      }

      // Nếu user không phải bên tham gia appointment
      if (!partnerObj) {
        setAllowedChat(false);
        setPartner({
          name: "Không xác định",
          avatar: "",
          userId: null,
          role: "",
        });
        return;
      }

      // Đã qua các bước kiểm tra, cho phép chat
      setAllowedChat(true);
      setPartner({
        name: `${partnerObj.firstName || ""} ${partnerObj.lastName || ""}`.trim() || "Không xác định",
        avatar: partnerObj.avatar || "https://randomuser.me/api/portraits/lego/1.jpg",
        userId: partnerObj.userId,
        role: partnerRole,
      });
    } catch (error) {
      console.error("fetchPartner error:", error);
      setAllowedChat(false);
      setPartner({
        name: "Không xác định",
        avatar: "",
        userId: null,
        role: "",
      });
    }
  }

  fetchPartner();
}, [appointmentId, currentUserId]);


// Lấy lịch sử chat — sau khi đã setAllowedChat và setPartner xong
// ChatConsultationPage.jsx

  useEffect(() => {
    async function fetchHistory() {
      // nếu chưa xác định user / partner hoặc không được phép chat → clear và stop
      if (!currentUserId || !partner.userId || !allowedChat) {
        setMessages([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        // gọi endpoint lấy messages theo appointmentId
        const res = await fetch(
          `/api/messages/by-appointment/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (!res.ok) {
          console.error("Fetch history failed:", res.status);
          return;
        }

        const msgs = await res.json();
        setMessages(
          msgs.map(msg => ({
            id: msg.messageId,
            from: msg.senderId === currentUserId ? "me" : "partner",
            text: msg.content,
            time: new Date(msg.sentAt).toLocaleTimeString().slice(0,5),
            // nếu cần show tên sender:
            // displayName: msg.senderId === currentUserId
            //   ? `${currentUser.firstName} ${currentUser.lastName}`
            //   : `${partner.firstName} ${partner.lastName}`,
          }))
        );
      } catch (e) {
        console.error("fetchHistory error:", e);
      }
    }

    fetchHistory();
  }, [
    appointmentId,
    currentUserId,
    partner.userId,  // thêm partner.userId để effect chạy lại khi partner set
    allowedChat      // cũng cần khi quyền chat thay đổi
  ]);


  // Kết nối SignalR chat realtime
  useEffect(() => {
    if (connection) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const conn = new HubConnectionBuilder()
      .withUrl("http://localhost:5232/chatHub", { accessTokenFactory: () => token })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => {
      setIsConnected(true);
      setConnection(conn);
      conn.on("ReceiveMessage", (msg) => {
        setMessages(messages => [
          ...messages,
          {
            from: msg.senderId === currentUserId ? "me" : "partner",
            text: msg.content,
            time: new Date(msg.sentAt).toLocaleTimeString().slice(0, 5)
          }
        ]);
      });
    }).catch(() => setIsConnected(false));

    return () => { conn.stop(); };
  }, [connection, currentUserId]);

  // Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (
      !input.trim() ||
      !connection ||
      connection.state !== "Connected" ||
      !allowedChat
    ) return;
    try {
      // Bổ sung AppointmentId cho chuẩn backend mới
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: partner.userId,
          content: input,
          appointmentId: Number(appointmentId)
        })
      });
      // Gửi SignalR cho realtime (nếu có dùng SignalR)
      await connection.invoke("SendMessage", currentUserId, partner.userId, input);
      setInput("");
    } catch { /* empty */ }
  };

  // Scroll cuối chat khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl bg-white flex border border-gray-100 overflow-hidden">
        {/* Bên trái: Đối tác */}
        <div className="w-80 bg-gray-50 border-r h-full flex flex-col">
          <div className="p-6 border-b font-bold text-lg text-gray-700">Đối tác</div>
          <div className="flex items-center gap-4 px-6 py-5 border-b">
            <img src={partner.avatar} alt="avatar" className="rounded-full h-12 w-12 border" />
            <div>
              <div className="font-semibold text-gray-800">{partner.name}</div>
            </div>
          </div>
        </div>
        {/* Khung chat chính */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-6 border-b flex items-center gap-3">
            <img src={partner.avatar} alt="avatar" className="rounded-full w-10 h-10 border" />
            <div>
              <div className="font-semibold text-gray-700">{partner.name}</div>
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f7faff]" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "partner" ? "justify-start" : "justify-end"}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm shadow
                  ${msg.from === "partner" ? "bg-white text-gray-700" : "bg-blue-100 text-blue-800"}`}>
                  <span>{msg.text}</span>
                  <span className="ml-2 text-xs text-gray-400">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Chat input */}
          <form onSubmit={handleSend} className="flex gap-2 p-6 border-t bg-white">
            <input
              className="flex-1 rounded-xl border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder={allowedChat ? "Nhập tin nhắn..." : "Bạn không có quyền chat cuộc trò chuyện này"}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
              disabled={!isConnected || !allowedChat}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-xl"
              disabled={!isConnected || !allowedChat || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
