import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import 'react-quill/dist/quill.snow.css';
import useCourse from '../../../hooks/useCourseHooks';
import Dropdown from '../../atoms/Dropdown';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import Button from '../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { IoCloudUpload } from "react-icons/io5";

type FormData = {
    title: string;
    description: string;
    language: string;
    learningOutcome: string;
    requirement: string[];
    topicName: string;
    thumbnail: FileList;
}

const CreateCourseMolecule = () => {
    const navigate = useNavigate();
    const { getTopic, addCourse, getAllCourses, getTeachersCourse } = useCourse();


    const state = useSelector((state: any) => state.user);
    const checkString = state.token;
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            language: '',
            learningOutcome: '',
            requirement: [],
            topicName: '',
            thumbnail: [] as unknown as FileList,
        },
    });

    const [topicOptions, setTopicOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [thumbnail, setThumbnail] = useState<any>([]);
    // const path_ = thumbnail[0]?.path;

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const { data: topicsData } = await getTopic();

                if (Array.isArray(topicsData) && topicsData.length > 0) {
                    const topicOptions = topicsData.map((topic: any) => ({ value: topic.topicName, label: topic.topicName }));
                    setTopicOptions(topicOptions);
                } else {
                    console.error('Invalid topics data:', topicsData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching topics:', error);
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
        setThumbnail(acceptedFiles);
    }, [])



    console.log("thumbnail", thumbnail)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('language', data.language);
        formData.append('learningOutcome', data.learningOutcome);

        const requirements = Array.isArray(data.requirement)
            ? (data.requirement.join(',').split(',') as string[]).map((req) => req.trim())
            : ((data.requirement || '') as string).split(',').map((req) => req.trim());

        console.log(requirements);

        // Join the array using a comma before appending it
        requirements.forEach((requirement) => {
            formData.append('requirement', requirement);
        });

        formData.append('topicName', data.topicName);
        formData.append('file', thumbnail[0]);
        console.log({ ...data, thumbnail: thumbnail });
        console.log(data.title)
        await addCourse(formData, checkString);


        const createdCourseResponse = await getTeachersCourse(checkString);
        // get the last item of the array
        const newCourseId = createdCourseResponse.data[createdCourseResponse.data.length - 1]._id;

        // Add the ID after the link in navigate
        navigate(`create-lesson/${newCourseId}`);

    };

    return (
        <div className="mx-auto mt-4 w-[800px] shadow-lg p-4">
            <h1 className="text-3xl font-bold mb-4">Create Course</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-2'>
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
                                placeholder="Enter course title"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
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
                            required: 'Description  is required',
                            maxLength: {
                                value: 500,
                                message: 'Maximum length must be 500',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter Description"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.description && <h5 className="text-red-500">{String(errors.description.message)}</h5>}
                </div>

                <div>
                    <label>Language</label>
                    <Controller
                        name="language"
                        control={control}
                        rules={{
                            required: 'Language is required',
                            validate: (value) => ['English', 'Bangla'].includes(value) || 'Language must be either English or Bangla',
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter language"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.language ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.language && <h5 className="text-red-500">{String(errors.language.message)}</h5>}
                </div>

                <div>
                    <label>Learning Outcome</label>
                    <Controller
                        name="learningOutcome"
                        control={control}
                        rules={{
                            required: 'Learning outcome  is required',
                            maxLength: {
                                value: 500,
                                message: 'Maximum length must be 3000',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter Learning outcome"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.learningOutcome ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.learningOutcome && <h5 className="text-red-500">{String(errors.learningOutcome.message)}</h5>}
                </div>

                <div>
                    <label>Requirements</label>
                    <Controller
                        name="requirement"
                        control={control}
                        rules={{
                            required: 'At least one requirement is required',
                            validate: (value) => value.length > 0 || 'At least one requirement is required',
                        }}
                        render={({ field }) => (
                            <textarea
                                placeholder="Enter requirements (comma-separated)"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.requirement ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.requirement && (
                        <h5 className="text-red-500">{String(errors.requirement.message)}</h5>
                    )}
                </div>

                <div>
                    <label>Topic</label>
                    <Controller
                        name="topicName"
                        control={control}
                        rules={{
                            required: 'Topic ID is required',
                        }}
                        render={({ field }) => (
                            <Dropdown
                                title="Select Topic"
                                options={topicOptions}
                                selectedOption={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            />
                        )}
                    />
                    {errors.topicName && <h5 className="text-red-500">{String(errors.topicName.message)}</h5>}
                </div>

                <div className='flex flex-col gap-2 items-center justify-center mt-4 border mb-4'>
                    <label className='font-semibold'>Thumbnail</label>
                    <div {...getRootProps()}  className='flex items-center justify-center'>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <IoCloudUpload className='text-gray-500 h-10 w-10 cursor-pointer' />
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <Button
                        type="submit"
                        value="Submit"
                        additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourseMolecule;
