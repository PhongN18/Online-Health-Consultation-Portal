import { UserContext } from '@/contexts/UserContext';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bg1 from '../../assets/Auth/bg1.jpg';
import bg2 from '../../assets/Auth/bg2.jpg';
import bg3 from '../../assets/Auth/bg3.jpg';
import bg4 from '../../assets/Auth/bg4.jpg';
import bg5 from '../../assets/Auth/bg5.jpg';
import axiosInstance from '../../utils/axios';

function MemberLogin() {

    const [bgImage, setBgImage] = useState(null);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { refetchUser } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        const images = [bg1, bg2, bg3, bg4, bg5];
        const randomIndex = Math.floor(Math.random() * images.length);
        setBgImage(images[randomIndex]);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/api/auth/member/login', {
                email,
                password,
            });

            const { token, expires } = response.data;

            // ✅ Save token to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', 'member');

            // ✅ Set token in Axios for future requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await refetchUser()
            navigate('/member/home')

        } catch (err) {
            console.error('Login failed:', err);
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            alert(msg);
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
                        <h3 className='text-2xl font-semibold text-[#343a40]'>Welcome back</h3>
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
                            <div className='mt-4'>
                                <button className='font-bold text-white bg-[var(--primary-blue)] w-full py-3 rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                    Log in
                                </button>
                            </div>
                        </form>
                        <div className='bg-[#eee] h-[1px] w-full my-8'></div>
                        <p className='font-semibold mb-2'>New user? <Link to='/member/register' className='text-[var(--primary-blue)]'>Create an account</Link></p>
                        <p className='font-semibold'>Are you a doctor? <Link to='/provider/login' className='text-[var(--primary-blue)]'>Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberLogin;
