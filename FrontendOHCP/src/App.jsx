import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Navbar from "./components/Navbar";
import VideoCallPage from "./pages/VideoCallPage";
import ChatConsultationPage from './pages/ChatConsultationPage';


function App() {
  return (
    <Router>
       <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />      
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/video-call/:appointmentId" element={<VideoCallPage />} />
        <Route path="/chat/:appointmentId" element={<ChatConsultationPage />} />
      </Routes>
    </Router>
  );
}
export default App;
