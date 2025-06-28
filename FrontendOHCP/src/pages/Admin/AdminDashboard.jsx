import AdminDashboardCharts from '@/components/AdminDashboardCharts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modal, setModal] = useState({ type: null, doctor: null });

    useEffect(() => {
        // Fetch summary data
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setSummary(data);
            } catch (err) {
                console.error('Error fetching summary:', err);
            }
        };

        // Fetch doctors awaiting verification
        const fetchPendingDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/pending-doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setPendingDoctors(data);
            } catch (err) {
                console.error('Error fetching pending doctors:', err);
            }
        };

        fetchSummary();
        fetchPendingDoctors();
    }, []);

    const handleVerify = async (doctorId) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/admin/verify-doctor/${doctorId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setPendingDoctors(pendingDoctors.filter(doc => doc.doctorProfileId !== doctorId));
        }
    };

    const handleReject = async (doctorId) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/admin/reject-doctor/${doctorId}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setPendingDoctors(pendingDoctors.filter(doc => doc.doctorProfileId !== doctorId));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    console.log(summary)

    return (
        <div className="min-h-screen px-8 py-6 bg-gray-50 flex justify-center">
            <div className="w-[1200px]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[var(--primary-blue)]">Admin Dashboard</h1>
                    <button className='px-4 py-2 border-1 rounded-xl hover:bg-red-500 hover:border-0 hover:text-white cursor-pointer font-semibold' onClick={handleLogout}>Logout</button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                        <p className="text-3xl text-[var(--primary-blue)]">{summary?.totalUsers ?? '...'}</p>
                    </div>
                    <div className="relative overflow-hidden p-4 bg-white shadow rounded-lg cursor-pointer hover:translate-y-[-4%] transition hover:bg-[var(--primary-blue)] group" onClick={() => navigate('/admin/patients')}>
                        <h2 className="text-lg font-semibold text-gray-700 group-hover:text-white">Total Patients</h2>
                        <p className="text-3xl text-sky-600 group-hover:text-white">{summary?.totalPatients ?? '...'}</p>
                        <span className='absolute text-white right-4 bottom-[-10%] group-hover:bottom-4 transition-all ease-in-out'>View details <i className="fa-solid fa-angles-right"></i></span>
                    </div>
                    <div className="relative overflow-hidden p-4 bg-white shadow rounded-lg cursor-pointer hover:translate-y-[-4%] transition hover:bg-[var(--primary-blue)] group" onClick={() => navigate('/admin/doctors')}>
                        <h2 className="text-lg font-semibold text-gray-700 group-hover:text-white">Verified Doctors</h2>
                        <p className="text-3xl text-green-600 group-hover:text-white">{summary?.verifiedDoctors ?? '...'}</p>
                        <span className='absolute text-white right-4 bottom-[-10%] group-hover:bottom-4 transition-all ease-in-out'>View details <i className="fa-solid fa-angles-right"></i></span>
                    </div>
                    <div className="relative overflow-hidden p-4 bg-white shadow rounded-lg cursor-pointer hover:translate-y-[-4%] transition hover:bg-[var(--primary-blue)] group" onClick={() => navigate('/admin/verify-doctor')}>
                        <h2 className="text-lg font-semibold text-gray-700 group-hover:text-white">Pending Verifications</h2>
                        <p className="text-3xl text-red-500 group-hover:text-white">{summary?.pendingDoctors ?? '...'}</p>
                        <span className='absolute text-white right-4 bottom-[-10%] group-hover:bottom-4 transition-all ease-in-out'>View details <i className="fa-solid fa-angles-right"></i></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Doctors Awaiting Verification (Preview Box) */}
                    <div
                        className="relative bg-white overflow-hidden p-6 relative shadow rounded-lg cursor-pointer hover:shadow-md transition group"
                        onClick={() => navigate('/admin/verify-doctor')}
                    >
                        <h2 className="text-lg font-semibold mb-3 text-[var(--primary-blue)]">Doctors Awaiting Verification</h2>
                        {summary?.pendingDoctors === 0 && (
                            <p className='text-gray-500'>No pending doctors currently.</p>
                        )}
                        {pendingDoctors.slice(0, 3).map((doc) => (
                            <p key={doc.doctorProfileId} className="text-sm text-gray-700">
                                • Dr. {doc.firstName} {doc.lastName} — {doc.specialization}
                            </p>
                        ))}
                        {pendingDoctors.length > 3 && (
                            <p className="text-sm mt-2 text-gray-500 italic">+ {pendingDoctors.length - 3} more</p>
                        )}
                        <span className='absolute text-gray-400 right-6 bottom-[-10%] group-hover:bottom-6 transition-all ease-in-out'>View details <i className="fa-solid fa-angles-right"></i></span>
                    </div>

                    {/* Pending Cancellation Requests (Preview Box) */}
                    <div
                        className="relative bg-white overflow-hidden p-6 shadow rounded-lg cursor-pointer hover:shadow-md transition group"
                        onClick={() => navigate('/admin/approve-request')}
                    >
                        <h2 className="text-lg font-semibold mb-3 text-red-600">Pending Cancellation Requests</h2>
                        {summary?.pendingCancellations === 0 && (
                            <p className='text-gray-500'>No cancellation requests currently.</p>
                        )}
                        {summary?.pendingCancellationsPreview?.slice(0, 3).map((appt, i) => (
                            <p key={i} className="text-sm text-gray-700">
                                • {appt.doctorName} → {new Date(appt.appointmentTime).toLocaleDateString('en-GB')}
                            </p>
                        ))}
                        {summary?.pendingCancellations > 3 && (
                            <p className="text-sm mt-2 text-gray-500 italic">+ {summary.pendingCancellations - 3} more</p>
                        )}
                        <span className='absolute text-gray-400 right-6 bottom-[-10%] group-hover:bottom-6 transition-all ease-in-out'>View details <i className="fa-solid fa-angles-right"></i></span>
                    </div>
                </div>
                <AdminDashboardCharts />
            </div>
        </div>
    );
};

export default AdminDashboard;
