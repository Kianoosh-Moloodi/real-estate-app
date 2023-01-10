import React from 'react';
import { useLocation, useNavigate } from 'react-router';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div className='border-b shadow-sm sticky top-0 z-99 py-3'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img
            src='https://projects.kmagroute.com/logo/KmagRouteProjectsLogo.png'
            alt='logo'
            className='h-11 cursor-pointer'
            onClick={() => navigate('/')}
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              className={`cursor-pointer text-lg py-3 font font-semibold text-gray-400 border-b-4 border-b-transparent ${
                pathMatchRoute('/') && 'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer text-lg py-3 font-semibold text-gray-400 border-b-4 border-b-transparent ${
                pathMatchRoute('/deals') && 'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/deals')}
            >
              Deals
            </li>
            <li
              className={`cursor-pointer text-lg py-3 font-semibold text-gray-400 border-b-4 border-b-transparent ${
                pathMatchRoute('/sign-in') && 'text-black border-b-green-500'
              }`}
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default Header;
