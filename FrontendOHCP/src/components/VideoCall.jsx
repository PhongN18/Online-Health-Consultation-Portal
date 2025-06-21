import React from "react";

const VideoCall = ({ roomName }) => {
  console.log("roomName Jitsi:", roomName);
  if (!roomName) return <div className="flex items-center justify-center w-full h-full text-red-400">Không tìm thấy phòng video.</div>;
  return (
    <iframe
      src={`https://meet.jit.si/${roomName}`}
      allow="camera; microphone; fullscreen; display-capture"
      style={{ width: "100%", height: "100%", border: "none", background: "#000" }}
      title="Video Consultation"
      allowFullScreen
    />
  );
};
export default VideoCall;
