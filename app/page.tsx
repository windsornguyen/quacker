/*--------------------------------------------------------------------*/
/* Quacker (Quad + Tracker)                                           */
/* Author: Windsor Nguyen '25                                         */
/*--------------------------------------------------------------------*/

'use client';

import React, { useEffect, useState } from 'react';

import { kv } from '@vercel/kv';
import { Toaster, toast } from 'sonner';

import Loader from './components/loader/page';

/**
 * Quacker component for managing and displaying the number of people in Quad.
 *
 * @return {JSX.Element} The Quacker (Quad + Tracker) component.
 */
const Quacker = () => {
  const [count, setCount] = useState<number>(0);    // Current count in Quad.
  const [loading, setLoading] = useState(true);     // Loading animation state.
  const [open, setOpen] = useState<boolean>(false); // Confirmation dialog state.
  const MAX_CAPACITY: number = 250;                 // Maximum capacity of Quad.

  const capacityMeterStyle = {
    width: `${(count / MAX_CAPACITY) * 100}%`,
  };

  // Load count from KV store on initial render.
  useEffect(() => {
    (async () => {
      try {
        const currentCount: number | null = await kv.get('count');
        if (currentCount !== null) {
          setCount(currentCount);
        } else {
          setCount(count);
          toast('ERROR: Current count is not a valid number');
        }
      } catch (error) {
        toast('ERROR: Failed to load count');
      }
      setLoading(false);
    })();
  });

  /**
   * Getter method to fetch the latest count.
   *
   * @return {Promise<number | undefined>} The latest count or void if there was an error.
   */
  const fetchCount = async (): Promise<number | undefined> => {
    try {
      const currentCount: number | null = await kv.get('count');
      if (currentCount !== null) {
        return currentCount;
      } else {
        toast('ERROR: Current count is not a valid number');
      }
    } catch (error) {
      toast('ERROR: Failed to fetch the latest count');
    }
  };

  /**
   * Updates the count in the key-value store and sets the new count in the component state.
   *
   * @param {number} newCount - The new count to be stored.
   * @return {Promise<void>} - A promise that resolves when the count is updated.
   */
  const updateCount = async (newCount: number): Promise<void> => {
    try {
      await kv.set('count', newCount);
      setCount(newCount);
    } catch (error) {
      toast('ERROR: Failed to update the count');
    }
  };

  /**
   * A function that handles the click event for incrementing or decrementing
   * the count and displaying the corresponding toast message.
   *
   * @param {'increment' | 'decrement'} type - The type of action to perform.
   * @param {number} value - The value to increment or decrement by.
   * @return {Promise<void>} - A Promise that resolves when the function is complete.
   */
  const handleClick = async (type: 'increment' | 'decrement', value: number) => {
    try {
      const currentCount: number | void = await fetchCount();
      if (typeof currentCount === 'number') {
        const newValue =
          type === 'increment' ? currentCount + value : Math.max(currentCount - value, 0);
        await updateCount(newValue);
        toast(
          `${type === 'increment' ? 'Increased' : 'Decreased'} number of people by ${value}, with ${newValue} people currently in Quad.`,
          { position: 'top-center' }
        );
      }
    } catch (error) {
      toast('ERROR: Action failed. Consult Windsor!');
    }
  };

  /**
   * Handles opening the clear confirmation dialog.
   *
   */
  const handleOpenClearConfirm = () => {
    setOpen(true);
  };

  /**
   * Handles opening the clear confirmation dialog.
   *
   */
  const handleCloseClearConfirm = () => {
    setOpen(false);
  };

  /**
   * Handle the confirmation for clearing the count.
   *
   * @return {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const handleClearConfirm = async (): Promise<void> => {
    updateCount(0);
    toast('Count reset to 0!', { position: 'top-center' });
    handleCloseClearConfirm();
  };

  /**
   * Handles the refresh operation.
   *
   * @return {Promise<void>} - A promise that resolves when the operation is complete.
   */
  const handleRefresh = async (): Promise<void> => {
    try {
      const currentCount: number | undefined = await fetchCount();
      if (typeof currentCount === 'number') {
        setCount(currentCount);
        toast('Success! Count updated.', { position: 'top-center' });
      } else {
        toast('ERROR: Current count is not a valid number');
      }
    } catch (error) {
      toast('ERROR: Failed to refresh. Consult Windsor!');
    }
  };

  /**
   * Fetches the color of the meter based on the current count and the maximum capacity.
   *
   * @return {Promise<string>} - The color class for the meter based on the percentage.
   */
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

      <Toaster className='center-toast text-center' />
      <div className='text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-quad-yellow rounded-md text-center px-2 m-8'>
        Number of people currently in Quad
      </div>
      <div className='w-full max-w-xs sm:max-w-sm flex flex-col items-center justify-center p-4 sm:p-5 m-4 sm:m-5 bg-quad-blue rounded-lg mb-12'>
        <h2
          className={`text-6xl sm:text-8xl font-bold text-quad-yellow mb-8 mt-8 ${loading ? '' : 'fade-in'}`}
        >
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
            onClick={handleCloseClearConfirm}
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
                  onClick={handleCloseClearConfirm}
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
