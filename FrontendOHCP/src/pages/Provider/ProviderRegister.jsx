import { UserContext } from '@/contexts/UserContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ProviderRegister() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { refetchUser } = useContext(UserContext)

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/auth/provider/register', {
                email,
                password,
                role: 'doctor' // explicitly specify role if needed
            });

            const { token, user } = response.data;
            console.log(response.data);
            
            const userId = user.userId

            // ✅ Save token
            localStorage.setItem('token', token);
            localStorage.setItem('role', 'provider');
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Redirect to profile completion page with userId
            await refetchUser()
            navigate('/provider/verify', { state: { userId } });

        } catch (err) {
            console.error('Registration failed:', err);
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            alert(msg);
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="w-full text-[var(--primary-blue)] font-bold text-4xl h-16 leading-16 absolute flex justify-center border-b-1 border-gray-200">
                <div className='w-full text-center'><Link to='/'>OHCP</Link></div>
            </div>
            <div className='w-full h-screen bg-cover bg-center pt-20 flex justify-center'>
                <div className='w-full h-3/4 flex justify-center'>
                    <div className='bg-white rounded-3xl px-12 py-8 w-[600px]'>
                        <h3 className='text-4xl font-semibold text-center text-[#343a40]'>Sign up</h3>
                        <h4 className='text-lg font-semibold mt-2 text-center text-[#343a40]'>Join top doctors for free today!</h4>
                        <form action="" onSubmit={handleRegister}>
                            <div className='mt-4'>
                                <label htmlFor="" className='text-[#6f777f]'>Email</label>
                                <input
                                    type="text"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='mt-4'>
                                <label htmlFor="" className='text-[#6f777f]'>Password</label>
                                <input
                                    type="password"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className='mt-8 flex flex-col justify-center gap-3'>
                                <div className='text-[#343a40]'>I agree to OHCP's <span className='hover:underline text-[var(--primary-blue)] cursor-pointer'>Terms</span> and <span className='hover:underline text-[var(--primary-blue)] cursor-pointer'>Privacy Policy</span>.</div>
                                <button className='font-bold text-white bg-[var(--primary-blue)] py-3 px-8 text-sm rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                    Agree and continue
                                </button>
                            </div>
                        </form>
                        <div className='bg-[#eee] h-[1px] w-full my-8'></div>
                        <p className='font-semibold text-center'>Have an account? <Link to='/provider/login' className='text-[var(--primary-blue)]'>Log in</Link></p>
                    </div>
                </div>
            </div>
            <div className="absolute flex w-full justify-center bottom-10 flex-col items-center gap-2">
                <Link className='py-2 px-4 rounded-xl hover:bg-[var(--dark-blue)] border border-[var(--dark-blue)] hover:text-white font-semibold' to='/admin/login'>Admin Login</Link>
                <Link className='py-2 px-4 rounded-xl hover:bg-[var(--primary-blue)] border border-[var(--primary-blue)] hover:text-white font-semibold' to='/member/login'>Member Login</Link>
            </div>
        </div>
    );
}

export default ProviderRegister;
