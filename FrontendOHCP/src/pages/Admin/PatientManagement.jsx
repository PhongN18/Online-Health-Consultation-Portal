import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function PatientManagement() {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ userId: '', email: '', firstName: '', lastName: '', dateOfBirth: '', age: '', gender: '' });
    const [pendingFilters, setPendingFilters] = useState({ ...filters });
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/admin/patients', {
                params: { page, pageSize, ...filters },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPatients(res.data.data);
            setTotal(res.data.totalCount);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, [page, filters]);

    const getAge = (dob) => {
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const applyFilters = () => {
        setFilters({ ...pendingFilters });
        setPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put(`/api/admin/patient/${editModal.userId}`, editModal, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEditModal(null);
            fetchPatients();
        } catch (err) {
            alert("Update failed.");
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/api/admin/patient/${deleteModal.userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDeleteModal(null);
            fetchPatients();
        } catch (err) {
            alert("Delete failed.");
            console.error(err);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between my-8">
                <h3 className="text-3xl font-bold text-[var(--primary-blue)]">Manage Patients</h3>
                <Link to='/admin/dashboard' className='px-4 py-2 border-1 rounded-xl hover:bg-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:text-white cursor-pointer font-semibold'>Back to Dashboard</Link>
            </div>
            <div className="flex justify-end my-4">
                <button onClick={applyFilters} className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded hover:bg-[var(--dark-blue)]">Search</button>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-left">
                    <thead className="bg-[var(--primary-blue)] text-white">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">First Name</th>
                            <th className="p-4">Last Name</th>
                            <th className="p-4">DOB</th>
                            <th className="p-4">Age</th>
                            <th className="p-4">Gender</th>
                            <th className="p-4"></th>
                        </tr>
                        <tr className="bg-[var(--primary-blue)]">
                            {['userId', 'email', 'firstName', 'lastName'].map((field) => (
                                <th className="px-4 pb-2" key={field}>
                                    <input type="text" className="w-full border bg-white text-[var(--dark-blue)] rounded px-2 py-1"
                                        value={pendingFilters[field]}
                                        onChange={e => setPendingFilters(prev => ({ ...prev, [field]: e.target.value }))}
                                        onKeyDown={handleKeyDown} />
                                </th>
                            ))}
                            <th className="px-4 pb-2">
                                <input type="date" className="w-full border bg-white text-[var(--dark-blue)] rounded px-2 py-1"
                                    value={pendingFilters.dateOfBirth}
                                    onChange={e => setPendingFilters(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                    onKeyDown={handleKeyDown} />
                            </th>
                            <th className="px-4 pb-2">
                                <input type="number" className="w-full border bg-white text-[var(--dark-blue)] rounded px-2 py-1"
                                    value={pendingFilters.age}
                                    onChange={e => setPendingFilters(prev => ({ ...prev, age: e.target.value }))}
                                    onKeyDown={handleKeyDown} />
                            </th>
                            <th className="px-4 pb-2">
                                <select
                                    className="w-full bg-white text-[var(--dark-blue)] border rounded px-2 py-1"
                                    value={pendingFilters.gender}
                                    onChange={e => {
                                        const updatedGender = e.target.value;
                                        const updatedFilters = { ...pendingFilters, gender: updatedGender };
                                        setPendingFilters(updatedFilters);
                                        setFilters(updatedFilters);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center p-4 text-gray-500">Loading...</td></tr>
                        ) : patients.length === 0 ? (
                            <tr><td colSpan="7" className="text-center p-4 text-gray-500">No patients found.</td></tr>
                        ) : patients.map((p) => (
                            <tr key={p.userId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{p.userId}</td>
                                <td className="px-4 py-2">{p.email}</td>
                                <td className="px-4 py-2">{p.firstName}</td>
                                <td className="px-4 py-2">{p.lastName}</td>
                                <td className="px-4 py-2">{new Date(p.dateOfBirth).toLocaleDateString('en-GB')}</td>
                                <td className="px-4 py-2">{getAge(p.dateOfBirth)}</td>
                                <td className="px-4 py-2">{p.gender}</td>
                                <td className="px-4 py-2 relative">
                                    <button onClick={() => setActiveDropdown(activeDropdown === p.userId ? null : p.userId)} className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                                        <i className="fa-solid fa-gear"></i>
                                    </button>
                                    {activeDropdown === p.userId && (
                                        <div className="absolute right-0 bg-white rounded shadow z-10">
                                            <button onClick={() => { setEditModal(p); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-sm hover:bg-gray-100">Update</button>
                                            <button onClick={() => { setDeleteModal(p); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-4 p-4 flex justify-end items-center">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
                    <span className="px-4">Page {page}</span>
                    <button disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
                </div>
            </div>

            {/* Update Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-[#00000090] flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Update Patient Info</h2>
                        {['email', 'firstName', 'lastName', 'dateOfBirth', 'gender'].map(field => (
                            <div key={field} className="mb-3">
                                <label className="block font-medium mb-1">
                                    {field === 'dateOfBirth'
                                        ? 'Date of Birth'
                                        : field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>

                                {field === 'gender' ? (
                                    <select
                                        className="w-full border px-2 py-1 rounded"
                                        value={editModal.gender}
                                        onChange={(e) => setEditModal({ ...editModal, gender: e.target.value })}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ) : field === 'dateOfBirth' ? (
                                    <input
                                        type="date"
                                        className="w-full border px-2 py-1 rounded"
                                        value={editModal.dateOfBirth?.split('T')[0] || ''}
                                        onChange={(e) => setEditModal({ ...editModal, dateOfBirth: e.target.value })}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full border px-2 py-1 rounded"
                                        value={editModal[field]}
                                        onChange={(e) => setEditModal({ ...editModal, [field]: e.target.value })}
                                    />
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setEditModal(null)} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
                            <button onClick={handleUpdate} className="px-3 py-1 rounded bg-[var(--primary-blue)] text-white">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-[#00000090] flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4 text-red-600">Delete Confirmation</h2>
                        <p>Are you sure you want to delete {deleteModal.firstName} {deleteModal.lastName}?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setDeleteModal(null)} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
                            <button onClick={handleDelete} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientManagement;
