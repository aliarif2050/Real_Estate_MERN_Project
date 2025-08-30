
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

const Signup = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const [formData, setFormData] = React.useState({})
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
      console.log(data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          id='username'
          onChange={handleChange}
          placeholder='Username'
          className='border p-3 rounded-lg'
        />
        <input
          type="email"
          id='email'
          onChange={handleChange}
          placeholder='Email'
          className='border p-3 rounded-lg'
        />
        <input
          type="password"
          id='password'
          onChange={handleChange}
          placeholder='Password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
       <OAuth/>
      </form>
       <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  )
}

export default Signup
