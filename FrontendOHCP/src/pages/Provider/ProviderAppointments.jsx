import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import axiosInstance from '../../utils/axios';

const timeSlots = ['08:00', '10:30', '14:00', '16:30', '20:30'];

function ProviderAppointments() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const [appointments, setAppointments] = useState([]);

    const days = Array.from({ length: 8 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Normalize to 00:00
    });

    useEffect(() => {
        if (!user?.userId) return;

        const fetchAppointments = async () => {
            try {
                const res = await axiosInstance.get(`/api/appointments/doctor/${user.userId}`);
                const now = new Date();
                const end = new Date();
                now.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() + 8);

                const filtered = res.data.upcoming.filter(appt => {
                    const apptTime = new Date(appt.appointmentTime + "Z");
                    return apptTime >= now && apptTime <= end;
                });
                
                setAppointments(filtered);
            } catch (err) {
                console.error('Failed to fetch appointments:', err);
            }
        };

        fetchAppointments();
    }, [user, location.key]);

    const getAppointment = (date, time) => {
        const [hour, minute] = time.split(':');
        const localDate = new Date(date);
        localDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

        return appointments.find(appt => {
            const apptUTC = new Date(appt.appointmentTime + "Z");
            const localUTC = new Date(localDate.toISOString());
            return apptUTC.getTime() === localUTC.getTime();
        });
    };

    const formatDate = (date) => {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Thursday"
        const day = date.getDate();   // 19
        const month = date.getMonth() + 1; // 6 (months are 0-indexed)

        const shortDate = `${day}/${month}`;

        return { weekday, shortDate };
    };


    const getAge = (dobString) => {
        const dob = new Date(dobString);
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const getCellStyle = (appt) => {

        const now = new Date()
        const apptTime = new Date(appt.appointmentTime + "Z")
        if (apptTime < now) return 'bg-gray-300 text-gray-600'

        switch (appt.status) {
            case 'Scheduled': return 'bg-green-200 text-green-800';
            case 'Pending': return 'bg-yellow-200 text-yellow-800';
            case 'Cancelled': return 'bg-gray-300 text-gray-600 line-through';
            default: return '';
        }
    };

    console.log(appointments)

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-gray-800 mb-6 w-[1000px]">My Appointments</div>
                <div className="overflow-auto w-[1200px]">
                    <table className="min-w-full table-fixed border border-gray-300">
                        <thead>
                            <tr>
                                <th className="w-32 h-24 bg-[var(--primary-blue)] text-left text-white p-2 border-b border-r"></th>
                                {days.map((day, i) => {
                                    const { weekday, shortDate } = formatDate(day);
                                    return (
                                        <th
                                            key={i}
                                            className="w-32 h-24 text-center bg-[var(--primary-blue)] text-white border-b border-r p-2 text-sm font-semibold"
                                        >
                                            {weekday} <br /> <span className="text-xs">{shortDate}</span>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map((slot, i) => (
                                <tr key={i}>
                                    <td className="w-32 h-24 text-sm font-medium bg-[var(--primary-blue)] text-white text-center border-r border-b p-2">
                                    {slot}
                                    </td>
                                    {days.map((day, j) => {
                                    const appt = getAppointment(day, slot);
                                    return (
                                        <td
                                            key={j}
                                            className={`w-32 h-24 border-b border-r p-2 text-sm text-center align-middle ${
                                                appt ? getCellStyle(appt) : ''
                                            }`}
                                        >
                                        {appt ? (
                                            <>
                                                <p className="text-sm">{appt.careOption}</p>
                                                <p className="font-semibold">
                                                    {appt.patient?.fullName || 'N/A'}
                                                </p>
                                                <p className="text-xs">
                                                    {appt.patient.gender} - {getAge(appt.patient.dateOfBirth)}{' '}
                                                    years old
                                                </p>
                                                <p className="text-xs capitalize">{appt.status}</p>
                                            </>
                                        ) : (
                                            <span className="text-gray-300">-</span>
                                        )}
                                        </td>
                                    );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProviderAppointments;
