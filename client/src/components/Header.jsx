import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
export const Header = () => {
    const {user} = useSelector((state) => state.user);
    return (
        <header className='bg-slate-300 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>DWC</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
                </Link>
                <form action="" className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                    <FaSearch className='text-slate-600'/>
                </form>
                <ul className='flex gap-4'>
                    <Link to='/'> <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li></Link>
                    <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
                    <Link to='/profile'>
                    {user ? (
                        <img src={user.photo} alt={user.name} className='w-7 h-7 object-cover rounded-full'/>
                    ) :<li className='text-slate-700 hover:underline'>Sign in</li>}    
                    </Link>
                </ul>
            </div>
        </header>
    )
}
