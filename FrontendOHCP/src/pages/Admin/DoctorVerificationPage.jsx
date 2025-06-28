import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function DoctorVerificationPage() {
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [modal, setModal] = useState({ type: null, target: null });
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const doctorsPerPage = 6;

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const fetchPendingDoctors = async () => {
        const res = await axiosInstance.get('/api/admin/pending-doctors', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPendingDoctors(res.data);
    };

    const handleDoctorAction = async (id, action) => {
        const url = `/api/admin/${action}-doctor/${id}`;
        await axiosInstance.post(url, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchPendingDoctors();
    };

    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = pendingDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(pendingDoctors.length / doctorsPerPage);

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
            <div className="w-[1200px]">
                <div className="flex justify-between my-8">
                    <h3 className="text-3xl font-bold text-[var(--primary-blue)]">Doctors Awaiting Verification</h3>
                    <Link to='/admin/dashboard' className='px-4 py-2 border-1 rounded-xl hover:bg-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:text-white cursor-pointer font-semibold'>Back to Dashboard</Link>
                </div>

                {/* Doctor Verification Table */}
                <div className="bg-white p-6 shadow rounded-lg mb-10">
                    {pendingDoctors.length === 0 ? (
                        <p className="text-gray-500">No doctors pending verification.</p>
                    ) : (
                        <>
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
                                    {currentDoctors.map(doctor => (
                                        <tr key={doctor.doctorProfileId} className="border-b">
                                            <td className="p-2">{doctor.firstName} {doctor.lastName}</td>
                                            <td className="p-2">{doctor.specialization}</td>
                                            <td className="p-2">{doctor.qualification || 'N/A'}</td>
                                            <td className="p-2 flex gap-2 flex-wrap">
                                                <button
                                                    className="bg-gray-200 px-4 py-1.5 rounded-xl text-sm"
                                                    onClick={() => setSelectedDetail(doctor)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="bg-[var(--primary-blue)] px-4 py-1.5 rounded-xl text-white text-sm"
                                                    onClick={() => setModal({ type: 'verify', target: doctor })}
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="bg-red-500 px-4 py-1.5 rounded-xl text-white text-sm"
                                                    onClick={() => setModal({ type: 'reject', target: doctor })}
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
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`px-4 py-1.5 rounded border text-sm font-medium ${currentPage === i + 1
                                            ? 'bg-[var(--primary-blue)] text-white'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal: View Detail */}
            {selectedDetail && (
                <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">Doctor Details</h2>
                        <p><strong>Name:</strong> {selectedDetail.firstName} {selectedDetail.lastName}</p>
                        <p><strong>Specialization:</strong> {selectedDetail.specialization}</p>
                        <p><strong>Qualification:</strong> {selectedDetail.qualification || 'N/A'}</p>
                        <p><strong>Experience:</strong> {selectedDetail.experienceYears || 'N/A'} years</p>
                        <p className="font-semibold">Care Options:</p>
                        <ul className="list-disc list-inside text-gray-700 mt-1">
                            {selectedDetail.careOptions?.map((option, index) => (
                                <li key={index}>{option.replace(/([a-z])([A-Z])/g, '$1 $2')}</li>
                            ))}
                        </ul>
                        <div className="text-right mt-4">
                            <button className="px-4 py-2 text-sm text-white bg-gray-600 rounded-md" onClick={() => setSelectedDetail(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Confirm Verification/Reject */}
            {modal.target && (
                <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm {modal.type === 'verify' ? 'Verification' : 'Rejection'}
                        </h2>
                        <p>Are you sure you want to {modal.type} Dr. {modal.target.firstName} {modal.target.lastName}?</p>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 text-sm rounded-md bg-gray-300"
                                onClick={() => setModal({ type: null, target: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 text-sm text-white rounded-md ${modal.type === 'verify' ? 'bg-green-600' : 'bg-red-600'}`}
                                onClick={async () => {
                                    await handleDoctorAction(modal.target.doctorProfileId, modal.type);
                                    setModal({ type: null, target: null });
                                }}
                            >
                                {modal.type === 'verify' ? 'Confirm Verify' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorVerificationPage;
