import { Link, useNavigate } from 'react-router-dom';
import PrimaryCare from '../../assets/MemberHome/PrimaryCare.jpg';

function ChooseDoctor() {

    const navigate = useNavigate();

    const handleSeeAvailability = () =>  {
        navigate('/member/schedule-appointment')
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8">
                <div className=''>
                    <h3 className="text-[#343a40] text-3xl mb-8 font-semibold">Choose your doctor</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white shadow-md flex flex-col rounded-lg overflow-hidden">
                            <div className="w-full h-40">
                                <div className="overflow-hidden h-full w-full flex-shrink-0">
                                    <img src={PrimaryCare} alt="" className="h-full w-full" />
                                </div>
                            </div>
                            <div className="p-4">
                                <p className='text-xs'><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /> 4.9 <span className='ml-2 text-[#6c747c]'>4K reviews</span></p>
                                <Link to='/doctor/doctorId' className='hover:underline text-[var(--primary-blue)] my-2 font-semibold text-xl'>Dr. Gloria Fong</Link>
                                <p className='text-sm text-[#6c747c]'>Primary Care <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> 44-year expertise <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> Female</p>
                                <div className='flex flex-wrap gap-2 mt-2 text-[#6c747c] text-sm'>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-star" /> Popular</span>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-comment"></i> Responsive by text</span>
                                </div>
                                <div className='bg-gray-100 flex justify-between rounded p-2 text-sm font-semibold my-4'>
                                    <span>Next available</span>
                                    <span>Jun 13 at 11:00</span>
                                </div>
                                <button onClick={handleSeeAvailability} className='text-sm bg-[var(--primary-blue)] cursor-pointer hover:bg-[var(--primary-dark)] w-full py-2 text-white font-semibold rounded-3xl'>See full availability</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseDoctor;
