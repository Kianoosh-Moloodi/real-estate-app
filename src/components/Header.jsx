import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

function Header() {
  const [pageState, setPageState] = useState('Sign in');
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState('Profile');
      } else {
        setPageState('Sign in');
      }
    });
  }, [auth]);
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div className='border-b shadow-sm sticky top-0 z-99 py-3 bg-white'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img
            src='https://projects.kmagroute.com/logo/KmagRouteProjectsLogo.png'
            alt='logo'
            className='h-7 cursor-pointer'
            onClick={() => navigate('/')}
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              className={`cursor-pointer py-3 font font-semibold text-gray-400 border-b-4 border-b-transparent ${
                pathMatchRoute('/') && 'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-gray-400 border-b-4 border-b-transparent ${
                pathMatchRoute('/deals') && 'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/deals')}
            >
              Deals
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-gray-400 border-b-4 border-b-transparent ${
                (pathMatchRoute('/sign-in') ||
                  pathMatchRoute('/sign-up') ||
                  pathMatchRoute('/profile') ||
                  pathMatchRoute('/forgot-password')) &&
                'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/profile')}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
