import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
    <form className='flex flex-col'>
      <img className='w-24 h-24 object-cover rounded-full cursor-pointer self-center' src={user.photo} alt={`Profile photo of ${user.name}`} />
      <input id='username' type="text" placeholder='Username' className='border p-3 rounded-lg my-2' />
      <input id='email' type="email" placeholder='Email' className='border p-3 rounded-lg my-2' />
      <input id='text' type="password" placeholder='Password' className='border p-3 rounded-lg my-2' />
      <button className='bg-slate-700 text-white p-3 rounded-lg my-2 
      uppercase hover:opacity-95 disabled:opacity-80'>Update Profile</button>
    </form>
    <div className='flex justify-between mt-5'>
      <span className='text-red-700 cursor-pointer'>Delete Account</span>
      <span className='text-red-700 cursor-pointer'>Sign Out</span>
    </div>
    </div>
  )
}

export default Profile