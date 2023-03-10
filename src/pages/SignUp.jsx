import React, { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      toast.success('Registration was successful.');
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <section className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
      <div className='md:w-[65%] lg:w-[50%] mb-12 md:mb-6'>
        <h2 className='text-4xl font-bold mb-9'>Register</h2>
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
            type='text'
            id='name'
            value={name}
            onChange={onChange}
            placeholder='Full Name'
          />
          <input
            className='w-full px-4 py-2 text-xl rounded mb-3'
            type='email'
            id='email'
            value={email}
            onChange={onChange}
            placeholder='Email Address'
          />
          <div className='relative mb-6'>
            <input
              className='w-full px-4 py-2 text-xl rounded'
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={password}
              onChange={onChange}
              placeholder='Password'
            />
            {showPassword ? (
              <AiFillEyeInvisible
                className='absolute right-3 top-3 text-2xl cursor-pointer'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            ) : (
              <AiFillEye
                className='absolute right-3 top-3 text-2xl cursor-pointer'
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            )}
          </div>
          <div className='flex justify-between mb-6'>
            <p>
              Already have an account?
              <Link
                to='/sign-in'
                className='text-green-600 hover:text-green-700 ml-2'
              >
                Sign In
              </Link>
            </p>
            <p>
              <Link
                to='/forgot-password'
                className='text-blue-600 hover:text-blue-700'
              >
                Forgot password
              </Link>
            </p>
          </div>
          <button
            type='submit'
            className='w-full bg-green-600 text-white p-3 font-medium rounded hover:bg-green-700'
          >
            Sign Up
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

export default SignUp;
