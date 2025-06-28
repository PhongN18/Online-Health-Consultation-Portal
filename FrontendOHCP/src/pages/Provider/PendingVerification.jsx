import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../assets/Auth/bg1.jpg';
import bg2 from '../../assets/Auth/bg2.jpg';
import bg3 from '../../assets/Auth/bg3.jpg';
import bg4 from '../../assets/Auth/bg4.jpg';
import bg5 from '../../assets/Auth/bg5.jpg';

const PendingVerification = () => {
    const navigate = useNavigate();
    const [bgImage, setBgImage] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const images = [bg1, bg2, bg3, bg4, bg5];
        const randomIndex = Math.floor(Math.random() * images.length);
        setBgImage(images[randomIndex]);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/auth/provider/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                if (data.doctorProfile.verified) navigate('/provider/home')
                setProfile(data);
                
            } catch (err) {
                setError(err.message || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="w-[1000px] p-6 rounded-2xl shadow-lg bg-white flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 text-[var(--primary-blue)]">Profile Under Review</h1>
                <p className="mb-4 text-gray-700">
                    Your doctor profile is currently awaiting verification by our admin team.
                    You will receive full access once your profile is approved.
                </p>
                <p className="mb-6 text-sm text-gray-500">
                    Please check back later or contact support if this takes too long.
                </p>

                <div className="flex gap-4 mb-4">
                    <button
                        className='bg-[var(--primary-blue)] cursor-pointer text-white px-4 py-2 rounded-2xl hover:bg-[var(--dark-blue)]'
                        onClick={() => setShowProfile(!showProfile)} disabled={loading || !!error}>
                        {showProfile ? 'Hide Profile' : 'View Your Profile'}
                    </button>
                    <button variant="outline" onClick={handleLogout} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-2xl hover:bg-red-600">
                        Logout
                    </button>
                </div>

                {showProfile && profile && (
                    <div className="w-full text-left bg-gray-50 rounded-lg py-4 px-8 shadow-inner">
                        <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
                        <div className="grid grid-cols-2">
                            <div className="">
                                    <p><strong>Name:</strong> Dr. {profile.firstName} {profile.lastName}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                    <p>
                                        <strong>Date of Birth:</strong>{' '}
                                        {profile.dateOfBirth
                                            ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB')
                                            : 'N/A'}
                                    </p>
                                    <p><strong>Specialization:</strong> {profile.doctorProfile.specialization}</p>
                                    <p><strong>Qualification:</strong> {profile.doctorProfile.qualification || 'N/A'}</p>
                                    <p><strong>Years of Experience:</strong> {profile.doctorProfile.experienceYears || 'N/A'}</p>
                            </div>
                            {profile.doctorProfile.careOptions && profile.doctorProfile.careOptions.length > 0 && (
                                <div className="">
                                    <p className="font-semibold">Care Options:</p>
                                    <ul className="text-gray-700 mt-1">
                                        {profile.doctorProfile.careOptions.map((option, index) => (
                                            <li key={index}>
                                                {option.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingVerification;
