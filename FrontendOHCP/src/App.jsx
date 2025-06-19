import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import MemberHeader from './components/MemberHeader';
import ProviderHeader from './components/ProviderHeader';
import Home from './pages/Home';
import Appointments from './pages/Member/Appointments';
import Checkout from './pages/Member/Checkout';
import ChooseDoctor from './pages/Member/ChooseDoctor';
import CompleteProfile from './pages/Member/CompleteProfile';
import DoctorList from './pages/Member/DoctorList';
import DoctorProfile from './pages/Member/DoctorProfile';
import MemberHome from './pages/Member/MemberHome';
import MemberLogin from './pages/Member/MemberLogin';
import MemberRegister from './pages/Member/MemberRegister';
import Profile from './pages/Member/Profile';
import ScheduleAppointment from './pages/Member/ScheduleAppointment';
import ProviderAppointments from './pages/Provider/ProviderAppointments';
import ProviderHome from './pages/Provider/ProviderHome';
import ProviderLogin from './pages/Provider/ProviderLogin';
import ProviderRegister from './pages/Provider/ProviderRegister';
import ProviderVerify from './pages/Provider/ProviderVerify';
import PrivateRoute from './routes/PrivateRoute';

function App() {

  const location = useLocation();
  const token = localStorage.getItem('token');

  const authPaths = ['/member/login', '/member/register', '/provider/login', '/provider/register'];
  const verifyPaths = ['/member/getting-started', '/provider/verify']
  const homePaths = ['/']
  const memberPaths = ['/member/profile', '/member/home', '/member/choose-doctor', '/member/schedule-appointment', '/member/checkout', '/member/appointments']
  const providerPaths = ['/provider/home', '/provider/appointments']

  const authLayout = authPaths.includes(location.pathname);
  const homeLayout = homePaths.includes(location.pathname);
  const memberLayout = memberPaths.includes(location.pathname);
  const providerLayout = providerPaths.includes(location.pathname);

  if (!token && (location.pathname.startsWith('/member') || location.pathname.startsWith('/provider')) && !authPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  if (token && (location.pathname === '/' || authPaths.includes(location.pathname))) {
    const role = localStorage.getItem('role');
    if (role === 'provider') return <Navigate to="/provider/home" replace />;
    return <Navigate to="/member/home" replace />;
  }

  return (
    <div className="flex flex-col">
      {homeLayout && <Header />}
      {memberLayout && <MemberHeader onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        window.location.href = '/';
      }}/>}
      {providerLayout && <ProviderHeader onLogout={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        window.location.href = '/';
      }}/>}
      <div id='page-content' className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path='/member/login' element={<MemberLogin/>} />
          <Route path='/member/register' element={<MemberRegister/>} />
          <Route path='/member/getting-started' element={<CompleteProfile/>} />
          <Route path='/provider/login' element={<ProviderLogin />} />
          <Route path='/provider/register' element={<ProviderRegister />} />
          <Route path='/provider/verify' element={<ProviderVerify />} />

          {/* Protected */}
          <Route path="/member/home" element={
            <PrivateRoute  requiredRole="member"><MemberHome /></PrivateRoute>
          } />
          <Route path="/member/profile" element={
            <PrivateRoute  requiredRole="member"><Profile /></PrivateRoute>
          } />
          <Route path="/member/choose-doctor" element={
            <PrivateRoute  requiredRole="member"><ChooseDoctor /></PrivateRoute>
          } />
          <Route path="/member/schedule-appointment" element={
            <PrivateRoute  requiredRole="member"><ScheduleAppointment /></PrivateRoute>
          } />
          <Route path="/member/checkout" element={
            <PrivateRoute  requiredRole="member"><Checkout /></PrivateRoute>
          } />
          <Route path="/member/appointments" element={
            <PrivateRoute  requiredRole="member"><Appointments /></PrivateRoute>
          } />
          <Route path="/provider/home" element={
            <PrivateRoute  requiredRole="provider"><ProviderHome /></PrivateRoute>
          } />
          <Route path="/provider/appointments" element={
            <PrivateRoute  requiredRole="provider"><ProviderAppointments /></PrivateRoute>
          } />
        </Routes>
      </div>
      {homeLayout && <Footer />}
    </div>
  );
}

export default App;
