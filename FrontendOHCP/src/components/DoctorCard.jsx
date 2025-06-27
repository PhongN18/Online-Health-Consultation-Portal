function DoctorCard({ doctor }) {
    return (
        <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
            <h3 className="text-xl font-semibold text-[var(--primary-blue)]">
                Dr. {doctor.user?.firstName} {doctor.user?.lastName}
            </h3>
            <p className="text-gray-700 font-medium mb-1">{doctor.specialization}</p>
            {doctor.qualification && (
                <p className="text-sm text-gray-600">Qualification: {doctor.qualification}</p>
            )}
            {doctor.experienceYears !== null && (
                <p className="text-sm text-gray-600">Experience: {doctor.experienceYears} years</p>
            )}
            {doctor.rating !== null && (
                <p className="text-sm text-yellow-500">Rating: ⭐ {doctor.rating}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Click to view profile</p>
        </div>
    );
}

export default DoctorCard;
