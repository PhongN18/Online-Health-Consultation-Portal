import { useNavigate } from 'react-router-dom';
import ChildrenHealth from '../../assets/MemberHome/ChildrenHealth.jpg';
import CustomerService from '../../assets/MemberHome/CustomerService.jpg';
import ManageCondition from '../../assets/MemberHome/ManageCondition.jpg';
import ManHealth from '../../assets/MemberHome/MenHealth.jpg';
import MentalHealth from '../../assets/MemberHome/MentalHealth.jpg';
import PrimaryCare from '../../assets/MemberHome/PrimaryCare.jpg';
import QnA from '../../assets/MemberHome/QnA.jpg';
import SeniorHealth from '../../assets/MemberHome/SeniorHealth.jpg';
import SexualHealth from '../../assets/MemberHome/SexualHealth.jpg';
import Text from '../../assets/MemberHome/Text.jpg';
import Travel from '../../assets/MemberHome/Travel.jpg';
import Wellness from '../../assets/MemberHome/Wellness.jpg';
import WomanHealth from '../../assets/MemberHome/WomanHealth.jpg';


function MemberHome() {

    const navigate = useNavigate();
    
    const handleClickOption = (option) => {
        if (option === 'text' || option === 'qna' || option === 'customerService') {

        } else {
            navigate(`/member/choose-doctor`, {
                state: {
                    careOption: option
                }
            })
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fa] items-center">
            <div className="w-[1000px] py-8">
                <div className='my-4'>
                    <h3 className="text-[#343a40] text-xl font-semibold">Talk to a doctor</h3>
                    <p className="text-[#6c747c] mb-4">Get medical advice, prescriptions, tests, and referrals.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleClickOption('Primary Care')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={PrimaryCare} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Primary Care Appointment</span>
                                    <span className="block text-sm text-[#6c747c]">Choose your own Primary Care doctor and book an introductory video visit.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        {/* <div onClick={() => handleClickOption('urgent')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={UrgentCare} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Urgent Care Now</span>
                                    <span className="block text-sm text-[#6c747c]">Video chat with the first available doctor – including evenings, weekends, and holidays.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div> */}
                        <div onClick={() => handleClickOption('text')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={Text} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Text Your Doctor</span>
                                    <span className="block text-sm text-[#6c747c]">Choose a Primary Care doctor and complete your first video appointment, then enjoy free texting to address follow-up questions and request prescription refills.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Available after first appointment</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-4'>
                    <h3 className="text-[#343a40] text-xl font-semibold">For Specific Needs</h3>
                    <p className="text-[#6c747c] mb-4">Our primary care doctors can help you with a broad range of health issues, medications and lab orders by video appointment.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleClickOption('Women Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={WomanHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Women's Health</span>
                                    <span className="block text-sm text-[#6c747c]">UTI, birth control, menopause, period problems, yeast infections, skin and hair care.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Children Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={ChildrenHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Children's Health</span>
                                    <span className="block text-sm text-[#6c747c]">Cold & flu symptoms, diarrhea or constipation, skin rashes, allergies.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Men Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={ManHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Men's Health</span>
                                    <span className="block text-sm text-[#6c747c]">STI symptoms, erection issues, bladder or bowel issues, skin and hair care.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Sexual Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={SexualHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Sexual Health</span>
                                    <span className="block text-sm text-[#6c747c]">STI prevention or testing, erectile dysfunction, birth control counseling.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Manage Condition')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={ManageCondition} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Manage Your Condition</span>
                                    <span className="block text-sm text-[#6c747c]">Diabetes, high BP, allergies, high cholesterol, gastrointestinal disorders, arthritis.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Wellness, Prevention & Lifestyle')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={Wellness} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Wellness, Prevention & Lifestyle</span>
                                    <span className="block text-sm text-[#6c747c]">Weight counseling, skin and hair care, supplements, health screenings, stress reduction.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Travel Medicine')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={Travel} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Travel Medicine</span>
                                    <span className="block text-sm text-[#6c747c]">Vaccinations and medications, pre-travel counseling, post-travel care.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                        <div onClick={() => handleClickOption('Senior Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={SeniorHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Senior Health</span>
                                    <span className="block text-sm text-[#6c747c]">Muscle or joint pain, medication management, preventive health screenings.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-4'>
                    <h3 className="text-[#343a40] text-xl font-semibold">Dr. Q&A</h3>
                    <p className="text-[#6c747c] mb-4">Get Answers to general health questions from real doctors for free. 100% anonymous.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleClickOption('qna')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={QnA} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Ask A Question</span>
                                    <span className="block text-sm text-[#6c747c]">Get Answers to general health questions from real doctors for free. 100% anonymous.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Instantly search, or get new answers within a day</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-4'>
                    <h3 className="text-[#343a40] text-xl font-semibold">Mental & Behavioral</h3>
                    <p className="text-[#6c747c] mb-4">Talk with our Primary Care doctors about a broad range of issues like sleep, anxiety, or addictive behaviors.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleClickOption('Mental & Behavioral Health')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={MentalHealth} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Mental & Behavioral Health</span>
                                    <span className="block text-sm text-[#6c747c]">Talk with our Primary Care doctors about a broad range of issues like sleep, anxiety, or addictive behaviors.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Depends on your coverage</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>0 - 44$</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-4'>
                    <h3 className="text-[#343a40] text-xl font-semibold">Navigation & Support</h3>
                    <p className="text-[#6c747c] mb-4">Non-medical answers to your questions about your care, benefits or the app.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleClickOption('customerService')} className="bg-white shadow-md flex flex-col p-4 rounded-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer">
                            <div className="flex justify-between gap-6">
                                <div className="rounded overflow-hidden h-20 w-20 flex-shrink-0">
                                    <img src={CustomerService} alt="" className="h-full w-full" />
                                </div>
                                <div className="flex-1 max-w-full">
                                    <span className="block font-semibold text-[#343a40]">Customer Service</span>
                                    <span className="block text-sm text-[#6c747c]">Read our FAQs or contact a HealthTap specialist by email or phone for technical and billing support.</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <span className='text-[#6c747c]'>Instant FAQs, same day response</span>
                                <span className='block bg-[#018611] text-white font-bold px-2 py-1 rounded-lg'>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberHome;
