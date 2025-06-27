import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function DoctorProfile() {
    const { id } = useParams(); // id = doctorProfileId
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDoctor() {
            try {
                const res = await axiosInstance.get(`/api/DoctorProfiles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDoctor(res.data);
            } catch (err) {
                console.error("Failed to fetch doctor profile:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDoctor();
    }, [id]);

    if (loading) return <div className="p-8 text-gray-500">Loading doctor info...</div>;
    if (!doctor) return <div className="p-8 text-red-500">Doctor not found.</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto bg-white shadow rounded-lg">
            <h2 className="text-3xl font-semibold text-[var(--primary-blue)] mb-2">
                Dr. {doctor.user?.firstName} {doctor.user?.lastName}
            </h2>
            <p className="text-lg text-gray-700 mb-4">{doctor.specialization}</p>

            <div className="space-y-2 text-gray-600">
                {doctor.qualification && <p><strong>Qualification:</strong> {doctor.qualification}</p>}
                {doctor.experienceYears !== null && <p><strong>Experience:</strong> {doctor.experienceYears} years</p>}
                {doctor.rating !== null && <p><strong>Rating:</strong> ⭐ {doctor.rating}</p>}
                {doctor.user?.gender && <p><strong>Gender:</strong> {doctor.user.gender}</p>}
                {doctor.user?.email && <p><strong>Email:</strong> {doctor.user.email}</p>}
                {doctor.user?.dateOfBirth && (
                    <p>
                        <strong>Date of Birth:</strong>{' '}
                        {new Date(doctor.user.dateOfBirth).toLocaleDateString('en-GB')}
                    </p>
                )}
            </div>

            <button className="mt-6 bg-[var(--primary-blue)] text-white px-4 py-2 rounded hover:bg-[var(--dark-blue)]">
                Book an Appointment
            </button>
        </div>
    );
}

export default DoctorProfile;
