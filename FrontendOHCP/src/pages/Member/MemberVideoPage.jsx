import { Button } from "@/components/ui/button";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatConsultationPage() {
    const { appointmentId } = useParams();
    const [partner, setPartner] = useState({ firstName:"", lastName:"", avatar:"", userId:null });
    const [currentUser, setCurrentUser] = useState({ firstName:"", lastName:"", userId:null });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connection, setConnection] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [allowedChat, setAllowedChat] = useState(false);
    const scrollRef = useRef();

    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo")||"{}");
    const currentUserId = userInfo.userId;

    // 1. Fetch currentUser info
    useEffect(() => {
        async function fetchMe() {
        const res = await fetch("/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } });
        if (res.ok) {
            const me = await res.json();
            setCurrentUser({ firstName: me.firstName, lastName: me.lastName, userId: me.userId });
        }
        }
        fetchMe();
    }, [token]);

    // 2. Fetch partner & kiểm tra quyền
    useEffect(() => {
        async function fetchPartner() {
        const resApp = await fetch(`/api/appointments/${appointmentId}`, { headers:{ Authorization:`Bearer ${token}` } });
        if (!resApp.ok) return setAllowedChat(false);
        const app = await resApp.json();  // có mode, patientId, doctorId
        if (app.mode !== "chat") return setAllowedChat(false);

        let partnerId, partnerRole;
        if (currentUserId === app.patientId) {
            partnerId = app.doctorId; partnerRole = "doctor";
        } else if (currentUserId === app.doctorId) {
            partnerId = app.patientId; partnerRole = "patient";
        } else {
            return setAllowedChat(false);
        }
        setAllowedChat(true);

        // fetch partner details
        const resUser = await fetch(`/api/users/${partnerId}`, { headers:{ Authorization:`Bearer ${token}` } });
        if (resUser.ok) {
            const u = await resUser.json();
            setPartner({ firstName: u.firstName, lastName: u.lastName, avatar: u.avatar, userId: u.userId, role:partnerRole });
        }
        }
        fetchPartner();
    }, [appointmentId, currentUserId, token]);

    // 3. Fetch lịch sử chat theo appointment
    useEffect(() => {
        async function fetchHistory() {
        if (!currentUserId || !partner.userId) return;
        const res = await fetch(`/api/messages/by-appointment/${appointmentId}`, {
            headers:{ Authorization:`Bearer ${token}` }
        });  // :contentReference[oaicite:1]{index=1}
        if (!res.ok) return;
        const msgs = await res.json();
        setMessages(msgs.map(msg=>({
            id: msg.messageId,
            senderId: msg.senderId,
            text: msg.content,
            time: new Date(msg.sentAt).toLocaleTimeString().slice(0,5),
            from: msg.senderId===currentUserId ? "me" : "partner",
            displayName: msg.senderId===currentUserId
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : `${partner.firstName} ${partner.lastName}`
        })));
        }
        fetchHistory();
    }, [appointmentId, currentUserId, partner, token]);

    // 4. Cài SignalR…
    useEffect(() => {
        if (connection) return;
        const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5232/chatHub", { accessTokenFactory:()=>token })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
        conn.start().then(()=>{
        setConnection(conn); setIsConnected(true);
        conn.on("ReceiveMessage", msg=>{
            setMessages(ms=>[...ms,{
            id: msg.messageId,
            senderId: msg.senderId,
            text: msg.content,
            time: new Date(msg.sentAt).toLocaleTimeString().slice(0,5),
            from: msg.senderId===currentUserId?"me":"partner",
            displayName: msg.senderId===currentUserId
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : `${partner.firstName} ${partner.lastName}`
            }]);
        });
        }).catch(()=>setIsConnected(false));
        return ()=>conn.stop();
    }, [connection, currentUserId, token, currentUser, partner]);

    // 5. Gửi tin nhắn
    const handleSend = async e => {
        e.preventDefault();
        if (!input.trim()||!connection||connection.state!=="Connected"||!allowedChat) return;
        await fetch("/api/messages", {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            senderId: currentUserId,
            receiverId: partner.userId,
            content: input,
            appointmentId: Number(appointmentId)
        })
        });
        await connection.invoke("SendMessage", currentUserId, partner.userId, input, Number(appointmentId));
        setInput("");
    };

    // 6. Auto-scroll
    useEffect(()=>{
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl bg-white flex border border-gray-100 overflow-hidden">
            {/* Sidebar partner */}
            <div className="w-80 bg-gray-50 border-r h-full flex flex-col">
            <div className="p-6 border-b font-bold text-lg text-gray-700">Đối tác</div>
            <div className="flex items-center gap-4 px-6 py-5 border-b">
                <img src={partner.avatar} alt="avatar" className="rounded-full h-12 w-12 border" />
                <div>
                <div className="font-semibold text-gray-800">
                    {partner.firstName} {partner.lastName}
                </div>
                </div>
            </div>
            </div>
            {/* Chat area */}
            <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b flex items-center gap-3">
                <img src={partner.avatar} alt="avatar" className="rounded-full w-10 h-10 border" />
                <div className="font-semibold text-gray-700">
                {partner.firstName} {partner.lastName}
                </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f7faff]" ref={scrollRef}>
                {messages.map(msg=>(
                <div key={msg.id} className={`flex ${msg.from==="partner"?"justify-start":"justify-end"}`}>
                    <div>
                    <div className="text-xs text-gray-500 mb-1">
                        {msg.displayName}
                    </div>
                    <div className={`
                        px-4 py-2 rounded-2xl text-sm shadow
                        ${msg.from==="partner"?"bg-white text-gray-700":"bg-blue-100 text-blue-800"}`}>
                        <span>{msg.text}</span>
                        <span className="ml-2 text-xs text-gray-400">{msg.time}</span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2 p-6 border-t bg-white">
                <input
                className="flex-1 rounded-xl border border-gray-200 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder={allowedChat?"Nhập tin nhắn...":"Bạn không có quyền chat"}
                value={input}
                onChange={e=>setInput(e.target.value)}
                disabled={!isConnected||!allowedChat}
                />
                <Button type="submit" size="icon" disabled={!isConnected||!allowedChat||!input.trim()}>
                <Send className="h-5 w-5"/>
                </Button>
            </form>
            </div>
        </div>
        </div>
    );
}
