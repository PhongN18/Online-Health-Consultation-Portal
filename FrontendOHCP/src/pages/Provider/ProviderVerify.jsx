import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ProviderVerify() {
    const location = useLocation();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [qualification, setQualification] = useState('');
    const [experienceYears, setExperienceYears] = useState('');

    console.log(location);

    useEffect(() => {
        if (!location.state || !location.state.userId) {
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleCompleteProfile = async (e) => {
        e.preventDefault();

        const isoDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
        const isValidDate = !isNaN(Date.parse(isoDob));
        if (!isValidDate) {
            alert("Invalid date of birth format.");
            return;
        }

        const userId = location.state.userId;

        try {
            await axiosInstance.put(`/api/Users/${userId}`, {
                firstName,
                lastName,
                gender,
                dateOfBirth: isoDob,
            });

            await axiosInstance.post(`/api/DoctorProfiles`, {
                userId,
                specialization,
                qualification,
                experienceYears: parseInt(experienceYears)
            });

            navigate('/provider/home');
        } catch (error) {
            console.error('Error completing profile:', error);
            alert('Failed to complete profile. Please try again.');
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="w-full text-[var(--primary-blue)] font-bold text-4xl h-16 leading-16 absolute flex justify-center border-b-1 border-gray-200">
                <div className='w-full text-center'>OHCP</div>
            </div>
            <div className='w-full min-h-screen bg-cover bg-center py-20 flex justify-center'>
                <div className='w-full flex justify-center'>
                    <div className='bg-white rounded-3xl px-12 py-8 w-1/2'>
                        <h3 className='text-3xl font-bold text-[#343a40]'>Verify your doctor profile</h3>
                        <p className='text-[#343a40] font-semibold mb-10'>Please fill out the details below to complete your application.</p>
                        <form onSubmit={handleCompleteProfile} className='mb-10'>
                            <div className="mt-4 grid grid-cols-2 gap-x-2">
                                <div>
                                    <label className="text-[#6f777f]">First Name</label>
                                    <input type="text" className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setFirstName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[#6f777f]">Last Name</label>
                                    <input type="text" className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-[#6f777f]">Date of Birth</label>
                                <div className='flex gap-2 items-center'>
                                    <input type="text" placeholder="DD" className="bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setDobDay(e.target.value)} />
                                    /
                                    <input type="text" placeholder="MM" className="bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setDobMonth(e.target.value)} />
                                    /
                                    <input type="text" placeholder="YYYY" className="bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setDobYear(e.target.value)} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-[#6f777f]">Gender</label>
                                <div className="grid grid-cols-2 mt-2 gap-4" role="radiogroup">
                                    {['Female', 'Male'].map(g => (
                                        <div key={g} role="radio" aria-checked={gender === g}
                                            onClick={() => setGender(g)}
                                            className={`text-center font-bold px-6 py-2 rounded-lg cursor-pointer border-1
                                            ${gender === g
                                                ? 'bg-[var(--primary-blue)] text-white border-[var(--primary-blue)]'
                                                : 'text-[#6f777f] border-[#6f777f] hover:border-[var(--dark-blue)] hover:text-[var(--dark-blue)]'}`}>
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="text-[#6f777f]">Specialization</label>
                                <input type="text" className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setSpecialization(e.target.value)} />
                            </div>

                            <div className="mt-4">
                                <label className="text-[#6f777f]">Qualification</label>
                                <input type="text" className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setQualification(e.target.value)} />
                            </div>

                            <div className="mt-4">
                                <label className="text-[#6f777f]">Years of Experience</label>
                                <input type="number" min="0" className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]" required onChange={e => setExperienceYears(e.target.value)} />
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className='mt-6 font-bold text-white bg-[var(--primary-blue)] py-3 px-10 rounded-4xl hover:bg-[var(--dark-blue)]'>
                                    Submit Profile
                                </button>
                            </div>
                        </form>
                        <div>
                            <h3 className='font-bold text-lg'>Your information is secure</h3>
                            <p>We verify identity and licensure of every doctor on OHCP. Your personal and professional information is confidential and secure with us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tailwind helper styles (you can extract to CSS)
const formInputStyle = "bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]";
const dobInputStyle = "bg-[#f1f3f5] w-12 h-12 mt-2 text-center p-2 rounded shadow-[inset_0_-1px_0_0_#6c747c] focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]";

export default ProviderVerify;
