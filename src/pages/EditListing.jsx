import { useState } from 'react';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const EditListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    meterage: 9,
    rooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    regularPrice: 50,
    discountedPrice: 25,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    meterage,
    rooms,
    bathrooms,
    parking,
    address,
    furnished,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist!');
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('You can not edit this listing');
      navigate('/');
    }
  }, [auth.currentUser.uid, listing, navigate]);

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error('maximum 6 images are allowed');
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === 'ZERO_RESULTS' && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error('please enter a correct address');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running' + progress);
                break;
              default:
                console.log('Upload state is unknown or not handled');
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images error, please follow the uploading rules.');
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = doc(db, 'listings', params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success('Listing edited');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <section className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
      <div className=' md:w-[65%] lg:w-[50%] mb-12 md:mb-6'>
        <h2 className='text-4xl font-bold mb-9'>Edit Listing</h2>
        <form onSubmit={onSubmit}>
          <p className='font-bold'>Do you want to sell or rent?</p>
          <div className='flex gap-3 my-2'>
            <button
              type='button'
              id='type'
              value='sale'
              onClick={onChange}
              className={`py-2 rounded w-full ${
                type === 'rent'
                  ? 'bg-white text-black'
                  : 'bg-green-800 text-white'
              } `}
            >
              Sell
            </button>
            <button
              type='button'
              id='type'
              value='rent'
              onClick={onChange}
              className={`py-2 rounded w-full ${
                type === 'sale'
                  ? 'bg-white text-black'
                  : 'bg-green-800 text-white'
              } `}
            >
              Rent
            </button>
          </div>
          <br />
          <p className='font-bold'>Consider a name for your Property</p>
          <input
            className='w-full rounded my-2'
            type='text'
            id='name'
            value={name}
            onChange={onChange}
            maxLength='42'
            minLength='10'
            required
          />
          <div className='w-full flex gap-3'>
            <div className='w-full'>
              <p className='font-bold'>
                Meterage <span className='text-[.8rem]'>㎡</span>
              </p>
              <input
                className='w-full rounded my-2'
                type='number'
                id='meterage'
                value={meterage}
                onChange={onChange}
                min='9'
                max='1000'
                required
              />
            </div>
            <div className='w-full'>
              <p className='font-bold'>Rooms</p>
              <input
                className='w-full rounded my-2'
                type='number'
                id='rooms'
                value={rooms}
                onChange={onChange}
                min='0'
                max='12'
                required
              />
            </div>
            <div className='w-full'>
              <p className='font-bold'>Bathrooms</p>
              <input
                className='w-full rounded my-2'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onChange}
                min='0'
                max='12'
                required
              />
            </div>
          </div>
          <br />
          <p className='font-bold'>Does it have parking?</p>
          <div className='flex gap-3 my-2'>
            <button
              type='button'
              id='parking'
              value={true}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                !parking ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              Yes
            </button>
            <button
              type='button'
              id='parking'
              value={false}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                parking ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              No
            </button>
          </div>{' '}
          <br />
          <p className='font-bold'>Is it furnished?</p>
          <div className='flex gap-3 my-2'>
            <button
              type='button'
              id='furnished'
              value={true}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                !furnished ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              Yes
            </button>
            <button
              type='button'
              id='furnished'
              value={false}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                furnished ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              No
            </button>
          </div>
          <br />
          <p className='font-bold'>Where is the address of your property?</p>
          <textarea
            className='w-full rounded my-2'
            type='text'
            id='address'
            value={address}
            onChange={onChange}
            required
          />
          {!geolocationEnabled && (
            <>
              <p className='font-bold mt-5 mb-2'>
                Enter the latitude and longitude of your property manually!
                <br />
                <span className='text-xs'>
                  You can use this link to convert your address.{' '}
                  <a
                    className='text-red-600'
                    target='_blank'
                    rel='noreferrer'
                    href='https://www.latlong.net/'
                  >
                    latlong.net
                  </a>
                </span>
              </p>
              <div className='flex w-full gap-3 mt-1'>
                <div className='w-full'>
                  <p>Latitude:</p>
                  <input
                    className='w-full rounded'
                    type='number'
                    id='latitude'
                    value={latitude}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className='w-full'>
                  <p>Longitude:</p>
                  <input
                    className='w-full rounded'
                    type='number'
                    id='longitude'
                    value={longitude}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </>
          )}
          <br />
          <p className='font-bold'>Describe your property in full!</p>
          <textarea
            className='w-full rounded my-2'
            type='text'
            id='description'
            value={description}
            onChange={onChange}
            required
          />
          <p className='mt-4 font-bold'>Do You Want to Make it an Offer?</p>
          <div className='flex gap-3 my-2'>
            <button
              type='button'
              id='offer'
              value={true}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                !offer ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              Yes
            </button>
            <button
              type='button'
              id='offer'
              value={false}
              onClick={onChange}
              className={`py-2 rounded w-full ${
                offer ? 'bg-white text-black' : 'bg-green-800 text-white'
              } `}
            >
              No
            </button>
          </div>
          <br />
          <div>
            <div>
              {offer ? (
                <p className='font-bold mb-3'>
                  Write your regular price and discount offer!
                </p>
              ) : (
                <p className='font-bold mb-3'>What is your property price?</p>
              )}

              <div className='flex gap-6 my-2'>
                <div className='flex w-full'>
                  <p className='text-[.6rem] mr-1'>
                    Regular <br /> Price
                  </p>
                  <input
                    className='w-full rounded'
                    type='number'
                    id='regularPrice'
                    value={regularPrice}
                    onChange={onChange}
                    min='50'
                    max='10000000000'
                    required
                  />
                  {type === 'rent' && (
                    <div className='ml-2 '>
                      <p>
                        $ <span className='text-[.5rem]'>Per/</span>{' '}
                      </p>
                      <p className='text-[.6rem]'>Mounth</p>
                    </div>
                  )}
                </div>
                {offer && (
                  <div className='flex w-full'>
                    <p className='text-[.6rem] mr-1'>
                      Discounted <br /> Price
                    </p>
                    <input
                      className='w-full rounded'
                      type='number'
                      id='discountedPrice'
                      value={discountedPrice}
                      onChange={onChange}
                      min='25'
                      max='10000000000'
                      required={offer}
                    />
                    {type === 'rent' && (
                      <div className='ml-2 '>
                        <p>
                          $ <span className='text-[.5rem]'>Per/</span>{' '}
                        </p>
                        <p className='text-[.6rem]'>Mounth</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <br />
          <div className='my-3'>
            <p className='font-bold'>Upload pictures of your property!</p>
            <p className='mb-2 text-[.8rem] text-red-600'>
              You can select <span className='font-bold'>6</span> images; each
              should be less than <span className='font-bold'>500Kb</span>.
            </p>
            <input
              className='w-full bg-white p-2 rounded'
              type='file'
              id='images'
              onChange={onChange}
              accept='jpg , png , jpeg'
              multiple
              required
            />
          </div>
          <button
            className='w-full p-2 bg-black text-white rounded text-bold my-6'
            type='submit'
          >
            Edit Your Listing
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditListing;
