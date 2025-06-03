import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Appointment from './pages/Appointment';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="flex flex-col">
      <Header />
      <div id='page-content' className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
