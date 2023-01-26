import { getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { MdHomeWork } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Listingitem from '../components/Listingitem';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success('Profile has been updated');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, 'listings');
      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  // async function onDelete(listingID) {
  //   if (window.confirm("Are you sure you want to delete?")) {
  //     await deleteDoc(doc(db, "listings", listingID));
  //     const updatedListings = listings.filter(
  //       (listing) => listing.id !== listingID
  //     );
  //     setListings(updatedListings);
  //     toast.success("Successfully deleted the listing");
  //   }
  // }
  // function onEdit(listingID) {
  //   navigate(`/edit-listing/${listingID}`);
  // }

  return (
    <>
      <section className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[65%] lg:w-[50%] mb-12 md:mb-6'>
          <h2 className='text-4xl font-bold mb-9'>My Profile</h2>
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
          <form>
            <label htmlFor='name'>Your Full Name</label>
            <input
              type='text'
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl rounded mb-3 ${
                changeDetail && 'bg-yellow-200'
              } `}
            />
            <label htmlFor='name'>Your Email</label>
            <input
              type='email'
              id='email'
              value={email}
              disabled
              className='w-full px-4 py-2 text-xl rounded mb-3'
            />
            <div className='flex justify-between mb-6'>
              <p>
                Wrong Full Name?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className='ml-2 text-green-600 hover:text-green-700 cursor-pointer'
                >
                  {changeDetail ? 'Apply change' : 'Edit'}
                </span>
              </p>
              <p
                onClick={onLogout}
                className='ml-2 text-red-600 hover:text-red-700 cursor-pointer'
              >
                Sign out
              </p>
            </div>
          </form>
          <Link to='/create-listing'>
            <button
              type='submit'
              className='w-full font-bold bg-black text-white rounded flex justify-center items-center p-3'
            >
              <MdHomeWork className='mr-2 text-2xl' />
              Sell or Rent Your Property
            </button>
          </Link>
        </div>
      </section>
      <section className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-4xl font-bold mb-9'>My Listings</h2>
            <ul>
              {listings.map((listing) => (
                <Listingitem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

export default Profile;
