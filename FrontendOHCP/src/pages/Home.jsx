import { Link } from 'react-router-dom';
import ChildrenHealth from '../assets/Home/ChildrenHealth.svg';
import doctor1 from '../assets/Home/doctor1.png';
import ManageCondition from '../assets/Home/ManageCondition.svg';
import ManHealth from '../assets/Home/ManHealth.svg';
import MentalHealth from '../assets/Home/MentalHealth.svg';
import Prescription from '../assets/Home/Prescription.svg';
import PrimaryCare from '../assets/Home/PrimaryCare.svg';
import SeniorHealth from '../assets/Home/SeniorHealth.svg';
import SexualHealth from '../assets/Home/SexualHealth.svg';
import Wellness from '../assets/Home/Wellness.svg';
import WomanHealth from '../assets/Home/WomanHealth.svg';

function Home() {
    return (
        <div>
            {/* 1st Section */}
            <div className="min-h-screen pt-12 flex justify-center">
                <div className="w-[1280px] flex flex-col items-center text-center">
                    <h1 className="text-[var(--dark-blue)] font-bold mb-4 w-1/2">The place where doctors listen - to you</h1>
                    <p className="text-lg mb-6">Online primary care that's affordable with or without insurance.</p>
                    <div className='grid grid-cols-5 gap-x-20 gap-y-4 mb-8 '>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={PrimaryCare} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Primary Care</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={ManageCondition} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Manage Your Condition</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={MentalHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Mental & Behavioral Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={SexualHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Sexual Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={Wellness} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Wellness, Prevention & Lifestyle</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={ChildrenHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Children's Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={SeniorHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Senior's Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={WomanHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Women's Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={ManHealth} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Men's Health</p>
                        </div>
                        <div className='max-w-[100px]'>
                            <div className='overflow-hidden rounded-lg'>
                                <img src={Prescription} alt="" />
                            </div>
                            <p className='font-bold text-sm text-[var(--dark-blue)] mt-2'>Online Prescriptions</p>
                        </div>
                    </div>
                    <Link to='/member/register' className='bg-[var(--primary-blue)] text-white font-bold px-6 py-3 rounded-4xl mb-12 inline-block hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>Book a video appointment</Link>
                </div>
            </div>

            {/* 2nd Section */}
            <div className="min-h-screen pt-12 bg-gray-100 flex justify-center items-center">
                <div className='w-[1280px] flex flex-col justify-center items-center'>
                    <h1 className='text-[var(--dark-blue)] text-center font-bold mb-20'>Meet Our Online Doctors</h1>
                    <div className='grid grid-cols-2  gap-x-4'>
                        <div className='bg-white rounded-xl border-1 border-[#ccc] grid grid-cols-4 p-3 text-gray-500'>
                            <div className='bg-blue-200 rounded-xl mr-2 overflow-hidden h-44 w-32'>
                                <img className='w-full h-full object-cover transform-[translateX(-2%)] scale-[1.1]' src={doctor1} alt="" />
                            </div>
                            <div className='col-span-3 flex flex-col pl-4'>
                                <p><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /> 4.9 4K reviews</p>
                                <p className='text-[var(--primary-blue)] font-bold text-xl'>Dr. Gloria Fong</p>
                                <p>Primary Care <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> 44-year expertise <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> Female</p>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-star" /> Popular</span>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-users"></i> Accepts new patients</span>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-comment"></i> Responsive by text</span>
                                </div>
                                <p className='font-bold mt-4'><i className="fa-solid fa-video mr-2"></i>Book a video appointment</p>
                                <div className='grid grid-cols-3 gap-2 mt-2'>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='text-[var(--primary-blue)] py-1 rounded-full bg-white border-2 border-[var(--primary-blue)]'>
                                        <p className='font-bold'>See more</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-xl border-1 border-[#ccc] grid grid-cols-4 p-3 text-gray-500'>
                            <div className='bg-red-200 rounded-xl mr-2 overflow-hidden h-44 w-32'>
                                <img className='w-full h-full object-cover transform-[translateX(-2%)] scale-[1.1]' src={doctor1} alt="" />
                            </div>
                            <div className='col-span-3 flex flex-col pl-4'>
                                <p><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /> 4.9 4K reviews</p>
                                <p className='text-[var(--primary-blue)] font-bold text-xl'>Dr. Gloria Fong</p>
                                <p>Primary Care <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> 44-year expertise <i className="transform-[translateY(-100%)] text-[4px] fa-solid fa-circle"></i> Female</p>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-star" /> Popular</span>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-users"></i> Accepts new patients</span>
                                    <span className='bg-gray-100 px-2 py-1 rounded-2xl'><i className="fa-solid fa-comment"></i> Responsive by text</span>
                                </div>
                                <p className='font-bold mt-4'><i className="fa-solid fa-video mr-2"></i>Book a video appointment</p>
                                <div className='grid grid-cols-3 gap-2 mt-2'>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='bg-[var(--primary-blue)] py-1 rounded-full text-white'>
                                        <p className='text-xs'>Jun 15</p>
                                        <p className='font-bold'>08:30</p>
                                    </button>
                                    <button className='text-[var(--primary-blue)] py-1 rounded-full bg-white border-2 border-[var(--primary-blue)]'>
                                        <p className='font-bold'>See more</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className='text-[var(--primary-blue)] text-lg opacity-70 font-bold text-center mt-12 hover:underline hover:opacity-100 cursor-pointer'>See more doctors</span>
                </div>
            </div>

            {/* 3rd Section */}
            <div className='pt-12 bg-[#e2eaf6] flex justify-center'>
                <div className='w-[1280px] flex flex-col justify-center items-center'>
                    <h1 className='text-[var(--dark-blue)] text-center font-bold mb-20'>OHCP Online Doctor Visit Pricing</h1>
                    <div className='grid grid-cols-2 w-3/4 gap-4 pb-12'>
                        <div className='bg-white px-10 py-4 w-full rounded-3xl flex flex-col justify-center items-center'>
                            <h4 className='font-bold text-xl'>Pay per visit</h4>
                            <h2 className='font-bold text-[var(--dark-blue)] text-3xl my-3'>44$</h2>
                            <p className='text-sm'>90 days of texting with your doctor included.</p>
                            <button className='bg-[var(--primary-blue)] text-white font-bold w-full py-2 rounded-full mt-4'>Book a visit</button>
                        </div>
                        <div className='bg-white px-10 py-4 w-full rounded-3xl flex flex-col justify-center items-center'>
                            <h4 className='font-bold text-xl'>Become a member</h4>
                            <h2 className='font-bold text-[var(--dark-blue)] text-3xl my-3'>24$ <span className='text-lg'>per visit</span></h2>
                            <p className='text-sm'>Unlimited texting with your doctor included.</p>
                            <button className='bg-[var(--primary-blue)] text-white font-bold w-full py-2 rounded-full mt-4'>Book a visit</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4th Section */}
            <div className="py-12 bg-white flex justify-center">
                <div className='w-[1280px] flex flex-col'>
                    <h1 className='text-[var(--dark-blue)] text-center font-bold mb-8'>Our patients love us</h1>
                    <p className='text-center text-lg'>4.9 <i className="ml-1 fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400 mr-1" /> 18K+ reviews</p>
                    <div className='mt-16 grid grid-cols-4 gap-x-4'>
                        <div className='h-[256px] rounded-2xl bg-green-100 p-4 flex flex-col justify-between'>
                            <div>
                                <p className=''><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /></p>
                                <p className='leading-5 text-sm mt-2'>Doctor was available right away, listened to my symptoms and prescribed the right medication. He made sure no allergies and that was it. Very fast and easy.</p>
                            </div>
                            <div>
                                <p className='font-bold'>Pat J.</p>
                                <p className='text-[#777] text-sm'>From Ha Noi</p>
                            </div>
                        </div>
                        <div className='h-[256px] rounded-2xl bg-purple-100 p-4 flex flex-col justify-between'>
                            <div>
                                <p className=''><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /></p>
                                <p className='leading-5 text-sm mt-2'>The doctor made me feel comfortable right away, very easy to ask about concerns I might have had and great feedback from the doctor.</p>
                            </div>
                            <div>
                                <p className='font-bold'>Patrice P.</p>
                                <p className='text-[#777] text-sm'>From Quang Ninh</p>
                            </div>
                        </div>
                        <div className='h-[256px] rounded-2xl bg-blue-100 p-4 flex flex-col justify-between'>
                            <div>
                                <p className=''><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /></p>
                                <p className='leading-5 text-sm mt-2'>My doctor was very professional, thorough, and careful to ask me numerous relevant questions. She answered my questions not only in a detailed manner, but also in a way I could understand.</p>
                            </div>
                            <div>
                                <p className='font-bold'>Betty M.</p>
                                <p className='text-[#777] text-sm'>From Nghe An</p>
                            </div>
                        </div>
                        <div className='h-[256px] rounded-2xl bg-orange-100 p-4 flex flex-col justify-between'>
                            <div>
                                <p className=''><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /><i className="fa-solid fa-star text-red-400" /></p>
                                <p className='leading-5 text-sm mt-2'>It was quick & easy to book the appointment. I was able to get a PC appointment the next morning…within 12 hours! I connected and got my ongoing meds refilled. It was so nice for me living in a rural community.</p>
                            </div>
                            <div>
                                <p className='font-bold'>Katherine M.</p>
                                <p className='text-[#777] text-sm'>From Gia Lai</p>
                            </div>
                        </div>
                    </div>
                    <p className='text-center text-sm text-[var(--primary-blue)] font-bold mt-8'>Read more</p>
                </div>
            </div>

            {/* 5th Section */}
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className='w-[1280px] bg-[#e2eaf6] h-[80%] flex p-12 rounded-4xl'>
                    <div className='p-2 pr-16 w-3/5 flex flex-col justify-center'>
                        <h2 className='text-[48px] font-bold text-[var(--dark-blue)] leading-14 mb-6 pr-8'>Our online doctors are accepting new patients</h2>
                        <p>Having a general or "primary care" doctor decreases hospitalizations and emergency room visits. Even if you're healthy, having a primary care doctor helps prevent serious illness.</p>
                        <br />
                        <p>If you struggle with chronic issues such as diabetes, hypertension, or asthma, having a primary care doctor could be the difference between life and death.</p>
                        <br />
                        <p className='font-bold text-xl text-[var(--dark-blue)]'>Questions? Call <a className='text-[var(--primary-blue)]'>+84 (0)965 140 406</a></p>
                    </div>
                    <div className='w-2/5'>
                        <div className='bg-white rounded-4xl p-8 h-full'>
                            <h3 className='font-bold text-[var(--dark-blue)] text-xl'>Create your OHCP account</h3>
                            <form action="">
                                <div className='mt-6'>
                                    <label htmlFor="" className='text-[#6f777f]'>Email</label>
                                    <input
                                        type="text"
                                        className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                        required
                                    />
                                </div>
                                <div className='mt-6'>
                                    <label htmlFor="" className='text-[#6f777f]'>Password</label>
                                    <input
                                        type="password"
                                        className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                    />
                                </div>
                                <div className='my-4 flex items-center'>
                                    <input
                                        type="checkbox"
                                        className="bg-[#f1f3f5] h-10 w-10 mt-2 px-4 py-2 rounded mr-2"
                                    />
                                    <label htmlFor="" className='text-[#6f777f] ml-2'>I confirm that I am over 18 years old and agree to OHCP's <span className='text-[var(--primary-blue)]'>Terms and Privacy Policy</span>.</label>
                                </div>
                                <div className='mt-8'>
                                    <button className='font-bold text-white bg-[var(--primary-blue)] w-full py-3 rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                        Create account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
