import React from 'react';
import useCourse from '../../../hooks/useCourseHooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { CgCloseR } from 'react-icons/cg';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Button from '../../atoms/Button';

type AssignmentData = {
    _id?: string;
    studentID?: string;
    courseID?: string;
    endQuizTime?: string;
    quizAnswer?: string[];
    quizScore?: number;
    assignmentAnswer?: string;
    assignmentScore?: number;
    isPassedInQuiz?: boolean;
    chance?: number;
    isPassedInAssignment?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};

type Props = {
    data: AssignmentData;
};

type FormData = {
    assignmentScore?: number;
};

const EvaluateAssignmentsMolecule = () => {
    const { getAssignmentEvaluation, evaluateAssignment } = useCourse();

    const state = useSelector((state: any) => state.user);
    const checkString = state.token;

    const [assignmentAnswer, setAssignmentAnswer] = useState<any[]>([]);
    const [courseID, setCourseID] = useState<string | undefined>(undefined);
    const [studentID, setStudentID] = useState<string | undefined>(undefined);

    useEffect(() => {
        getAssignmentEvaluation(checkString).then((data) => {
            console.log(data);
            setAssignmentAnswer(data);
        });
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            assignmentScore: 0,
        },
    });

    const onSubmit = async (data: FormData) => {
        if (courseID && studentID) {
            console.log(Number(data.assignmentScore));
            const bodyData = {
                assignmentScore: Number(data.assignmentScore),
            }
            // formData.append('assignmentScore', String(Number(data.assignmentScore)));
            // console.log({ ...data });
            await evaluateAssignment(courseID, studentID, bodyData, checkString);
        }
    };


    console.log("assignmentAnswer: ", assignmentAnswer);
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {assignmentAnswer?.map((data: any) => (
                <div key={data._id} className="shadow-lg p-4">
                    <img
                        src={data.courseID?.thumbnail}
                        alt="Course Thumbnail"
                        className="mb-2 w-full h-32 object-cover rounded"
                    />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            {data.courseID?.title}
                        </h3>
                        <p className="text-gray-600 mb-3">Submitted by: {data.studentID.username}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-10">
                            <a href={data.assignmentAnswer}>
                                Get Document
                            </a>
                        </button>
                        <button
                            onClick={() => {
                                openModal();
                                setCourseID(data?.courseID._id);
                                setStudentID(data?.studentID._id);
                                console.log("courseID: ", courseID, "studentID: ", studentID);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded">Evaluate</button>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            ariaHideApp={true}
                            contentLabel="Example Modal"
                            style={{
                                overlay: {
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 50,
                                },
                                content: {
                                    width: "800px",
                                    height: "300px",
                                    margin: "auto",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    background: "white",
                                    border: "none",
                                    padding: 0,
                                    color: "black",
                                },
                            }}
                        >
                            <div className='flex flex-col gap-3 justify-center mt-7 ml-7'>
                                <h2 className="text-2xl font-bold mb-4">Write a score</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className='p-4'>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">Score</label>
                                        <Controller
                                            name="assignmentScore"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="number"
                                                    placeholder="Write a comment"
                                                    {...field}
                                                    className={`w-full px-4 py-2 border rounded ${errors.assignmentScore ? 'border-red-500' : ''}`}
                                                />
                                            )}
                                        />
                                        {errors.assignmentScore && <h5 className="text-red-500">{String(errors.assignmentScore.message)}</h5>}
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
                            <CgCloseR
                                className="text-2xl absolute top-[40px] right-3 text-gray-700 cursor-pointer"
                                onClick={closeModal}
                            />
                        </Modal>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EvaluateAssignmentsMolecule;
