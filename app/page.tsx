'use client';

import React, { useEffect, useState } from 'react';

import { kv } from '@vercel/kv';
import { Toaster, toast } from 'sonner';

import Loader from './components/loader/page';

/**
 * Quacker component for managing and displaying the number of people in Quad.
 *
 * @return {JSX.Element} The Quacker component
 */
const Quacker = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const MAX_CAPACITY: number = 250;

  useEffect(() => {
    (async () => {
      try {
        const currentCount: string | null | undefined = await kv.get('count');
        setCount(currentCount ? parseInt(currentCount, 10) : 0);
        setLoading(false);
      } catch (error) {
        toast('ERROR: Failed to load count');
        setLoading(false); // Ensure loading is set to false even on error
      }
    })();
  }, []);

  const updateCount = async (newCount: number) => {
    try {
      await kv.set('count', newCount.toString());
      setCount(newCount);
    } catch (error) {
      toast('ERROR: Failed to update count');
    }
  };

  const fetchCount = async () => {
    try {
      const currentCount = await kv.get('count');
      if (currentCount === null) {
        await updateCount(0);
      } else if (typeof currentCount === 'string') {
        setCount(parseInt(currentCount, 10));
      }
    } catch (error) {
      toast('ERROR: Failed to fetch count from server');
    }
  };

  const getMeterColor = (): string => {
    const percentage: number = count / MAX_CAPACITY;
    if (percentage < 0.5) {
      return 'bg-green-600';
    }
    if (percentage < 0.8) {
      return 'bg-yellow-600';
    }
    return 'bg-red-600';
  };

  const capacityMeterStyle = {
    width: `${(count / MAX_CAPACITY) * 100}%`,
  };

  const handleClick = (type: 'increment' | 'decrement', value: number): void => {
    const newValue: number = type === 'increment' ? count + value : Math.max(count - value, 0);
    updateCount(newValue);
    toast(
      `${type === 'increment' ? 'Increased' : 'Decreased'} number of people by ${value}, with ${newValue} people currently in Quad.`
    );
  };

  const handleOpenClearConfirm = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleRefresh = (): void => {
    try {
      toast('Success! Count updated.');
      fetchCount();
    } catch (error) {
      toast('ERROR: Failed to fetch count from server');
    }
  };

  const handleClearConfirm = (): void => {
    updateCount(0);
    handleClose();
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div
        className='absolute inset-0 -z-10 transform-gpu overflow-hidden blur-2xl'
        aria-hidden='true'
      >
        <div
          className='relative left-1/2 top-1/2 aspect-square w-3/4 max-w-lg -translate-x-1/2 -translate-y-1/2 rotate-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-30 sm:w-1/2 md:w-2/3 lg:w-3/4 animate-gradient rotate-continuous'
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        />
      </div>

      <Toaster />
      <div className='text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-quad-yellow rounded-md text-center px-2 mb-8'>
        Number of people currently in Quad
      </div>
      <div className='w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center p-4 sm:p-5 m-4 sm:m-5 bg-quad-blue rounded-lg mb-12'>
        <h2 className='text-6xl sm:text-8xl font-bold text-quad-yellow mb-8 mt-8'>
          {loading ? <Loader /> : count}
        </h2>
        <div className='w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-10'>
          <div
            style={capacityMeterStyle}
            className={`${getMeterColor()} h-full rounded-full`}
          ></div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 px-2 mb-8'>
        <div className='flex flex-wrap justify-center gap-4 mb-8'>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <button
              key={`inc-${value}`}
              className='bg-quad-blue text-quad-yellow font-bold py-2 px-4 rounded hover:bg-green-800 transition duration-150 ease-in-out w-auto h-10 text-sm'
              onClick={() => handleClick('increment', value)}
            >
              +{value}
            </button>
          ))}
        </div>
        <div className='flex flex-wrap justify-center gap-4 mb-8'>
          {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
            <button
              key={`dec-${value}`}
              className='bg-quad-blue text-quad-gray font-bold py-2 px-4 rounded hover:bg-red-800 transition duration-150 ease-in-out w-auto h-10 text-sm'
              onClick={() => handleClick('decrement', value)}
            >
              -{value}
            </button>
          ))}
        </div>

        <button
          className='bg-quad-blue text-quad-yellow font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-150 ease-in-out'
          onClick={handleRefresh}
        >
          Refresh
        </button>

        <button
          className='bg-quad-yellow text-gray-800 font-bold py-2 px-4 rounded hover:bg-yellow-400 transition duration-150 ease-in-out mt-4'
          onClick={handleOpenClearConfirm}
        >
          Clear
        </button>
      </div>

      {open && (
        <div>
          <div
            className='modal-backdrop fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 z-50'
            onClick={handleClose}
          ></div>
          <div className='modal-entrance fixed inset-0 flex justify-center items-center z-50'>
            <div
              className='p-5 m-5 bg-white font-semibold rounded-lg max-w-xs sm:max-w-md md:w-1/2 lg:w-1/3 xl:w-1/4 shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <p className='text-xl sm:text-2xl text-black text-center'>
                Are you sure you want to reset the count to 0?
              </p>
              <div className='mt-5 flex justify-center items-center gap-4'>
                <button
                  className='bg-quad-blue text-quad-yellow rounded px-4 py-2'
                  onClick={handleClearConfirm}
                >
                  Confirm
                </button>
                <button
                  className='bg-quad-blue text-gray-200 rounded px-4 py-2'
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quacker;
