import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function MemberHeader({ onLogout }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`bg-white text-[#6c747c] px-10 py-4 flex justify-center`}>
            <div className="w-[1000px] flex justify-between">
                <h4 className="text-3xl text-[var(--primary-blue)] font-bold">
                    <Link to='/member/home'>OHCP</Link>
                </h4>

                <div className='flex items-center gap-8 text-sm font-semibold'>
                    <Link to='/member/doctors'>Doctors</Link>
                    <Link to='/member/appointments'>My Appointments</Link>
                    <Link to='/member/home'>Records</Link>
                    <Link to='/member/home'>Notifications</Link>

                    {/* Profile dropdown */}
                    <div className='relative' ref={dropdownRef}>
                        <div
                            className='flex items-center gap-2 cursor-pointer'
                            onClick={() => setShowDropdown(prev => !prev)}
                        >
                            <div className='bg-[var(--primary-blue)] text-white text-lg h-8 w-8 flex items-center justify-center rounded-full'>
                                <i className="fa-solid fa-user"></i>
                            </div>
                            <i className="fa-solid fa-caret-down"></i>
                        </div>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 bg-white overflow-hidden rounded shadow text-sm w-40 z-50">
                                <Link
                                    to="/member/profile"
                                    className="block px-4 py-2 hover:bg-gray-100 hover:font-bold"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 hover:font-bold"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default MemberHeader;
