import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

function ProviderHome() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading your dashboard...</div>;
    }

    return (
        <div className="p-10 bg-gray-50 min-h-screen flex justify-center">
            <div className="w-[1000px]">
                <h1 className="text-3xl font-bold text-[var(--primary-blue)] mb-6">
                    Welcome back, Dr. {user?.firstName} {user?.lastName}
                </h1>

                {/* Dashboard Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                        <p className="text-sm text-gray-500">Today's Appointments</p>
                        <p className="text-2xl font-bold text-[var(--primary-blue)]">3</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                        <p className="text-sm text-gray-500">Patients Seen This Week</p>
                        <p className="text-2xl font-bold text-[var(--primary-blue)]">12</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                        <p className="text-sm text-gray-500">Upcoming Schedule</p>
                        <p className="text-2xl font-bold text-[var(--primary-blue)]">5 Slots</p>
                    </div>
                </div>

                {/* Upcoming Appointments Placeholder */}
                <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Appointments</h2>
                    <div className="text-gray-500">You have no appointments scheduled yet.</div>
                </div>
            </div>
        </div>
    );
}

export default ProviderHome;
