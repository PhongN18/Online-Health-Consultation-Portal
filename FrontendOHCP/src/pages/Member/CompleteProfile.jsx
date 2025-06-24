import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bg1 from '../../assets/Auth/bg1.jpg';
import bg2 from '../../assets/Auth/bg2.jpg';
import bg3 from '../../assets/Auth/bg3.jpg';
import bg4 from '../../assets/Auth/bg4.jpg';
import bg5 from '../../assets/Auth/bg5.jpg';
import axiosInstance from '../../utils/axios';

function CompleteProfile() {

    const location = useLocation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');
    const [bgImage, setBgImage] = useState(null);
    const navigate = useNavigate();
    const { refetchUser } = useContext(UserContext)
    
    useEffect(() => {
        const images = [bg1, bg2, bg3, bg4, bg5];
        const randomIndex = Math.floor(Math.random() * images.length);
        setBgImage(images[randomIndex]);
    }, []);

    useEffect(() => {
        if (!location.state || !location.state.userId) {
            // If there's no userId, redirect to home or login page
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleCompleteProfile = async (e) => {
        e.preventDefault();

        const dobString = `${dobDay.padStart(2, '0')}/${dobMonth.padStart(2, '0')}/${dobYear}`;
        const isoDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

        // Optional: validate the constructed date
        const isValidDate = !isNaN(Date.parse(isoDob));
        if (!isValidDate) {
            alert("Invalid date of birth format.");
            return;
        }

        try {
            const response = await axiosInstance.put(`/api/Users/${location.state.userId}`, {
                firstName,
                lastName,
                gender,
                dateOfBirth: isoDob,
            });

            if (response.status === 200) {
                await refetchUser()
                navigate('/member/home'); // Redirect to the dashboard
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            alert('Profile update failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="w-full bg-[var(--dark-blue)] text-white font-bold text-4xl h-16 leading-16 absolute flex justify-center">
                <div className='w-full text-center pl-0 md:pl-32 md:text-left'><Link to='/'>OHCP</Link></div>
            </div>
            <div className='w-full h-screen bg-cover bg-center pt-40 flex justify-center' style={{backgroundImage: `url(${bgImage})`}}>
                <div className='w-full h-3/4 flex justify-center pl-0 md:pl-32 md:justify-start'>
                    <div className='bg-white rounded-3xl px-12 py-8 w-1/2'>
                        <h3 className='text-2xl font-semibold text-[#343a40]'>Complete you profile</h3>
                        <p className='text-[#6f777f]'>We need the details of the main person responsible for this account.</p>
                        <form action="">
                            <div className="mt-4 grid grid-cols-2 gap-x-2">
                                <div className="mt-4">
                                    <label htmlFor="firstName" className="text-[#6f777f]">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="lastName" className="text-[#6f777f]">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="dob" className="text-[#6f777f]">Date of Birth</label><br />
                                <div className='flex gap-2 items-center'>
                                    <input
                                        type="text"
                                        id="d_dob"
                                        placeholder="DD"
                                        className="bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                        onChange={(e) => setDobDay(e.target.value)}

                                    />
                                    /
                                    <input
                                        type="text"
                                        id="m_dob"
                                        placeholder="MM"
                                        className="bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                        onChange={(e) => setDobMonth(e.target.value)}
                                    />
                                    /
                                    <input
                                        type="text"
                                        id="y_dob"
                                        placeholder="YYYY"
                                        className="bg-[#f1f3f5] w-16 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                        onChange={(e) => setDobYear(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-[#6f777f]">Biological gender</label>
                                <div className="">
                                    <div className="grid grid-cols-2 mt-2 gap-4" role="radiogroup">
                                        {['Female', 'Male'].map((g) => (
                                            <div
                                                key={g}
                                                role="radio"
                                                aria-checked={gender === g}
                                                onClick={() => setGender(g)}
                                                className={`text-center font-bold px-6 py-2 rounded-lg cursor-pointer border-1
                                                    ${gender === g
                                                        ? 'bg-[var(--primary-blue)] text-white border-[var(--primary-blue)]'
                                                        : 'text-[#6f777f] border-[#6f777f] hover:border-[var(--dark-blue)] hover:text-[var(--dark-blue)]'}
                                                `}
                                                tabIndex="0"
                                            >
                                                {g}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <button onClick={handleCompleteProfile} className='font-bold text-white bg-[var(--primary-blue)] w-full py-3 rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompleteProfile;
