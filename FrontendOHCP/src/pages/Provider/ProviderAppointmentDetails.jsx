import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ProviderAppointmentDetail() {
    const { apptId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const res = await axiosInstance.get(`/api/Appointments/${apptId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAppointment(res.data);
            } catch (err) {
                console.error('Error fetching appointment:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [apptId]);

    const formatDateTime = (iso) => {
        return new Date(iso).toLocaleString("en-GB", {
            timeZone: "Asia/Ho_Chi_Minh",
            dateStyle: "full",
            timeStyle: "short"
        });
    };

    const getAge = (dob) => {
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const handleCancelAppointment = async () => {
        if (!cancelReason.trim()) {
            alert("Please provide a reason for cancellation.");
            return;
        }

        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            setCancelling(true);
            await axiosInstance.put(`/api/Appointments/${apptId}/cancel`, {
                reason: cancelReason
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert("Appointment cancelled.");
            navigate('/provider/appointments');
        } catch (err) {
            console.error("Cancellation failed:", err);
            alert("Failed to cancel appointment.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading appointment...</div>;
    if (!appointment) return <div className="p-8 text-red-500">Appointment not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-[var(--primary-blue)] mb-6">
                    Appointment Details
                </h2>

                <div className="mb-4">
                    <p><span className="font-semibold">Date & Time:</span> {formatDateTime(appointment.appointmentTime)}</p>
                    <p><span className="font-semibold">Mode:</span> {appointment.mode}</p>
                    <p><span className="font-semibold">Care Option:</span> {appointment.careOption}</p>
                    <p><span className="font-semibold">Status:</span> <span className="capitalize">{appointment.status}</span></p>
                    <p><span className="font-semibold">Created At:</span> {formatDateTime(appointment.createdAt)}</p>
                </div>

                <hr className="my-4" />

                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Patient Information</h3>
                    <p><span className="font-semibold">Name:</span> {appointment.patient?.fullName}</p>
                    <p><span className="font-semibold">Email:</span> {appointment.patient?.email}</p>
                    <p><span className="font-semibold">Gender:</span> {appointment.patient?.gender}</p>
                    <p><span className="font-semibold">Age:</span> {getAge(appointment.patient?.dateOfBirth)}</p>
                    <p><span className="font-semibold">Date of Birth:</span> {new Date(appointment.patient?.dateOfBirth).toLocaleDateString('en-GB')}</p>
                </div>

                <div className="mt-8 flex justify-between">
                    <Link
                        to="/provider/appointments"
                        className="bg-[var(--primary-blue)] text-white px-4 py-2 rounded hover:bg-[var(--dark-blue)] transition"
                    >
                        Back to Appointments
                    </Link>
                    {appointment.status !== 'Cancelled' && (
                        <button
                            onClick={() => setShowCancelForm(!showCancelForm)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            {showCancelForm ? "Close Cancellation Form" : "Cancel Appointment"}
                        </button>
                    )}
                </div>
                
                {showCancelForm && (
                    <div className="mt-4">
                        <label className="block mb-2 font-semibold">Reason for cancellation:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="4"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="E.g., patient not available, provider emergency, etc."
                        />
                        <button
                            onClick={handleCancelAppointment}
                            disabled={cancelling}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            {cancelling ? "Cancelling..." : "Confirm Cancel"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProviderAppointmentDetail;
