import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [careOptionsList, setCareOptionsList] = useState([]);
    const [selectedCareOptions, setSelectedCareOptions] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewModal, setViewModal] = useState(null);
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);


    const [filters, setFilters] = useState({
        userId: '', firstName: '', lastName: '', email: '',
        specialization: '', dateOfBirth: '',
        gender: '', careOptions: []
    });
    const [pendingFilters, setPendingFilters] = useState({ ...filters });
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Fetch care options
    useEffect(() => {
        axiosInstance.get('/api/admin/care-options', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setCareOptionsList(res.data))
            .catch(console.error);
    }, []);

    // Fetch doctors whenever filters or page change
    useEffect(() => {
        fetchDoctors();
    }, [page, filters]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/admin/doctors', {
                params: {
                    page, pageSize,
                    ...filters,
                    careOptions: selectedCareOptions.join(",")

                },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDoctors(res.data.data);
            setTotal(res.data.totalCount);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        setFilters({ ...pendingFilters });
        setPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const toggleCareOption = (option) => {
        let updated;
        if (selectedCareOptions.includes(option)) {
            updated = selectedCareOptions.filter((o) => o !== option);
        } else {
            updated = [...selectedCareOptions, option];
        }
        setSelectedCareOptions(updated);

        // Also apply filter immediately
        const updatedFilters = {
            ...pendingFilters,
            careOptions: updated.join(",") // comma-separated for backend parsing
        };
        setPendingFilters(updatedFilters);
        setFilters(updatedFilters);
        setPage(1);
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put(`/api/admin/doctor/${editModal.userId}`, editModal, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEditModal(null);
            fetchDoctors();
        } catch (err) {
            alert("Update failed.");
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/api/admin/doctor/${deleteModal.userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDeleteModal(null);
            fetchDoctors();
        } catch (err) {
            alert("Delete failed.");
            console.error(err);
        }
    };




    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between my-8">
                <h3 className="text-3xl font-bold text-[var(--primary-blue)]">Manage Verified Doctors</h3>
                <Link to='/admin/dashboard' className='px-4 py-2 border-1 rounded-xl hover:bg-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:text-white cursor-pointer font-semibold'>Back to Dashboard</Link>
            </div>
            {/* Top filters: Gender and Care Options */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="block mb-1 font-medium">Gender</label>
                    <select
                        className="border px-3 py-1 rounded bg-white"
                        value={filters.gender}
                        onChange={e => {
                            setFilters(prev => ({ ...prev, gender: e.target.value }));
                            setPage(1);
                        }}
                    >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <div>
                        <label className="font-semibold">Filter by Care Options:</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {[
                                "PrimaryCare", "WomenHealth", "MenHealth", "ChildrenHealth", "SexualHealth",
                                "ManageCondition", "Wellness", "TravelMedicine", "SeniorHealth", "MentalHealth"
                            ].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => toggleCareOption(option)}
                                    className={`px-3 py-1 rounded hover:scale-105 transition cursor-pointer ${
                                        selectedCareOptions.includes(option) ? "bg-[var(--primary-blue)] text-white" : "bg-gray-300"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Search button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={applyFilters}
                    className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded hover:bg-[var(--dark-blue)]"
                >Search</button>
            </div>

            {/* Data table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full text-left">
                    <thead className="bg-[var(--primary-blue)] text-white">
                        <tr>
                            {['ID','First Name','Last Name','Email','Specialization','DOB','Care Options','Actions'].map(head => (
                                <th key={head} className="p-4">{head}</th>
                            ))}
                        </tr>
                        <tr className="bg-[var(--primary-blue)]">
                            {['userId','firstName','lastName','email','specialization'].map(field => (
                                <th key={field} className="px-4 pb-2">
                                    <input
                                        type="text"
                                        className="w-full border bg-white text-[var(--dark-blue)] rounded px-2 py-1"
                                        value={pendingFilters[field]}
                                        onChange={e => setPendingFilters(prev => ({ ...prev, [field]: e.target.value }))}
                                        onKeyDown={handleKeyDown}
                                    />
                                </th>
                            ))}
                            <th className="px-4 pb-2">
                                <input
                                    type="date"
                                    className="w-full border bg-white text-[var(--dark-blue)] rounded px-2 py-1"
                                    value={pendingFilters.dateOfBirth}
                                    onChange={e => setPendingFilters(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                                    onKeyDown={handleKeyDown}
                                />
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" className="text-center p-4 text-gray-500">Loading...</td></tr>
                        ) : doctors.length === 0 ? (
                            <tr><td colSpan="8" className="text-center p-4 text-gray-500">No doctors found.</td></tr>
                        ) : doctors.map(doc => (
                            <tr key={doc.userId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{doc.userId}</td>
                                <td className="px-4 py-2">{doc.firstName}</td>
                                <td className="px-4 py-2">{doc.lastName}</td>
                                <td className="px-4 py-2">{doc.email}</td>
                                <td className="px-4 py-2">{doc.specialization}</td>
                                <td className="px-4 py-2">{new Date(doc.dateOfBirth).toLocaleDateString('en-GB')}</td>
                                <td className="px-4 py-2">{doc.careOptions?.join(', ') || 'N/A'}</td>
                                <td className="px-4 py-2 relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === doc.userId ? null : doc.userId)}
                                        className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                                    ><i className="fa-solid fa-gear"></i></button>
                                    {activeDropdown === doc.userId && (
                                        <div className="absolute right-0 bg-white rounded shadow z-10">
                                            <button onClick={() => { setViewModal(doc); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-sm hover:bg-gray-100">View Profile</button>
                                            <button onClick={() => { setEditModal(doc); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-sm hover:bg-gray-100">Update</button>
                                            <button onClick={() => { setDeleteModal(doc); setActiveDropdown(null); }} className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 p-4 flex justify-end items-center">
                    <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Previous</button>
                    <span className="px-4">Page {page}</span>
                    <button disabled={page*pageSize>=total} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
                </div>

                {viewModal && (
                    <div className="fixed inset-0 bg-[#00000090] flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">Doctor Profile</h2>

                            {['userId', 'email', 'firstName', 'lastName', 'gender', 'specialization', 'dateOfBirth'].map(field => (
                                <div key={field} className="mb-2">
                                    <label className="block font-medium mb-1">
                                        {field === 'dateOfBirth' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <p className="px-2 py-1 rounded bg-gray-100">
                                        {field === 'dateOfBirth'
                                            ? new Date(viewModal.dateOfBirth).toLocaleDateString('en-GB')
                                            : viewModal[field] ?? '—'}
                                    </p>
                                </div>
                            ))}

                            <div className="mb-2">
                                <label className="block font-medium mb-1">Care Options</label>
                                <p className="px-2 py-1 rounded bg-gray-100">{viewModal.careOptions?.join(', ') || '—'}</p>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button onClick={() => setViewModal(null)} className="px-3 py-1 rounded bg-gray-300">Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {editModal && (
                    <div className="fixed inset-0 bg-[#00000090] flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow max-w-[1000px] w-full">
                            <h2 className="text-lg font-semibold mb-4">Update Doctor Info</h2>
                            <div className="grid grid-cols-3 gap-x-4">
                                {['email', 'firstName', 'lastName', 'specialization', 'dateOfBirth', 'gender'].map(field => (
                                    <div key={field} className="mb-3">
                                        <label className="block font-medium mb-1">
                                            {field === 'dateOfBirth' ? 'Date of Birth' : field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        {field === 'gender' ? (
                                            <select
                                                className="w-full border px-2 py-1 rounded"
                                                value={editModal.gender}
                                                onChange={e => setEditModal({ ...editModal, gender: e.target.value })}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        ) : field === 'dateOfBirth' ? (
                                            <input
                                                type="date"
                                                className="w-full border px-2 py-1 rounded"
                                                value={editModal.dateOfBirth?.split('T')[0] || ''}
                                                onChange={e => setEditModal({ ...editModal, dateOfBirth: e.target.value })}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full border px-2 py-1 rounded"
                                                value={editModal[field]}
                                                onChange={e => setEditModal({ ...editModal, [field]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}
                                {/* Qualification Field */}
                                <div className="mb-3">
                                    <label className="block font-medium mb-1">Qualification</label>
                                    <input
                                        type="text"
                                        className="w-full border px-2 py-1 rounded"
                                        value={editModal.qualification || ''}
                                        onChange={e => setEditModal({ ...editModal, qualification: e.target.value })}
                                    />
                                </div>

                                {/* Care Options Multi-select */}
                                <div className="mb-3 col-span-2">
                                    <label className="block font-medium mb-1">Care Options</label>
                                    <div className="flex flex-wrap gap-2">
                                        {careOptionsList.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    const current = editModal.careOptions || [];
                                                    const updated = current.includes(option)
                                                        ? current.filter(o => o !== option)
                                                        : [...current, option];
                                                    setEditModal({ ...editModal, careOptions: updated });
                                                }}
                                                className={`px-3 py-1 rounded border ${
                                                    editModal.careOptions?.includes(option)
                                                        ? "bg-[var(--primary-blue)] text-white"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setEditModal(null)} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
                                <button onClick={handleUpdate} className="px-3 py-1 rounded bg-[var(--primary-blue)] text-white">Save</button>
                            </div>
                        </div>
                    </div>
                )}

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
        </div>
    );
}

export default DoctorManagement;
