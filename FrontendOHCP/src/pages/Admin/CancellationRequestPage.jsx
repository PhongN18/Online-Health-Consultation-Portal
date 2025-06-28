import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function CancellationRequestPage() {
    const [pendingCancellations, setPendingCancellations] = useState([]);
    const [modal, setModal] = useState({ type: null, target: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchPendingCancellations();
    }, []);

    const fetchPendingCancellations = async () => {
        const res = await axiosInstance.get('/api/admin/pending-cancellations', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPendingCancellations(res.data);
    };

    const handleCancelAction = async (id, action) => {
        const url = `/api/admin/${action}-cancellation/${id}`;
        await axiosInstance.post(url, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchPendingCancellations();
    };

    // Pagination
    const totalPages = Math.ceil(pendingCancellations.length / itemsPerPage);
    const paginatedData = pendingCancellations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-[1200px]">
                <div className="flex justify-between my-8">
                    <h3 className="text-3xl font-bold text-[var(--primary-blue)]">Pending Cancellation Requests</h3>
                    <Link to='/admin/dashboard' className='px-4 py-2 border-1 rounded-xl hover:bg-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:text-white cursor-pointer font-semibold'>Back to Dashboard</Link>
                </div>

                {/* Pending Table */}
                <div className="bg-white p-6 shadow rounded-lg">
                    {pendingCancellations.length === 0 ? (
                        <p className="text-gray-500">No pending cancellation approvals.</p>
                    ) : (
                        <>
                            <table className="w-full text-left border-t border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">Patient</th>
                                        <th className="p-2">Doctor</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Reason</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map(appt => (
                                        <tr key={appt.appointmentId} className="border-b">
                                            <td className="p-2">{appt.patientName}</td>
                                            <td className="p-2">{appt.doctorName}</td>
                                            <td className="p-2">{new Date(appt.appointmentTime).toLocaleString('en-GB')}</td>
                                            <td className="p-2 truncate max-w-[300px]">{appt.cancelReason}</td>
                                            <td className="p-2 flex gap-2 flex-wrap">
                                                <button
                                                    className="bg-green-600 px-4 py-1.5 rounded-xl text-white text-sm"
                                                    onClick={() => setModal({ type: 'approve', target: appt })}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="bg-red-600 px-4 py-1.5 rounded-xl text-white text-sm"
                                                    onClick={() => setModal({ type: 'reject', target: appt })}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex justify-center mt-6 gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-[var(--primary-blue)] text-white' : 'bg-white text-gray-700'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modal.target && (
                <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm {modal.type === 'approve' ? 'Approval' : 'Rejection'}
                        </h2>
                        <p>Are you sure you want to {modal.type} this cancellation request?</p>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 text-sm rounded-md bg-gray-300"
                                onClick={() => setModal({ type: null, target: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 text-sm text-white rounded-md ${modal.type === 'approve' ? 'bg-green-600' : 'bg-red-600'}`}
                                onClick={async () => {
                                    await handleCancelAction(modal.target.appointmentId, modal.type);
                                    setModal({ type: null, target: null });
                                }}
                            >
                                {modal.type === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CancellationRequestPage;
