import React from 'react';
import { FcGoogle } from 'react-icons/fc';
function OAuth() {
  return (
    <button className='flex items-center justify-center w-full bg-red-700 hover:bg-red-800 text-white p-3 font-medium rounded'>
      <FcGoogle  className='text-2xl bg-white rounded-full mr-2'/>Continue with Google
    </button>
  );
}

export default OAuth;
