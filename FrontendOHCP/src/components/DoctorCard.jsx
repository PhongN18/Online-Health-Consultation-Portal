
function DoctorCard({ doctor }) {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            <p className="text-sm text-gray-500">Click to view profile</p>
        </div>
    );
}

export default DoctorCard;
