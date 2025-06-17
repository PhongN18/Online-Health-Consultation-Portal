import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bg1 from '../../assets/Auth/bg1.jpg';
import bg2 from '../../assets/Auth/bg2.jpg';
import bg3 from '../../assets/Auth/bg3.jpg';
import bg4 from '../../assets/Auth/bg4.jpg';
import bg5 from '../../assets/Auth/bg5.jpg';
import axiosInstance from '../../utils/axios';

function Register() {
    const [bgImage, setBgImage] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Random background image for each visit
    useEffect(() => {
        const images = [bg1, bg2, bg3, bg4, bg5];
        const randomIndex = Math.floor(Math.random() * images.length);
        setBgImage(images[randomIndex]);
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Send POST request to backend to create a user with email and password
            const response = await axiosInstance.post('/api/Auth/register', {
                email,
                password,
                role: 'patient', // Patient role on registration
            });

            // After successful registration, redirect to the complete profile page with userId
            if (response.status === 200) {
                console.log(response)
                localStorage.setItem('token', response.data.token);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                navigate('/member/getting-started', { state: { userId: response.data.user.userId } });
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="w-full bg-[var(--dark-blue)] text-white font-bold text-4xl h-16 leading-16 absolute flex justify-center">
                <div className='w-full text-center pl-0 md:pl-32 md:text-left'>
                    <Link to='/'>OHCP</Link>
                </div>
            </div>
            <div className='w-full h-screen bg-cover bg-center pt-40 flex justify-center' style={{backgroundImage: `url(${bgImage})`}}>
                <div className='w-full h-4/5 flex justify-center pl-0 md:pl-32 md:justify-start'>
                    <div className='bg-white rounded-3xl px-12 py-10 w-1/2'>
                        <h3 className='text-2xl font-semibold text-[#343a40]'>Create a secure account</h3>
                        <form onSubmit={handleRegister}>
                            <div className='mt-4'>
                                <label htmlFor="email" className='text-[#6f777f]'>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='mt-4'>
                                <label htmlFor="password" className='text-[#6f777f]'>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="bg-[#f1f3f5] w-full mt-2 px-4 py-2 rounded focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--primary-blue)]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='my-4 flex items-center'>
                                <input
                                    type="checkbox"
                                    className="bg-[#f1f3f5] h-10 w-10 mt-2 px-4 py-2 rounded mr-2"
                                />
                                <label htmlFor="" className='text-[#6f777f] ml-2'>I confirm that I am over 18 years old and agree to OHCP's <span className='text-[var(--primary-blue)]'>Terms and Privacy Policy</span>.</label>
                            </div>
                            <div className='mt-4'>
                                <button type="submit" className='font-bold text-white bg-[var(--primary-blue)] w-full py-3 rounded-4xl cursor-pointer hover:bg-[var(--dark-blue)]'>
                                    Register
                                </button>
                            </div>
                        </form>
                        <div className='bg-[#eee] h-[1px] w-full my-8'></div>
                        <p className='font-semibold mb-2'>Already a member? <Link to='/member/login' className='text-[var(--primary-blue)]'>Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
