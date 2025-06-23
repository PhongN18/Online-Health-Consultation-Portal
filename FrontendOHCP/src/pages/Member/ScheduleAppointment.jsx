import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ScheduleAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { careOption, doctorId, userId } = location.state;

    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const timeSlots = ['08:00', '10:30', '14:00', '16:30', '20:30'];

    const getNext7Days = () => {
        const days = [];
        const options = { weekday: 'short', month: 'short', day: 'numeric' };

        for (let i = 1; i < 8; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(7,0,0,0) // GMT + 7
            console.log(date)
            const label = date.toLocaleDateString('en-US', options);
            const iso = date.toISOString().split('T')[0];
            
            days.push({ label, iso });
        }

        return days;
    };

    const upcomingDays = getNext7Days();

    useEffect(() => {
        if (!doctorId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [doctorRes, apptRes] = await Promise.all([
                    axiosInstance.get(`/api/DoctorProfiles/${doctorId}`),
                    axiosInstance.get(`/api/appointments/doctor/${userId}`)
                ]);

                console.log(doctorRes, apptRes)

                setDoctor(doctorRes.data);
                setAppointments(apptRes.data.upcoming || []);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.key, doctorId, userId]);

    const handleSelectSlot = (time, label, isoDate) => {
        navigate('/member/checkout', {
            state: {
                doctor,
                selectedTime: time,
                selectedDate: label,
                selectedDateISO: isoDate,
                careOption
            }
        });
    };

    const isSlotReserved = (dateISO, timeStr) => {
        return appointments.some((appt) => {
            const apptDateUTC = new Date(appt.appointmentTime + "Z");
            const [hour, minute] = timeStr.split(':').map(Number);
            const [year, month, day] = dateISO.split('-').map(Number);
            const localDate = new Date(year, month - 1, day, hour, minute);
            return apptDateUTC.getTime() === localDate.getTime();
        });
    };

    if (loading) return <div className="p-10 text-gray-500">Loading doctor...</div>;
    if (!doctor) return <div className="p-10 text-red-500">Doctor not found.</div>;

    const fullName = `Dr. ${doctor.user?.firstName} ${doctor.user?.lastName}`;
    const gender = doctor.user?.gender ?? 'N/A';
    const experience = doctor.experienceYears ?? 0;
    const specialization = doctor.specialization ?? 'General';
    const rating = doctor.rating ?? 4.5;

    console.log(upcomingDays)

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8 flex flex-col justify-center items-center">
                <div className="relative w-full">
                    <Link to="/member/home" className="absolute top-[20%] left-0 text-[#6c747c] hover:underline">Back</Link>
                    <h4 className="w-full text-center text-3xl font-semibold">Available appointments</h4>
                </div>

                <div className="w-[750px] bg-white rounded-2xl p-4 mt-8">
                    <div className="border border-[#e9ecef] rounded-2xl p-4 flex gap-3">
                        <div className="w-20 h-20 rounded bg-blue-100 overflow-hidden">
                            <img
                                src="/default-avatar.png"
                                className="object-cover w-full h-full scale-110"
                                alt="Doctor"
                            />
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-[var(--primary-blue)] font-bold text-lg">{fullName}</p>
                            <p className="text-xs text-red-400">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`fa-solid fa-star ${i < Math.round(rating) ? 'text-red-400' : 'text-gray-300'}`}
                                    />
                                ))} {rating.toFixed(1)} <span className="ml-2 text-[#6c747c]">4K reviews</span>
                            </p>
                            <p className="text-sm text-[#6c747c]">
                                {specialization}
                                <i className="fa-solid fa-circle text-[4px] mx-1" />
                                {experience}-year expertise
                                <i className="fa-solid fa-circle text-[4px] mx-1" />
                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </p>
                        </div>
                    </div>

                    {upcomingDays.map((day) => (
                        <div key={day.iso} className="mt-6">
                            <p className="mb-4 font-semibold">{day.label}</p>
                            <div className="flex flex-wrap gap-2">
                                {timeSlots.map((slot) => {
                                    const reserved = isSlotReserved(day.iso, slot);
                                    return (
                                        <button
                                            key={slot}
                                            disabled={reserved}
                                            onClick={() => handleSelectSlot(slot, day.label, day.iso)}
                                            className={`p-4 py-2 font-semibold rounded-lg ${
                                                reserved
                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                    : 'bg-[var(--primary-blue)] text-white hover:bg-[var(--dark-blue)]'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ScheduleAppointment;
