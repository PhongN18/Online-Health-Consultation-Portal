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
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Total Patients</h2>
                        <p className="text-3xl text-sky-600">{summary?.totalPatients ?? '...'}</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Verified Doctors</h2>
                        <p className="text-3xl text-green-600">{summary?.verifiedDoctors ?? '...'}</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Pending Verifications</h2>
                        <p className="text-3xl text-red-500">{summary?.pendingDoctors ?? '...'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Doctors Awaiting Verification (Preview Box) */}
                    <div
                        className="bg-white p-6 shadow rounded-lg cursor-pointer hover:shadow-md transition"
                        onClick={() => navigate('/admin/verify-doctor')}
                    >
                        <h2 className="text-lg font-semibold mb-3 text-[var(--primary-blue)]">Doctors Awaiting Verification</h2>
                        {pendingDoctors.slice(0, 3).map((doc) => (
                            <p key={doc.doctorProfileId} className="text-sm text-gray-700">
                                • Dr. {doc.firstName} {doc.lastName} — {doc.specialization}
                            </p>
                        ))}
                        {pendingDoctors.length > 3 && (
                            <p className="text-sm mt-2 text-gray-500 italic">+ {pendingDoctors.length - 3} more</p>
                        )}
                    </div>

                    {/* Pending Cancellation Requests (Preview Box) */}
                    <div
                        className="bg-white p-6 shadow rounded-lg cursor-pointer hover:shadow-md transition"
                        onClick={() => navigate('/admin/approve-request')}
                    >
                        <h2 className="text-lg font-semibold mb-3 text-red-600">Pending Cancellation Requests</h2>
                        {summary?.pendingCancellationsPreview?.slice(0, 3).map((appt, i) => (
                            <p key={i} className="text-sm text-gray-700">
                                • {appt.doctorName} → {new Date(appt.appointmentTime).toLocaleDateString('en-GB')}
                            </p>
                        ))}
                        {summary?.pendingCancellations > 3 && (
                            <p className="text-sm mt-2 text-gray-500 italic">+ {summary.pendingCancellations - 3} more</p>
                        )}
                    </div>
                </div>


                {/* Pending Doctors Table */}
                <div className="bg-white p-6 shadow rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Doctors Awaiting Verification</h2>
                    {pendingDoctors.length === 0 ? (
                        <p className="text-gray-500">No doctors pending verification.</p>
                    ) : (
                        <table className="w-full text-left border-t border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Specialization</th>
                                    <th className="p-2">Qualification</th>
                                    <th className="p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingDoctors.map(doctor => (
                                    <tr key={doctor.doctorProfileId} className="border-b">
                                        <td className="p-2">{doctor.firstName} {doctor.lastName}</td>
                                        <td className="p-2">{doctor.specialization}</td>
                                        <td className="p-2">{doctor.qualification || 'N/A'}</td>
                                        <td className="p-2 flex gap-2 flex-wrap">
                                            {/* View Details */}
                                            <button
                                                className="bg-gray-200 px-4 py-1.5 rounded-xl text-sm"
                                                onClick={() => setSelectedDoctor(doctor)}
                                            >
                                                View
                                            </button>

                                            {/* Verify */}
                                            <button
                                                className="bg-[var(--primary-blue)] px-4 py-1.5 rounded-xl text-white text-sm"
                                                onClick={() => setModal({ type: 'verify', doctor })}
                                            >
                                                Verify
                                            </button>

                                            {/* Reject */}
                                            <button
                                                className="bg-red-500 px-4 py-1.5 rounded-xl text-white text-sm"
                                                onClick={() => setModal({ type: 'reject', doctor })}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal: View Doctor Details */}
                {selectedDoctor && (
                    <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
                            <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
                            <p><strong>Name:</strong> {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                            <p><strong>Qualification:</strong> {selectedDoctor.qualification || 'N/A'}</p>
                            <p><strong>Experience:</strong> {selectedDoctor.experienceYears || 'N/A'} years</p>
                            <p className="font-semibold">Care Options:</p>
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                                {selectedDoctor.careOptions.map((option, index) => (
                                    <li key={index}>
                                        {option.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                    </li>
                                ))}
                            </ul>
                            <div className="text-right mt-4">
                                <button
                                    className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md"
                                    onClick={() => setSelectedDoctor(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal: Confirm Verify/Reject */}
                {modal.doctor && (
                    <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                            <h2 className="text-lg font-semibold mb-4">
                                Confirm {modal.type === 'verify' ? 'Verification' : 'Rejection'}
                            </h2>
                            <p>Are you sure you want to {modal.type} Dr. {modal.doctor.firstName} {modal.doctor.lastName}?</p>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    className="px-4 py-2 text-sm rounded-md bg-gray-300"
                                    onClick={() => setModal({ type: null, doctor: null })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm text-white rounded-md ${modal.type === 'verify' ? 'bg-green-600' : 'bg-red-600'}`}
                                    onClick={() => {
                                        if (modal.type === 'verify') {
                                            handleVerify(modal.doctor.doctorProfileId);
                                        } else {
                                            handleReject(modal.doctor.doctorProfileId);
                                        }
                                        setModal({ type: null, doctor: null });
                                    }}
                                >
                                    {modal.type === 'verify' ? 'Confirm Verify' : 'Confirm Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
