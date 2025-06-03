import { Link } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

function DoctorList() {
    const doctors = [
        { id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' },
        { id: 2, name: 'Dr. Jane Smith', specialty: 'Dermatology' },
        // Add more doctors as needed
    ];

    return (
        <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Available Doctors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map(doctor => (
                    <Link key={doctor.id} to={`/doctor/${doctor.id}`}>
                        <DoctorCard doctor={doctor} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DoctorList;
