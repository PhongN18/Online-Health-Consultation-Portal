import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard';
import axiosInstance from '../../utils/axios';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axiosInstance.get('/api/doctorprofiles', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDoctors(res.data);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">Loading doctors...</div>;

    console.log(doctors);

    return (
        <div className="min-h-screen p-8">
            <h2 className="text-2xl font-semibold mb-4">Available Doctors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doctor) => (
                    <Link key={doctor.userId} to={`/doctor/${doctor.doctorProfileId}`}>
                        <DoctorCard doctor={doctor} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DoctorList;
