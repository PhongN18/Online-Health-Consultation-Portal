import { Link } from 'react-router-dom';

function MemberHeader() {
    return (
        <header className={`bg-white text-[#6c747c] px-10 py-4 flex justify-center`}>
            <div className="w-[1000px] flex justify-between">
                <h4 className="text-3xl text-[var(--primary-blue)] font-bold"><Link to='/member/home'>OHCP</Link></h4>
                <div className='flex items-center gap-8 text-sm font-semibold'>
                    <Link to='/member/home'>Messages</Link>
                    <Link to='/member/home'>My Care</Link>
                    <Link to='/member/home'>Records</Link>
                    <Link to='/member/home'>Notifications</Link>
                    <div className='flex items-center gap-2'>
                        {/* Profile management */}
                        <div className='bg-[var(--primary-blue)] text-white text-lg h-8 w-8 flex items-center justify-center rounded-full'><i className="fa-solid fa-user"></i></div> <i className="fa-solid fa-caret-down"></i>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default MemberHeader;
