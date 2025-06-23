// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white py-4 shadow mb-6">
      <div className="container mx-auto flex gap-4 justify-center">
        <Link className="font-semibold text-blue-600 hover:underline" to="/">Home</Link>
        <Link className="font-semibold text-blue-600 hover:underline" to="/doctors">Doctors</Link>
        <Link className="font-semibold text-blue-600 hover:underline" to="/appointments">Appointments</Link>
        <Link className="font-semibold text-blue-600 hover:underline" to="/medical-records">Medical Records</Link>
        {/* Có thể thêm các trang khác */}
      </div>
    </nav>
  );
}
