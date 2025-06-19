import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function ProviderHeader({ onLogout }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    return (
        <header className="bg-[var(--primary-blue)] text-white px-6 py-4 shadow flex justify-center items-center">
            <div className="w-[1000px]  flex justify-between">
                <div className="text-3xl font-bold">
                    <Link to="/provider/home">OHCP</Link>
                </div>

                <nav className="flex gap-6 items-center">
                    <Link to="/provider/home" className="hover:underline">Dashboard</Link>
                    <Link to="/provider/schedule" className="hover:underline">Schedule</Link>
                    <Link to="/provider/appointments" className="hover:underline">Appointments</Link>
                    <Link to="/provider/profile" className="hover:underline">Profile</Link>
                    <div className="border-l border-white h-6 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">
                            Dr. {user?.firstName ?? ''} {user?.lastName ?? ''}
                        </span>
                        <button
                            onClick={onLogout}
                            className="ml-3 px-3 py-1 bg-white text-[var(--primary-blue)] rounded hover:bg-gray-100 font-semibold text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default ProviderHeader;
