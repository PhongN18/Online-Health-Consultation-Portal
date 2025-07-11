import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ProviderAppointmentDetail() {
    const { apptId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [showAllRecords, setShowAllRecords] = useState(false);
    const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const res = await axiosInstance.get(`/api/Appointments/${apptId}`, { headers });
                setAppointment(res.data);
                // Fetch medical records
                const mrRes = await axiosInstance.get(`/api/medicalrecords/by-appointment/${apptId}`, { headers });
                setMedicalRecords(mrRes.data);

                // Fetch prescriptions
                const presRes = await axiosInstance.get(`/api/prescriptions/by-appointment/${apptId}`, { headers });
                setPrescriptions(presRes.data);
            } catch (err) {
                console.error('Error fetching appointment:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [apptId]);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const utcPlus7 = new Date(date.getTime() + 7 * 60 * 60 * 1000); // add 7 hours
        return utcPlus7.toLocaleString("en-GB", {
            dateStyle: "full",
            timeStyle: "short",
            hour12: false,
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

        const confirm = window.confirm("Submit cancellation request for admin approval?");
        if (!confirm) return;

        try {
            setCancelling(true);
            await axiosInstance.put(`/api/Appointments/${apptId}/cancel`, {
                reason: `Request by doctor: ${cancelReason}`
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert("Cancellation request submitted.");
            setShowCancelForm(false);
            setAppointment({
                ...appointment,
                cancelReason,
                cancelApproved: null
            });
        } catch (err) {
            console.error("Cancellation failed:", err);
            alert("Failed to request cancellation.");
        } finally {
            setCancelling(false);
        }
    };

    const handleJoinConsultation = () => {
        if (!appointment?.mode || !appointment?.appointmentId) return;
        const path = appointment.mode === 'Video' ? 'video' : 'chat';
        navigate(`/provider/appointment/${path}/${appointment.appointmentId}`);
    };

    if (loading) return <div className="p-8 text-gray-500">Loading appointment...</div>;
    if (!appointment) return <div className="p-8 text-red-500">Appointment not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-3xl mx-auto mb-4">
                <Link
                    to="/provider/appointments"
                    className="text-white bg-[var(--primary-blue)] hover:bg-[var(--dark-blue)] px-4 py-2 rounded-2xl transition"
                >
                    Back to Appointments
                </Link>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-[var(--primary-blue)] mb-6">
                    Appointment Details
                </h2>

                <div className="mb-4">
                    <p><span className="font-semibold">Date & Time:</span> {formatDateTime(appointment.appointmentTime)}</p>
                    <p><span className="font-semibold">Mode:</span> {appointment.mode}</p>
                    <p><span className="font-semibold">Care Option:</span> {appointment.careOption}</p>
                    <p><span className="font-semibold">Created At:</span> {formatDateTime(appointment.createdAt)}</p>
                    <p>
                        <span className="font-semibold">Status:</span>{' '}
                        <span className="capitalize">{appointment.status}</span>
                        {appointment.cancelApproved === null && appointment.cancelReason && (
                            <span className="text-orange-600 ml-2">(Cancel request pending)</span>
                        )}
                    </p>
                    {appointment.cancelReason && (
                        <p className='bg-red-200 rounded-2xl p-2 mt-2'>
                            <span className="font-semibold">Cancel Reason:</span> {appointment.cancelReason}
                        </p>
                    )}
                </div>

                <hr className="my-4" />
                <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-700">Patient Information</h3>
                    <p className='pl-2'><span className="font-semibold">Name:</span> {appointment.patient?.fullName}</p>
                    <p className='pl-2'><span className="font-semibold">Email:</span> {appointment.patient?.email}</p>
                    <p className='pl-2'><span className="font-semibold">Gender:</span> {appointment.patient?.gender}</p>
                    <p className='pl-2'><span className="font-semibold">Age:</span> {getAge(appointment.patient?.dateOfBirth)}</p>
                    <p className='pl-2'><span className="font-semibold">Date of Birth:</span> {new Date(appointment.patient?.dateOfBirth).toLocaleDateString('en-GB')}</p>
                </div>

                <div className="mt-8 flex justify-between">
                    {appointment.status === 'Scheduled' && (appointment.mode === 'Video' || appointment.mode === 'Chat') && (
                        <button
                            onClick={handleJoinConsultation}
                            className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600 transition"
                        >
                            Join {appointment.mode === 'Video' ? 'Video Call' : 'Chat'}
                        </button>
                    )}
                    {appointment.status !== 'Cancelled' && !appointment.cancelReason && (
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

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-8 relative">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-[var(--primary-blue)]">Medical Records</h3>
                    {medicalRecords.length > 3 && (
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() => setShowAllRecords(!showAllRecords)}
                        >
                            {showAllRecords ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>

                {medicalRecords.length === 0 ? (
                    <p className="pl-2 text-gray-500">No medical records available for this appointment.</p>
                ) : (
                    <ul className="list-disc pl-6 space-y-2">
                        {medicalRecords
                            .slice(0, showAllRecords ? 10 : 3)
                            .map((rec) => (
                                <li key={rec.recordId}>
                                    <strong>{rec.recordType}</strong> — {rec.description || "No description"} <br />
                                    <span className="text-sm text-gray-500">
                                        Created: {formatDateTime(rec.createdAt)}
                                    </span>
                                </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-8 relative">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-[var(--primary-blue)]">Prescriptions</h3>
                    {prescriptions.length > 3 && (
                        <button
                            className="text-sm text-blue-500 hover:underline"
                            onClick={() => setShowAllPrescriptions(!showAllPrescriptions)}
                        >
                            {showAllPrescriptions ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>

                {prescriptions.length === 0 ? (
                    <p className="pl-2 text-gray-500">No prescriptions created for this appointment.</p>
                ) : (
                    <ul className="list-disc pl-6 space-y-2">
                        {prescriptions
                            .slice(0, showAllPrescriptions ? 10 : 3)
                            .map((p) => (
                            <li key={p.prescriptionId}>
                                <strong>Prescription #{p.prescriptionId}</strong><br />
                                <span className="text-sm text-gray-600">
                                Created: {formatDateTime(p.createdAt)}
                                </span><br />
                                <span className="text-sm text-gray-500">
                                Notes: {p.notes || "—"}<br />
                                Medications: {JSON.parse(p.medications).map((med, i) => (
                                    <div key={i}>• {med.name} — {med.dosage} ({med.frequency})</div>
                                ))}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ProviderAppointmentDetail;
