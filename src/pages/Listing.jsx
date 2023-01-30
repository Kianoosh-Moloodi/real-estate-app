import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { MdLocationPin } from 'react-icons/md';
import { FiMap } from 'react-icons/fi';
import { FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import Contact from '../components/Contact';

function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactLandLord, setContactLandLord] = useState(false);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  } else {
    return (
      <section className='px-6 max-w-6xl mx-auto'>
        <main>
          <Swiper
            slidesPerView={1}
            navigation
            pagination={{ type: 'progressbar' }}
            effect='fade'
            module={[EffectFade]}
            autoplay={{ delay: 3000 }}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className='relative w-full overflow-hidden h-96 rounded'
                  style={{
                    background: `url(${listing.imgUrls[index]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='flex flex-col md:flex-row mt-6 gap-3 bg-white rounded'>
            <div className='w-full p-4'>
              <div className='flex items-center text-xs'>
                <MdLocationPin className='text-green-700 mr-1' />
                {listing.address}
              </div>
              <p className='font-bold text-2xl'>{listing.name}</p>
              <div className='text-red-600 font-bold my-3 flex items-center'>
                <span className='text-2xl'>
                  $
                  {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
                {listing.type === 'rent' ? (
                  <span className='bg-red-600 ml-2 p-1 rounded text-xs text-white'>
                    per Month
                  </span>
                ) : (
                  <span className='bg-red-600 ml-2 p-1 rounded text-xs text-white'>
                    for Sale
                  </span>
                )}
                {listing.offer && (
                  <span className='ml-2'>
                    {Math.round(
                      (listing.discountedPrice * 100) / +listing.regularPrice -
                        100
                    )}
                    %{' '}
                    <span className='text-xs'>less than the regular price</span>
                  </span>
                )}
              </div>
              <div className='mt-6'>
                <p className='font-bold'>Description:</p>
                <p className='text-xs'>{listing.description}</p>
              </div>
              <div className='mt-6 text-xs'>
                <ul className='flex items-center gap-4'>
                  <li className='flex items-center whitespace-nowrap gap-1 font-bold'>
                    <FiMap />
                    {listing.meterage}㎡
                  </li>
                  <li className='flex items-center whitespace-nowrap gap-1 font-bold'>
                    <FaBed />
                    {+listing.rooms > 1 ? `${listing.rooms} Rooms` : '1 Bed'}
                  </li>
                  <li className='flex items-center whitespace-nowrap gap-1 font-bold'>
                    <FaBath />
                    {+listing.bathroom > 1
                      ? `${listing.bathroom} Baths`
                      : '1 Bath'}
                  </li>
                  <li className='flex items-center whitespace-nowrap gap-1 font-bold'>
                    <FaParking />
                    {listing.parking ? 'Parking Spot' : 'No Parking'}
                  </li>
                  <li className='flex items-center whitespace-nowrap gap-1 font-bold'>
                    <FaChair />
                    {listing.furnished ? 'Furnished' : 'Not Furnished'}
                  </li>
                </ul>
                {listing.userRef !== auth.currentUser?.uid &&
                  !contactLandLord && (
                    <div className='mt-6'>
                      <button
                        onClick={() => setContactLandLord(true)}
                        className='w-full text-center p-3 bg-blue-600 text-white font-bold rounded'
                      >
                        Contact Landlord
                      </button>
                    </div>
                  )}
                {contactLandLord && (
                  <Contact userRef={listing.userRef} listing={listing} />
                )}
              </div>
            </div>
            <div className='p-5 w-full h-[400px] md:h-[400px] z-10  md:mt-0 md:ml-2'>
              <MapContainer
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
                className='h-[100%] w-[100%]'
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.address}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </main>
      </section>
    );
  }
}

export default Listing;
