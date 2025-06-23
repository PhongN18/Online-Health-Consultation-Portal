import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
        // Check the vertical scroll position (y-axis)
            if (window.scrollY > 800) {
                setIsScrolled(true);  // Change state when passed 200px
            } else {
                setIsScrolled(false);
            }
        };

        // Attach event listener to the window scroll
        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [window.scrollY]);


    return (
        <header className={`${!isScrolled ? 'bg-white text-[var(--dark-blue)]' : 'bg-[var(--dark-blue)] text-white'} px-10 flex gap-20 sticky top-0 z-10`}>
            <h2 className="text-5xl font-bold py-4"><Link to='/'>OHCP</Link></h2>
            <div className='flex items-center flex-grow justify-between'>
                <nav className='flex items-center font-bold h-full'>
                    <Link className={`${isScrolled ? 'hover:bg-white hover:text-[var(--dark-blue)]' : 'hover:bg-[var(--dark-blue)] hover:text-white'} h-full flex justify-center items-center px-4 transition-all duration-200 ease-in-out`} to="/">Home</Link>
                    <Link className={`${isScrolled ? 'hover:bg-white hover:text-[var(--dark-blue)]' : 'hover:bg-[var(--dark-blue)] hover:text-white'} h-full flex justify-center items-center px-4 transition-all duration-200 ease-in-out`} to="/doctors">Doctors</Link>
                </nav>
                <div>
                    <Link to='/member/login' className={`${!isScrolled ? 'bg-white text-[var(--dark-blue)] hover:bg-[var(--dark-blue)] hover:text-white' : 'bg-[var(--dark-blue)] text-white hover:bg-white hover:text-[var(--dark-blue)]'} font-bold px-6 py-3 rounded-4xl transition-all duration-200 ease-in-out mr-4`}>Log in</Link>
                    <Link to='/member/register' className='bg-[var(--primary-blue)] text-white font-bold px-6 py-3 rounded-4xl inline-block hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer'>Book a video appointment</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
