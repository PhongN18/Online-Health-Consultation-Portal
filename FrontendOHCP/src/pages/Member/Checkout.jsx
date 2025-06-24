import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import doctor1 from '../../assets/Home/doctor1.png';
import { UserContext } from '../../contexts/UserContext';
import axiosInstance from '../../utils/axios';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: patient, loading: userLoading } = useContext(UserContext);
    const { doctor, selectedTime, selectedDate, selectedDateISO, careOption } = location.state || {};

    useEffect(() => {
        if (!doctor || !selectedTime || !selectedDate) {
            navigate('/member/choose-doctor', { state: { careOption } });
        }
    }, []);

    const getAge = (dobString) => {
        const dob = new Date(dobString);
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const [hour, minute] = selectedTime.split(':');
            const appointmentDate = new Date(selectedDateISO);
            appointmentDate.setHours(parseInt(hour), parseInt(minute), 0);

            const res = await axiosInstance.post('/api/Appointments', {
                patientId: patient.userId,
                doctorId: doctor?.userId,
                appointmentTime: appointmentDate.toISOString(),
                careOption,
                notes: 'Created from checkout'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200 || res.status === 201) {
                alert('Appointment booked successfully!');
                navigate('/member/appointments');
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Booking failed. Please try again.');
        }
    };

    if (userLoading) return <div>Loading user info...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8 flex flex-col justify-center items-center">
                <div className='relative w-full'>
                    <Link to='/member/home' className='absolute top-[20%] left-0 text-[#6c747c] hover:underline'>Back</Link>
                    <h4 className='w-full text-center text-3xl font-semibold'>Checkout</h4>
                </div>
                <div className="w-full bg-white rounded-2xl p-10 mt-8 grid grid-cols-2 gap-8">
                    <div>
                        <p className='font-semibold text-lg mb-2'>Visit details</p>
                        <div className="flex flex-col gap-2">
                            {/* Doctor Card */}
                            <div className="border-1 border-[#e9ecef] rounded-2xl p-4 flex gap-3">
                                <div className="w-20 h-20 rounded bg-blue-100 overflow-hidden">
                                    <img src={doctor1} className='object-cover w-full h-full scale-110' />
                                </div>
                                <div className="flex flex-col justify-between">
                                    <p className='text-[var(--primary-blue)] font-bold text-lg'>
                                        Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}
                                    </p>
                                    <p className='text-xs text-red-400'>
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i < Math.round(doctor?.rating ?? 4.5) ? 'text-red-400' : 'text-gray-300'}`} />
                                        ))} {doctor?.rating ?? 4.5}
                                        <span className='ml-2 text-[#6c747c]'>Reviews</span>
                                    </p>
                                    <p className='text-sm text-[#6c747c]'>
                                        {doctor?.specialization}
                                        <i className="text-[4px] fa-solid fa-circle mx-1 transform-[translateY(-100%)]"></i>
                                        {doctor?.experienceYears}-year expertise
                                        <i className="text-[4px] fa-solid fa-circle mx-1 transform-[translateY(-100%)]"></i>
                                        {doctor?.user?.gender?.charAt(0).toUpperCase() + doctor?.user?.gender?.slice(1)}
                                    </p>
                                </div>
                            </div>

                            {/* Patient Card */}
                            <div className="border-1 border-[#e9ecef] rounded-2xl p-4 flex gap-3">
                                <div className="w-20 h-20 rounded bg-blue-100 overflow-hidden">
                                    <img src={doctor1} className='object-cover w-full h-full scale-110' />
                                </div>
                                <div className="flex flex-col justify-around">
                                    <p className='text-[var(--primary-blue)] font-bold text-lg'>
                                        {patient?.firstName} {patient?.lastName}
                                    </p>
                                    <p className='text-sm text-[#6c747c]'>
                                        {patient?.gender}
                                        <i className="text-[4px] fa-solid fa-circle mx-1 transform-[translateY(-100%)]"></i>
                                        {patient?.dateOfBirth && `${getAge(patient.dateOfBirth)} years old`}
                                        <i className="text-[4px] fa-solid fa-circle mx-1 transform-[translateY(-100%)]"></i>
                                        {patient?.dateOfBirth && new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-green-100 pl-4 py-2 rounded-xl">
                                Patient needs to be on camera to receive care.
                            </div>
                        </div>
                    </div>

                    {/* Billing */}
                    <div>
                        <p className='font-semibold text-lg mb-2'>Billing details</p>
                        <div className="bg-[#e9ecef] rounded-t-2xl p-4 flex flex-col gap-3">
                            <div className="w-full border-b-1 border-gray-300 pb-4">
                                <div className="flex justify-between w-full font-bold">
                                    <div className=''>Primary Care visit fee</div>
                                    <div className=''>$44</div>
                                </div>
                                <p className='text-sm text-gray-500'>
                                    With Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}<br />
                                    {selectedDate}, {selectedTime} (GMT+7)
                                </p>
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between w-full font-bold">
                                    <div className=''>Membership fee</div>
                                    <div className=''>$55</div>
                                </div>
                                <p className='text-sm text-gray-500'>Next charge on...</p>
                            </div>
                        </div>
                        <div className=" bg-[#b2c7e6] rounded-b-2xl p-4">
                            <div className="flex justify-between w-full font-bold">
                                <div className=''>Total</div>
                                <div className=''>$99</div>
                            </div>
                        </div>

                        <button onClick={handleCheckout} className="mt-6 bg-[var(--primary-blue)] text-white font-bold w-full py-3 rounded-3xl">
                            Confirm payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
