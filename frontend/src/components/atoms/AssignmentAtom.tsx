import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import 'react-quill/dist/quill.snow.css';
import useCourse from '../../hooks/useCourseHooks';
import Dropdown from '../atoms/Dropdown';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AddVideoToLessonAtom from './AddVideoToLessonAtom';
import AddNoteToLessonAtom from './AddNotesToLessonsAtom';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa6';
import AddDocToAssignmentAtom from '../atoms/AddDocToAssignmentAtom';

type FormData = {
    _id?: string;
    title?: string;
    totalMarks?: number;
};

// type Props = {
//     // onLessonRemove: () => void;
//     onAssignmentIdChange: (assignmentId: string | undefined) => void;
// }

const AssignmentAtom = () => {
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const courseID = pathArray[pathArray.length - 1];

    // instead of getTeacherLesson, add getCourseAssignment api
    const { addAssignment, getAssignmentForCourse } = useCourse();

    const state = useSelector((state: any) => state.user);
    const checkString = state.token;

    // const addDivNote = () => {
    //     setNoteDivs([...NoteDivs, NoteDivs.length + 1]);
    // };

    const [assignmentid, setAssignmentid] = useState<string | undefined>(undefined);

    console.log("ass id from ass atom:", courseID);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            totalMarks: '',
        },
    });
    const onSubmit = async (data: { title: string; totalMarks: string }) => {
        const formData = new FormData();

        formData.append('title', data.title ?? '');
        formData.append('totalMarks', String(Number(data.totalMarks ?? '')));

        // console.log({ ...data })

        await addAssignment(courseID, formData, checkString);

        const createdAssignmentResponse = await getAssignmentForCourse(checkString, courseID);
        console.log("createdAssignmentResponse", createdAssignmentResponse)

        if (createdAssignmentResponse) {
            const newAssignmentID = createdAssignmentResponse.data._id;
            setAssignmentid(newAssignmentID);
            console.log("ASS ID", newAssignmentID);
            // onAssignmentIdChange(newAssignmentID);
        } else {
            console.log("The array is empty.");
        }
    };

    // console.log("courseID", courseID);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const message = "Are you sure you want to leave? Your changes may not be saved.";

            // Standard for most browsers
            event.returnValue = message;

            // For some older browsers
            return message;
        };

        // Attach the event listener when the component mounts
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div className="w-md mx-auto">
            {/* <FaMinus onClick={onLessonRemove} /> */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Title</label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{
                            required: 'Title is required',
                            minLength: {
                                value: 4,
                                message: 'Minimum length must be 4',
                            },
                            maxLength: {
                                value: 100,
                                message: 'Maximum length must be 100',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter Assignment title"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.title && <h5 className="text-red-500">{String(errors.title.message)}</h5>}
                </div>

                <div>
                    <label>Total Marks</label>
                    <Controller
                        name="totalMarks"
                        control={control}
                        rules={{
                            required: 'Total marks is required',
                            maxLength: {
                                value: 500,
                                message: 'Maximum length must be 500',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter total marks"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.totalMarks ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.totalMarks && <h5 className="text-red-500">{String(errors.totalMarks.message)}</h5>}
                </div>

                <div className="mt-4">
                    <Button
                        type="submit"
                        value="Submit"
                        additionalStyles="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit
                    </Button>
                </div>
            </form>
            <AddDocToAssignmentAtom assignmentID={assignmentid} />
        </div>
    )
}

export default AssignmentAtom