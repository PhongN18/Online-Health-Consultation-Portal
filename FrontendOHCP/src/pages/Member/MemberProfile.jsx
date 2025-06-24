import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import axiosInstance from '../../utils/axios';

function MemberProfile() {
    const { user, setUser, loading } = useContext(UserContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setGender(user.gender || '');
            setDateOfBirth(user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '');
        }
    }, [user]);

    if (loading) return <div className="p-6">Loading user info...</div>;
    if (!user) return <Navigate to="/member/login" replace />;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const res = await axiosInstance.put(`/api/Users/${user.userId}`, {
                firstName,
                lastName,
                gender,
                dateOfBirth,
            });

            if (res.status === 200) {
                alert('Profile updated successfully!');
                setUser({ ...user, firstName, lastName, gender, dateOfBirth });
            }
        } catch (err) {
            console.error('Update failed:', err);
            alert('Profile update failed.');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10">
            <div className="bg-white rounded-2xl shadow-md p-8 w-[600px]">
                <h2 className="text-2xl font-bold mb-6 text-[var(--primary-blue)]">Your Profile</h2>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-600">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="mt-1 w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={updating}
                        className="mt-4 bg-[var(--primary-blue)] text-white py-2 rounded hover:bg-[var(--dark-blue)]"
                    >
                        {updating ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MemberProfile;
