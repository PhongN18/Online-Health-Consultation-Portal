import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import MemberHeader from './components/MemberHeader';
import Appointment from './pages/Appointment';
import CompleteProfile from './pages/CompleteProfile';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import MemberHome from './pages/MemberHome';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {

  const location = useLocation();

  // List of routes where we DO NOT want header/footer
  const authPaths = ['/member/login', '/member/register', '/member/getting-started'];
  const homePaths = ['/']
  const memberPaths = ['/member/profile', '/member/home']

  const authLayout = authPaths.includes(location.pathname);
  const homeLayout = homePaths.includes(location.pathname);
  const memberLayout = memberPaths.includes(location.pathname);

  return (
    <div className="flex flex-col">
      {homeLayout && <Header />}
      {memberLayout && <MemberHeader />}
      <div id='page-content' className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/member/profile" element={<Profile />} />
          <Route path='/member/login' element={<Login/>} />
          <Route path='/member/register' element={<Register/>} />
          <Route path='/member/getting-started' element={<CompleteProfile/>} />
          <Route path='/member/home' element={<MemberHome />} />
        </Routes>
      </div>
      {homeLayout && <Footer />}
    </div>
  );
}

export default App;
