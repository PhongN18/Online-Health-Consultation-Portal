import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext';
import axiosInstance from "../../utils/axios";

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const { user, loading: userLoading } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user || userLoading) return;

            try {
                const res = await axiosInstance.get(`/api/appointments/member/${user.userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setAppointments(res.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user, userLoading]);

    if (userLoading || loading) return <div>Loading appointments...</div>;
    if (!user) return <div>User not logged in.</div>;

    return (
        <div className="min-h-screen p-6 bg-[#f8f9fa] flex justify-center">
            <div className="w-[1000px]">
                <h3 className="text-3xl font-semibold mb-6">
                    Your Appointments
                </h3>

                {appointments.length === 0 ? (
                    <p className="text-gray-500">You have no appointments scheduled.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.appointmentId}
                                className="bg-white rounded-2xl shadow-md p-4 flex gap-4 items-center"
                                onClick={() => navigate(`/member/appointment/${appointment.appointmentId}`)}
                            >
                                {/* Doctor Image */}
                                <div className="w-20 h-20 flex-shrink-0 rounded-full bg-blue-100 overflow-hidden">
                                    <img
                                        src="/default-avatar.png" // replace with doctor.img if you have it
                                        alt="Doctor"
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Appointment Info */}
                                <div className="flex flex-col justify-between flex-grow">
                                    <h2 className="text-lg font-semibold text-[var(--primary-blue)]">
                                        Dr. {appointment.doctor.fullName}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {appointment.careOption}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <i className="fa-regular fa-clock mr-1"></i>
                                        {new Date(appointment.appointmentTime + "Z")
                                            .toLocaleString("en-GB", {
                                                timeZone: "Asia/Ho_Chi_Minh",
                                                hour12: false,
                                            })}
                                    </p>
                                    <div className="text-sm mt-1 flex gap-3 text-gray-600">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {appointment.mode}
                                        </span>
                                        <span className={`px-2 py-1 rounded ${
                                            appointment.status === "Scheduled"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Appointment;
