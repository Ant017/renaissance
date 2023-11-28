// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { TbUserQuestion } from 'react-icons/tb';
import { TbUserCheck } from "react-icons/tb";
import Button from '../../atoms/Button';
import Modal from 'react-modal';
import { CgCloseR } from 'react-icons/cg';
import { useForm, Controller } from 'react-hook-form';
import useForum from '../../../hooks/useForumHooks';

type UserType = {
  _id?: string;
  username?: string;
  email?: string;
};

type AnswerType = {
  userWithAnswer?: UserType;
  answer?: string;
  _id?: string;
};

type QuestionType = {
  _id?: string;
  courseID?: string;
  userWithQuestion?: UserType;
  question?: string;
  isAnswered?: boolean;
  answers?: AnswerType[];
  createdAt?: string;
  updatedAt?: string;
};

type FormData = {
  question?: string;
}

type FormAnswerData = {
  answer?: string;
}

const ForumMolecule = () => {
  const location = useLocation();
  const pathArray = location.pathname.split('/');
  const courseID = pathArray[pathArray.length - 1];

  const state = useSelector((state: any) => state.user);
  const checkString = state.token;

  const [forum, setForum] = useState<QuestionType[] | null>(null);

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

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await axiosInstance.get(`/forum/get-forum/${courseID}`, {
          headers: {
            Authorization: `Bearer ${checkString}`,
            'Content-Type': 'application/json',
          },
        });
         setForum(response.data.data || []);
      } catch (error) {
        console.error('Error fetching forum questions:', error);
      }
    };

    fetchForum();
  }, [courseID, checkString]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [forumID, setForumID] = useState<string>('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openAnswerModal = () => {
    setForumID(currentQuestion?._id || '');
    setAnswerModalOpen(true);
  };

  console.log("current question", currentQuestion);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeAnswerModal = () => {
    setAnswerModalOpen(false);
  };

  const { addQuestion, addAnswer } = useForum();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      question: '',
    },
  });
  const onSubmit = async (data: FormData) => {
    try {
      await addQuestion(courseID, data.question ?? '', checkString);
      // Fetch the updated forum data after posting the question
      const updatedForum = await axiosInstance.get(`/forum/get-forum/${courseID}`, {
        headers: {
          Authorization: `Bearer ${checkString}`,
          'Content-Type': 'application/json',
        },
      });
      setForum(updatedForum.data.data || []);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error posting question:', error);
    }
  };

  const onAnswerSubmit = async (data: FormAnswerData) => {
    try {
      await addAnswer(forumID, data.answer ?? '', checkString);
      // Fetch the updated forum data after posting the answer
      const updatedForum = await axiosInstance.get(`/forum/get-forum/${courseID}`, {
        headers: {
          Authorization: `Bearer ${checkString}`,
          'Content-Type': 'application/json',
        },
      });
      setForum(updatedForum.data.data || []);
      setAnswerModalOpen(false);
    } catch (error) {
      console.error('Error posting answer:', error);
    }
  };

  return (
    <div className='flex flex-col px-10 py-4'>
      <p className='text-md font-semibold mb-4'>Forum Questions ({Array.isArray(forum) ? forum.length : 0})</p>
      {Array.isArray(forum) &&
        forum.map((question) => (
          <div key={question._id} className='flex flex-col gap-3 shadow-lg rounded-lg p-5'>
            <div className='flex items-center gap-3'>
              <TbUserQuestion size={24} />
              <div>
                <p>{question?.userWithQuestion?.username}</p>
                <p className='text-gray-500 text-sm'>{formatDate(question?.createdAt || '')}</p>
              </div>
            </div>
            {/* <div className='flex'> */}
            <p className='text-lg font-semibold'>{question?.question}</p>

            {/* </div> */}

            {/* Answer section */}
            {question.isAnswered && (
              <div className='flex items-center gap-3'>

                {/* <div> */}
                {/* <h3 className='text-lg font-semibold'>Answers:</h3> */}
                <div className='flex flex-col items-center gap-3'>

                  {question.answers?.map((answer) => (
                    <div key={answer._id} className='ml-5'>
                      <div key={answer._id} className='flex gap-1'>
                        <TbUserCheck size={24} />
                        <p>{answer.userWithAnswer?.username}</p>

                      </div>
                      <p className='text-gray-500'>{answer.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button value="Write an Answer" type="button" onClick={() => {
              setCurrentQuestion(question);
              openAnswerModal();
            }}
              additionalStyles="bg-blue-500 text-white text-md font-semibold py-1 px-4 rounded" />
            <Modal
              isOpen={answerModalOpen}
              onRequestClose={closeModal}
              ariaHideApp={false}
              contentLabel="Example Modal"
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                  width: '50%',
                  height: '50%',
                  margin: 'auto',
                  borderRadius: '10px',
                  overflow: 'auto',
                },
              }}>
              <div>
                <h2 className="text-2xl font-bold mb-4">Write Your Answer</h2>
                <form onSubmit={handleSubmit(onAnswerSubmit)}>
                  <div>
                    <label>Your Answer</label>
                    <Controller
                      name="answer"
                      control={control}
                      rules={{
                        maxLength: {
                          value: 500,
                          message: 'Maximum length must be 500',
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          placeholder="Enter your answer"
                          {...field}
                          className={`my-2 w-full h-[100px] px-4 py-2 border rounded ${errors.answer ? 'border-red-500' : ''}`}
                        />
                      )}
                    />
                    {errors.answer && <h5 className="text-red-500">{String(errors.answer.message)}</h5>}
                  </div>

                  <div className="mb-4">
                    <Button
                      type="submit"
                      value="Submit"
                      additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </Button>
                  </div>

                </form>
              </div>
              <CgCloseR className='text-2xl absolute top-3 right-3 text-gray-700 cursor-pointer' onClick={closeAnswerModal} />
            </Modal>
          </div>

        ))}
      <div className=' mt-3 flex justify-center items-center'>
        <Button
          value='Post a Question'
          type='button'
          onClick={openModal}
          additionalStyles='m-auto bg-blue-500 text-white text-md font-semibold py-2 px-4 rounded'></Button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
            borderRadius: '10px',
            overflow: 'auto',
          },
        }}>
        <div>
          <h2 className="text-2xl font-bold mb-4">Post a Question</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label>Your Question</label>
              <Controller
                name="question"
                control={control}
                rules={{
                  maxLength: {
                    value: 500,
                    message: 'Maximum length must be 500',
                  },
                }}
                render={({ field }) => (
                  <textarea
                    placeholder="Enter your Question"
                    {...field}
                    className={`my-2 w-full h-[100px] px-4 py-2 border rounded ${errors.question ? 'border-red-500' : ''}`}
                  />
                )}
              />
              {errors.question && <h5 className="text-red-500">{String(errors.question.message)}</h5>}
            </div>

            <div className="mb-4">
              <Button
                type="submit"
                value="Submit"
                additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </Button>
            </div>

          </form>
        </div>
        <CgCloseR className='text-2xl absolute top-3 right-3 text-gray-700 cursor-pointer' onClick={closeModal} />
      </Modal>
    </div>
  );
};

export default ForumMolecule;
