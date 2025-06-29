import { UserContext } from "@/contexts/UserContext";
import axiosInstance from "@/utils/axios";
import { useContext, useEffect, useState } from "react";

export default function MemberMedicalRecordsPage() {
    const { user } = useContext(UserContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.userId) return;

        async function fetchMedicalRecords() {
            try {
                const token = localStorage.getItem("token");
                const res = await axiosInstance.get(`/api/medicalrecords/member/${user.userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setRecords(res.data);
            } catch (err) {
                console.error("Error fetching medical records:", err);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMedicalRecords();
    }, [user?.userId]);

    return (
        <div className="min-h-screen p-6 bg-[#f8f9fa] flex justify-center">
            <div className="w-[1000px]">
                <h2 className="text-3xl font-semibold mb-6">My Medical Records</h2>
                {loading ? (
                    <div className="text-gray-500">Loading medical records...</div>
                ) : records.length === 0 ? (
                    <div className="text-gray-500">No medical records found.</div>
                ) : (
                    <div className="space-y-4">
                        {records.map(record => (
                            <div
                                key={record.recordId}
                                className="border p-4 rounded-md shadow-sm bg-white"
                            >
                            <div><strong>Type:</strong> {record.recordType}</div>
                            <div><strong>Doctor:</strong> {record.doctorName}</div>
                            <div><strong>Description:</strong> {record.description || "N/A"}</div>
                            <div><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
