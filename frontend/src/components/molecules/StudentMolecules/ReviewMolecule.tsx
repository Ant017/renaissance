import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Rating from 'react-rating-stars-component';
import { format } from 'date-fns';
import { RiUserStarLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { LuTrash2 } from 'react-icons/lu';
import { BiSolidEdit } from 'react-icons/bi';
import useReview from '../../../hooks/useReviewHooks';
import { axiosInstance } from '../../../utils/axiosInstance';

type Review = {
  _id: string;
  courseID: string;
  userID: {
    _id: string;
    username: string;
    email: string;
  };
  rating: number;
  text: string;
  likes: any[];
  dislikes: any[];
  createdAt: string;
};

type SingleCourse = {
  _id?: string;
  reviews?: Review[];
  // Add other properties from SingleCourse as needed
};

const ReviewMolecule = () => {
  const location = useLocation();
  const singleCourse = location.state?.singleCourse as SingleCourse;

  const state = useSelector((state: any) => state.user);
  const checkString = state.token;

  const { deleteReview } = useReview();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  };

  const [myReview, setMyReview] = useState<Review | null>(null);
  const [otherReviews, setOtherReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const response = await axiosInstance.get(`/review/get-your-review/${singleCourse._id}`, {
          headers: {
            Authorization: `Bearer ${checkString}`,
            'Content-Type': 'application/json',
          },
        });
        setMyReview(response.data.data);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    fetchReviewData();
  }, [checkString, singleCourse._id]);

  console.log("singleCourse", singleCourse.reviews);

  useEffect(() => {
    // Filter out user's review from all reviews
    const filteredReviews =
      singleCourse?.reviews?.filter((review) => review.userID._id !== myReview?.userID._id) || [];
    setOtherReviews(filteredReviews);
  }, [singleCourse?.reviews, myReview]);

  const handleDeleteReview = async () => {
    try {
      if (myReview?._id) {
        await deleteReview(myReview._id, checkString);
  
        // Remove the deleted review from the state
        const updatedOtherReviews = otherReviews.filter((review) => review.userID._id !== myReview.userID._id);
        setOtherReviews(updatedOtherReviews);
  
        // Set the user's review to null since it's deleted
        setMyReview(null);
      } else {
        console.error('Review ID is undefined.');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  

  return (
    <div className='flex flex-col px-10 py-4'>
      <p className='text-md font-semibold mb-4'>Reviews ({singleCourse?.reviews?.length || 0})</p>
      <div>
        {myReview ? (
          <div className=' flex justify-between shadow-lg rounded-lg p-5'>
            <div>
              <p className='text-md font-semibold mb-4'>Your Review</p>
              <div className='flex items-center gap-3'>
                <RiUserStarLine size={24} />
                <div>
                  <p>{myReview?.userID?.username}</p>
                  <p className='text-gray-500 text-sm'>{formatDate(myReview?.createdAt || '')}</p>
                </div>
              </div>
              <div className='flex items-center ml-7'>
                <Rating
                  count={5}
                  value={myReview?.rating}
                  edit={false}
                  size={24}
                  emptyIcon={<FaRegStar />}
                  fullIcon={<FaStar />}
                  color1={'#f2f2f2'}
                  color2={'#FFD700'}
                />
                <p>({myReview?.rating}/5)</p>
              </div>
              <p className='ml-8 text-gray-800'>{myReview?.text}</p>
            </div>
            <div className='flex gap-5 items-end mr-5'>
              {/* <BiSolidEdit size={24} className='cursor-pointer text-green-600' /> */}
              <LuTrash2
                size={24}
                className='cursor-pointer text-red-600'
                onClick={handleDeleteReview}
              />
            </div>
          </div>
        ) : null}

        {otherReviews.map((review: Review, index: number) => (
          <div key={index} className='shadow-lg rounded-lg p-5'>
            <div className='flex items-center gap-3'>
              <RiUserStarLine size={24} />
              <div>
                <p>{review.userID?.username}</p>
                <p className='text-gray-500 text-sm'>{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <div className='flex items-center ml-7'>
              <Rating
                count={5}
                value={review.rating}
                edit={false}
                size={24}
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
                color1={'#f2f2f2'}
                color2={'#FFD700'}
              />
              <p>({review.rating}/5)</p>
            </div>
            <p className='ml-8 text-gray-800'>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewMolecule;
