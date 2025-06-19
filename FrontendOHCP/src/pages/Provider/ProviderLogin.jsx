import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function ProviderLogin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/auth/provider/login', {
                email,
                password,
            });

            const { token, expires } = response.data;

            // ✅ Save token to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', 'provider')

            // ✅ Set token in Axios for future requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const userInfo = await axiosInstance.get('/api/auth/provider/me');

            navigate('/provider/home')

        } catch (err) {
            console.error('Login failed:', err);
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
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
                        <h3 className='text-2xl font-semibold text-center text-[#343a40]'>Enter your login info</h3>
                        <form action="" onSubmit={handleLogin}>
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
                            <div className='mt-4 flex justify-center'>
                                <button className='font-bold text-white bg-[var(--primary-blue)] py-3 px-8 text-sm rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                    Log in
                                </button>
                            </div>
                        </form>
                        <div className='bg-[#eee] h-[1px] w-full my-8'></div>
                        <p className='font-semibold text-center'>Don't have an account? <Link to='/provider/register' className='text-[var(--primary-blue)]'>Create one now</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderLogin;
