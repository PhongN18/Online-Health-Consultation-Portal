import { Link, useNavigate } from 'react-router-dom';
import doctor1 from '../../assets/Home/doctor1.png';

function ScheduleAppointment() {

    const navigate = useNavigate();

    const handleSeeAvailability = () =>  {
        navigate('/member/schedule-appointment')
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8 flex flex-col justify-center items-center">
                <div className='relative w-full'>
                    <Link to='/member/choose-doctor' className='absolute top-[20%] left-0 text-[#6c747c] hover:underline'>Back</Link>
                    <h4 className='w-full text-center text-3xl font-semibold'>Available appointments</h4>
                </div>
                <div className="w-[750px] bg-white rounded-2xl p-4 mt-8">
                    <div className="border-1 border-[#e9ecef] rounded-2xl p-4 flex gap-3">
                        <div className="w-20 h-20 rounded bg-blue-100 overflow-hidden">
                            <img src={doctor1} className='object-cover w-full h-full scale-110' />
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className='text-[var(--primary-blue)] font-bold text-lg'>Dr. Gloria Fong</p>
                            <p className='text-xs'><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /> 4.9 <span className='ml-2 text-[#6c747c]'>4K reviews</span></p>
                            <p className='text-sm text-[#6c747c]'>Primary Care <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> 44-year expertise <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> Female</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleAppointment;
