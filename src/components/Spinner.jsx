import React from 'react';
import spinner from '../assets/svg/spinner.svg';
function Spinner() {
  return (
    <div className='flex justify-center items-center fixed left-0 right-0 bottom-0 top-0 z-100'>
      <img src={spinner} alt='Loading...' className='h-8' />
      <p className='font-bold ml-2'>Loading ...</p>
    </div>
  );
}

export default Spinner;
