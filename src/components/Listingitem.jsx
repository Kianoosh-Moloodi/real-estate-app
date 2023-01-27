import React from 'react';
import Moment from 'react-moment';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

function Listingitem({ listing, id }) {
  return (
    <li className='m-3 relative bg-white flex flex-col justify-between items-center shadow-md rounded overflow-hidden'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img
          className='h-[180px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
          loading='lazy'
          src={listing.imgUrls[0]}
          alt=''
        />
        <Moment
          className='absolute top-2 left-2 bg-black text-slate-100 rounded font-bold text-xs p-1'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-3'>
          <div className='flex items-center'>
            <MdLocationOn className='h-4 w-4 text-green-600' />
            <p className='truncate text-xs font-bold'>{listing.address}</p>
          </div>
          <p className='ml-4 truncate text-lg font-bold'>{listing.name}</p>
          <p className='ml-4 mt-2 font-bold text-red-800'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && <span className='ml-1 text-xs'>per Month</span>}
            {listing.type === 'sale' && <span className='ml-1 text-xs'>for Sale</span>}
          </p>
          <div className='flex gap-2 font-bold items-center mt-1 text-xs ml-4'>
            <div className='flex items-center'>
              <p>{`${listing.meterage}`}</p>
              <span className='ml-[2px]'>㎡</span>
            </div>
            <div>
              <p>{listing.rooms > 1 ? `${listing.rooms} Rooms` : '1 Room'}</p>
            </div>
            <div>
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default Listingitem;
