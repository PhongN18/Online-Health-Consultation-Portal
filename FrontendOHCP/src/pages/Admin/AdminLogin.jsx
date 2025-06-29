import { UserContext } from '@/contexts/UserContext';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

function AdminLogin() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { refetchUser } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/admin/login', {
                email,
                password,
            });

            const { token, expires } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', 'admin');

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await refetchUser();
            navigate('/admin/dashboard');

        } catch (err) {
            console.error('Login failed:', err);
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            alert(msg);
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="w-full text-white bg-[var(--dark-blue)] font-bold text-4xl h-16 leading-16 absolute flex justify-center">
                <div className='w-full text-center'><Link to='/'>OHCP</Link></div>
            </div>
            <div className='w-full h-screen bg-[var(--dark-blue)] pt-20 flex justify-center'>
                <div className='w-full h-3/4 flex justify-center items-center'>
                    <div className='bg-white rounded-3xl px-12 py-8 w-[600px]'>
                        <h3 className='text-2xl font-semibold text-center text-[#343a40]'>Admin Login</h3>
                        <form onSubmit={handleLogin}>
                            <div className='mt-4'>
                                <label className='text-[#6f777f]'>Email</label>
                                <input
                                    type="email"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--dark-blue)]"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className='mt-4'>
                                <label className='text-[#6f777f]'>Password</label>
                                <input
                                    type="password"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--dark-blue)]"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className='mt-6 flex justify-center'>
                                <button
                                    type="submit"
                                    className='font-bold text-white bg-[var(--primary-blue)] py-3 px-8 text-sm rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                        <div className='bg-[#eee] h-[1px] w-full my-8'></div>
                        <div className='font-semibold text-center text-sm text-gray-500'>
                            <p className='mb-2'>This portal is for admin use only.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute flex w-full justify-center bottom-10 flex-col items-center gap-2">
                <Link className='py-2 px-4 rounded-xl bg-white text-[var(--dark-blue)] transition hover:bg-[var(--dark-blue)] hover:text-white font-semibold' to='/provider/login'>Provider Login</Link>
                <Link className='py-2 px-4 rounded-xl bg-white text-[var(--dark-blue)] transition hover:bg-[var(--dark-blue)] hover:text-white font-semibold' to='/member/login'>Member Login</Link>
            </div>
        </div>
    );
}

export default AdminLogin;
