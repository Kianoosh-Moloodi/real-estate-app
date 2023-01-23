import React from 'react';
import { useState } from 'react';

function CreateListing() {
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    meterage: 1,
    rooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    discription: '',
    offer: true,
    regularPrice: 0,
    discountedprice: 0,
  });
  const {
    type,
    name,
    meterage,
    rooms,
    bathrooms,
    parking,
    furnished,
    address,
    discription,
    offer,
    regularPrice,
    discountedprice,
  } = formData;
  const onChange = () => {};
  return (
    <section className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
      <div className='md:w-[65%] lg:w-[50%] mb-12 md:mb-6'>
        <h2 className='text-4xl font-bold mb-9'>Create New Listing</h2>
        <form>
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
              value='sale'
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
            maxLength='32'
            minLength='10'
            required
          />
          <div className='w-full flex gap-3'>
            <div className='w-full'>
              <p className='font-bold'>Meterage</p>
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
          <p className='font-bold'>Describe your property in full!</p>
          <textarea
            className='w-full rounded my-2'
            type='text'
            id='discription'
            value={discription}
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
                <p className='font-bold'>
                  Write your regular price and discount offer!
                </p>
              ) : (
                <p className='font-bold'>What is your property price?</p>
              )}

              <div className='flex gap-3 my-2'>
                <div className='flex w-full'>
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
                      <p className='text-[.8rem]'>Mounth</p>
                    </div>
                  )}
                </div>
                {offer && (
                  <div className='flex w-full'>
                    <input
                      className='w-full rounded'
                      type='number'
                      id='discountedprice'
                      value={discountedprice}
                      onChange={onChange}
                      min='50'
                      max='10000000000'
                      required={offer}
                    />
                    {type === 'rent' && (
                      <div className='ml-2 '>
                        <p>
                          $ <span className='text-[.5rem]'>Per/</span>{' '}
                        </p>
                        <p className='text-[.8rem]'>Mounth</p>
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
            <p className='mb-2 text-[.8rem] text-red-800'>
              The first image will be the cover (up to 6)
            </p>
            <input
              className='w-full bg-white p-2 rounded'
              type='file'
              id='images'
              onChange={onChange}
              accept='.jpg, .png, .jpeg'
              multiple
              required
            />
          </div>
          <button
            className='w-full p-2 bg-black text-white rounded text-bold'
            type='submit'
          >
            Create Your Listing
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateListing;
