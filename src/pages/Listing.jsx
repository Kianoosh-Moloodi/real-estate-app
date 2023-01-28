import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
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
        </main>
      </section>
    );
  }
}

export default Listing;
