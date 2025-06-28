import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PrimaryCare from '../../assets/MemberHome/PrimaryCare.jpg';
import axiosInstance from '../../utils/axios';

function ChooseDoctor() {
    const navigate = useNavigate();
    const location = useLocation();
    const [doctors, setDoctors] = useState([]);
    const { careOption } = location.state

    useEffect(() => {

        const normalizeCareOption = (option) => {
            if (!option) return null;

            if (option.includes("Wellness")) return "Wellness";

            return option.replace(/[\s,&]+/g, ''); // remove spaces, commas, ampersands
        };

        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get('/api/DoctorProfiles', {
                    params: careOption ? { careOption: normalizeCareOption(careOption) } : {}
                });
                setDoctors(response.data);
            } catch (err) {
                console.error('Failed to fetch doctors:', err);
            }
        };

        fetchDoctors();
    }, [careOption]);


    const handleSeeAvailability = (doctorId, userId) => {
        navigate(`/member/schedule-appointment`, { state: { careOption, doctorId, userId }});
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8">
                <h3 className="text-[#343a40] text-3xl mb-8 font-semibold">Choose your doctor for {careOption}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doc) => {
                        const fullName = `Dr. ${doc.user?.firstName ?? ''} ${doc.user?.lastName ?? ''}`;
                        const gender = doc.user?.gender ?? 'N/A';
                        const experience = doc.experienceYears ?? 0;
                        const specialization = doc.specialization ?? 'General Practice';
                        const rating = doc.rating ?? 4.5;
                        const userId = doc.user?.userId;
                        const doctorId = doc.doctorProfileId;

                        return (
                            <div
                                key={doc.doctorProfileId}
                                className="bg-white shadow-md flex flex-col rounded-lg overflow-hidden"
                            >
                                <div className="w-full h-40 overflow-hidden">
                                    <img src={PrimaryCare} alt={fullName} className="h-full w-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-yellow-600">
                                        {[...Array(5)].map((_, i) => (
                                            <i
                                                key={i}
                                                className={`fa-solid fa-star ${i < Math.round(rating) ? 'text-red-400' : 'text-gray-300'}`}
                                            />
                                        ))}{' '}
                                        {rating.toFixed(1)} <span className="ml-2 text-[#6c747c]"></span>
                                    </p>

                                    <Link to={`/doctor/${doctorId}`} className="hover:underline text-[var(--primary-blue)] my-2 font-semibold text-xl block">
                                        {fullName}
                                    </Link>

                                    <p className="text-sm text-[#6c747c]">
                                        {specialization}{' '}
                                        <i className="fa-solid fa-circle text-[4px] mx-1" />
                                        {experience}-year expertise{' '}
                                        <i className="fa-solid fa-circle text-[4px] mx-1" />
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2 text-[#6c747c] text-sm">
                                        <span className="bg-gray-100 px-2 py-1 rounded-2xl">
                                            <i className="fa-solid fa-star" /> Popular
                                        </span>
                                        <span className="bg-gray-100 px-2 py-1 rounded-2xl">
                                            <i className="fa-solid fa-comment" /> Responsive
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSeeAvailability(doctorId, userId)}
                                        className="text-sm bg-[var(--primary-blue)] hover:bg-[var(--primary-dark)] my-4 w-full py-2 text-white font-semibold rounded-3xl"
                                    >
                                        See full availability
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ChooseDoctor;
