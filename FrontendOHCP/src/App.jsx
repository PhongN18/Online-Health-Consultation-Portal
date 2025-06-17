import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import MemberHeader from './components/MemberHeader';
import Home from './pages/Home';
import Appointment from './pages/Member/Appointment';
import ChooseDoctor from './pages/Member/ChooseDoctor';
import CompleteProfile from './pages/Member/CompleteProfile';
import DoctorList from './pages/Member/DoctorList';
import DoctorProfile from './pages/Member/DoctorProfile';
import Login from './pages/Member/Login';
import MemberHome from './pages/Member/MemberHome';
import Profile from './pages/Member/Profile';
import Register from './pages/Member/Register';
import ScheduleAppointment from './pages/Member/ScheduleAppointment';
import PrivateRoute from './routes/PrivateRoute';

function App() {

  const location = useLocation();
  const token = localStorage.getItem('token');

  const authPaths = ['/member/login', '/member/register', '/member/getting-started'];
  const homePaths = ['/']
  const memberPaths = ['/member/profile', '/member/home', '/member/choose-doctor', '/member/schedule-appointment']

  const authLayout = authPaths.includes(location.pathname);
  const homeLayout = homePaths.includes(location.pathname);
  const memberLayout = memberPaths.includes(location.pathname);

  if (token && location.pathname === '/') {
    return <Navigate to="/member/home" replace />;
  }

  if (!token && location.pathname.startsWith('/member') && !authPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

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
          <Route path='/member/login' element={<Login/>} />
          <Route path='/member/register' element={<Register/>} />
          <Route path='/member/getting-started' element={<CompleteProfile/>} />

          {/* Protected */}
          <Route path="/member/home" element={
            <PrivateRoute><MemberHome /></PrivateRoute>
          } />
          <Route path="/member/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/member/choose-doctor" element={
            <PrivateRoute><ChooseDoctor /></PrivateRoute>
          } />
          <Route path="/member/schedule-appointment" element={
            <PrivateRoute><ScheduleAppointment /></PrivateRoute>
          } />
        </Routes>
      </div>
      {homeLayout && <Footer />}
    </div>
  );
}

export default App;
