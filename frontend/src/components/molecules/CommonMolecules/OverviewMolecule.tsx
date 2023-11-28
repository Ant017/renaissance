import { useLocation } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

type Props = {};

const OverviewMolecule = (props: Props) => {
  const location = useLocation();
  const singleCourse = location.state?.singleCourse;

  return (
    <div className='flex flex-col px-10 mb-9'>
      <div className='shadow-lg rounded-lg p-5'>
        <h1 className='text-3xl font-bold mb-4'>Overview</h1>
        <p className='text-gray-700 mb-6'>{singleCourse?.description}</p>
      </div>

      <h4 className='text-2xl font-bold mt-8 mb-2'>What You Will Learn</h4>
      <p className='text-gray-700'>{singleCourse?.learingOutcome}</p>

      <h4 className='text-2xl font-bold mt-4 mb-2'>Prerequisites</h4>
      <ul className='list-disc pl-6'>
        {singleCourse?.requirement?.map((requirement: string, index: number) => (
          <li key={index} className='flex items-center text-gray-700'>
            <FaCheck className='mr-2 text-green-500' /> {/* Tick icon */}
            {requirement}
          </li>
        ))}
        {!singleCourse?.requirement && <li className='text-gray-700'>None</li>}
      </ul>
    </div>
  );
};

export default OverviewMolecule;
