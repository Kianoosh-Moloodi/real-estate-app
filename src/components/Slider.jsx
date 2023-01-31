import React from 'react';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper';
import 'swiper/css/bundle';
import { useNavigate } from 'react-router';

function Slider() {
  const [listings, setLisitngs] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLisitngs = async () => {
      const lisitngsRef = collection(db, 'listings');
      const q = query(lisitngsRef, orderBy('timesstamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setLisitngs(listings);
      setLoading(false);
    };
    fetchLisitngs();
  }, [listings]);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <p>There is no Listings to Show</p>;
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          Navigation
          pagination={{ type: 'progressbar' }}
          effect='fade'
          modules={[EffectFade]}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                className='w-full overflow-hidden h-96 relative'
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat backgroundSize: 'cover'`,
                }}
              ></div>
              <p className='text-white m-2 p-2 bg-black absolute left-1 top-3'>
                {data.name}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
