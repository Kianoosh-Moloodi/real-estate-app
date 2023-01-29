import React from 'react';
import Moment from 'react-moment';
import { BiCurrentLocation } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';

function Listingitem({ listing, id, onDelete, onEdit }) {
  return (
    <li className='m-4 relative bg-white flex flex-col justify-between items-center shadow-md rounded overflow-hidden'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img
          className='h-[160px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
          loading='lazy'
          src={listing.imgUrls[0]}
          alt=''
        />
        <Moment
          className='absolute top-2 left-2 bg-green-700 text-white rounded text-xs p-1'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-2'>
          <div className='flex items-center'>
            <BiCurrentLocation className='h-3 w-4 text-green-700' />
            <p className='truncate text-xs font-bold text-green-700'>
              {listing.address}
            </p>
          </div>
          <p className='ml-4 mt-2 truncate text-lg font-bold'>{listing.name}</p>
          <p className='ml-4  font-bold text-red-700'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            {listing.type === 'rent' && (
              <span className='ml-1 text-xs'>per Month</span>
            )}
            {listing.type === 'sale' && (
              <span className='ml-1 text-xs'>for Sale</span>
            )}
          </p>
          <div className='flex gap-3  items-center mt-3 text-xs ml-4'>
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
      <div className='flex'>
        {onDelete && (
          <FaTrash
            className='absolute bottom-2.5 right-2 cursor-pointer text-red-700 text-[12px]'
            onClick={() => onDelete(listing.id)}
          />
        )}
        {onEdit && (
          <BiEdit
            className='absolute bottom-2 right-7 cursor-pointer text-green-700 text-[15px]'
            onClick={() => onEdit(listing.id)}
          />
        )}
      </div>
    </li>
  );
}

export default Listingitem;
