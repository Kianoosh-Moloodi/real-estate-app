import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase';

function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landlord data');
      }
    };
    getLandlord();
  }, [userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord !== null && (
        <div className='flex flex-col w-full mt-6'>
          <p className='mb-1'>
            Contact <span className='text-red-600'>{landlord.name}</span> for
            the {listing.name}
          </p>
          <textarea
            className='w-full p-3 rounded'
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
          ></textarea>
          <a
            className='w-full p-3 bg-blue-700 text-white font-bold text-center rounded mt-3'
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            Send Message
          </a>
        </div>
      )}
    </>
  );
}

export default Contact;
