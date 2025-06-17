import { useParams } from 'react-router-dom';

function DoctorProfile() {
    const { id } = useParams();
    // You can fetch doctor details from an API using the ID, for now, we will hardcode it.
    const doctor = {
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        experience: '10 years',
        languages: 'English, Spanish',
        rating: 4.5,
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-semibold">{doctor.name}</h2>
            <p className="text-lg mb-4">{doctor.specialty}</p>
            <p className="mb-4">Experience: {doctor.experience}</p>
            <p className="mb-4">Languages: {doctor.languages}</p>
            <p className="mb-4">Rating: {doctor.rating} ★</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700">Book an Appointment</button>
        </div>
    );
}

export default DoctorProfile;
