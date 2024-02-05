/**
 * Function component for displaying a loader.
 *
 * @return {JSX.Element} The loader component
 */
const Loader = () => {
  return (
    <div className='container text-6xl sm:text-8xl font-bold text-quad-yellow mb-8 mt-8 fade-enter-active'>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
      <div className='cube'>
        <div className='cube__inner'></div>
      </div>
    </div>
  );
};

export default Loader;
