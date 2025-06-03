import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-white opacity-90 text-[var(--dark-blue)] px-10 py-4 flex gap-20 sticky top-0 z-10">
            <h1 className="text-3xl font-bold">OHCP</h1>
            <div className='flex items-center flex-grow justify-between'>
                <nav className='flex items-center font-bold'>
                    <Link className="mr-6" to="/">Home</Link>
                    <Link className="mr-6" to="/doctors">Doctors</Link>
                    <Link className="" to="/appointment">Book Appointment</Link>
                </nav>
                <div>
                    <button className='bg-white font-bold text-black mr-4'>Log in</button>
                    <button className='bg-[var(--primary-blue)] text-white font-bold px-6 py-3 rounded-4xl'>Book a video appointment</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
