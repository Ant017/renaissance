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
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';

type FormData = {
    _id?: string;
    title?: string;
    description?: string;
};

type Props = {
    onLessonRemove: () => void;
    onLessonIdChange: (lessonId: string | undefined) => void;
}

const CreateLessonAtom = ({ onLessonRemove, onLessonIdChange }: Props) => {
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const courseID = pathArray[pathArray.length - 1];

    const { addLesson, getTeachersLesson } = useCourse();

    const state = useSelector((state: any) => state.user);
    const checkString = state.token;

    const [videoDivs, setVideoDivs] = useState<number[]>([1]);
    const [NoteDivs, setNoteDivs] = useState<number[]>([1]);

    const addDivVideo = () => {
        setVideoDivs([...videoDivs, videoDivs.length + 1]);
    };

    const removeDivVideo = (index: number) => {
        const updatedDivs = videoDivs.filter((_, i) => i !== index);
        setVideoDivs(updatedDivs);
    };

    const addDivNote = () => {
        setNoteDivs([...NoteDivs, NoteDivs.length + 1]);
    };

    const removeDivNote = (index: number) => {
        const updatedDivs = NoteDivs.filter((_, i) => i !== index);
        setNoteDivs(updatedDivs);
    };

    const [lessonid, setLessonid] = useState<string | undefined>(undefined);

    console.log("lesson id from lesson atom:", lessonid);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
        },
    });
    const onSubmit = async (data: FormData) => {
        const formData = new FormData();

        formData.append('title', data.title ?? '');
        formData.append('description', data.description ?? '');

        console.log({ ...data })

        await addLesson(courseID, formData, checkString);

        const createdLessonResponse = await getTeachersLesson(checkString);
        console.log("createdLessonResponse", createdLessonResponse)

        // Check if the array has at least one element before accessing the last one
        if (createdLessonResponse.length > 0) {
            const newLessonID = createdLessonResponse[createdLessonResponse.length - 1]
            setLessonid(newLessonID);
            onLessonIdChange(newLessonID);
        } else {
            console.log("The array is empty.");
        }

    };

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
        <div className='flex flex-col gap-2 items-center shadow-lg w-[800px] rounded p-3 mx-auto'>
            <FaMinus onClick={onLessonRemove}
                className="bg-red-500 text-white rounded- p-1 w-5 h-5 cursor-pointer" />Remove this lesson
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col w-[700px]'>
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
                                placeholder="Enter lesson title"
                                {...field}
                                className={`w-full px-4 py-2 bg-gray-200 rounded ${errors.title ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.title && <h5 className="text-red-500">{String(errors.title.message)}</h5>}
                </div>

                <div>
                    <label>Description</label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required: 'Description is required',
                            maxLength: {
                                value: 500,
                                message: 'Maximum length must be 500',
                            },
                        }}
                        render={({ field }) => (
                            <textarea
                                placeholder="Enter lesson description"
                                {...field}
                                className={`w-full px-4 py-2 bg-gray-200 rounded ${errors.description ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.description && <h5 className="text-red-500">{String(errors.description.message)}</h5>}
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

            <FaPlus onClick={addDivVideo}
                className="bg-green-500 text-white rounded p-1 w-6 h-6 cursor-pointer" />
            Add another video
            {videoDivs.map((_, index) => (
                <AddVideoToLessonAtom key={index} onRemove={() => removeDivVideo(index)} lessonID={lessonid} />
            ))}
            <FaPlus onClick={addDivNote}
                className="bg-green-500 text-white rounded p-1 w-6 h-6 cursor-pointer" />
            Add another note
            {NoteDivs.map((_, index) => (
                <AddNoteToLessonAtom key={index} onRemove={() => removeDivNote(index)} lessonID={lessonid} />
            ))}
        </div>
    )
}

export default CreateLessonAtom