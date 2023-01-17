import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <section className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
      <div className='md:w-[65%] lg:w-[50%] mb-12 md:mb-6'>
        <h2 className='text-4xl font-bold mb-9'>Forgot password</h2>
        <p className='text-xl mb-6'>
          Welcome to our online real estate consultant project.
          <br />
          The latest version of the React library and Tailwind CSS are used in
          this project.
          <br />
          This is a complete platform that will be able to advertise houses,
          shops, and other places.
          <br />
          View more projects on our website.
        </p>
        <a href='https://kmagroute.com/'>
          <img
            src='https://projects.kmagroute.com/logo/KmagRouteProjectsLogo.png'
            alt='logo'
            className='h-8 cursor-pointer mb-9'
          />
        </a>
      </div>
      <div className='w-full md:w-[65%] lg:w-[40%] lg:ml-20'>
        <form onSubmit={onSubmit}>
          <input
            className='w-full px-4 py-2 text-xl rounded mb-3'
            type='email'
            id='email'
            value={email}
            onChange={onChange}
            placeholder='Email Address'
          />
          <div className='flex justify-between mb-6'>
            <p>
              Don't have an account?{' '}
              <Link
                to='/sign-up'
                className='text-green-600 hover:text-green-700'
              >
                Register
              </Link>
            </p>
            <p>
              <Link to='/sign-in' className='text-blue-600 hover:text-blue-700'>
                Sign In
              </Link>
            </p>
          </div>
          <button
            type='submit'
            className='w-full bg-green-600 text-white p-3 font-medium rounded hover:bg-green-700'
          >
            Send reset password
          </button>
          <div className='flex my-6 items-center after:border-t after:flex-1 after:border-gray-500 before:border-t before:flex-1 before:border-gray-500'>
            <p className='text-center mx-3'>OR</p>
          </div>
          <OAuth />
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;
