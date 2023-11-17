import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useCourse from '../../hooks/useCourseHooks';
import Dropdown from '../atoms/Dropdown';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

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
    const { getTopic, addCourse } = useCourse();
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })



    const onSubmit = async (data: FormData) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('language', data.language);
        formData.append('learningOutcome', data.learningOutcome);
        formData.append('requirement', JSON.stringify(data.requirement));
        formData.append('topicName', data.topicName);
        formData.append('thumbnail', thumbnail);
        // Handle form submission logic here
        console.log({ ...data, thumbnail: thumbnail });
        // call add course from hook
        await addCourse(formData, checkString);
    };

    return (
        <div className="container mx-auto mt-8">
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
                            validate: (value) => ['english', 'bangla'].includes(value) || 'Language must be either English or Bangla',
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
                    <label>Learning outcome</label>
                    <Controller
                        name="learningOutcome"
                        control={control}
                        rules={{
                            required: 'Learning outcome is required',
                            maxLength: {
                                value: 1000,
                                message: 'Maximum length must be 1000',
                            },
                        }}
                        render={({ field }) => (
                            <ReactQuill
                                {...field}
                                theme="snow"
                                placeholder="Enter Learning outcome"
                                className={`w-full border ${errors.learningOutcome ? 'border-red-500' : ''}`}
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
                            <div>
                                <input
                                    placeholder="Enter requirement"
                                    {...field}
                                    className={`w-full px-4 py-2 border rounded ${errors.requirement ? 'border-red-500' : ''}`}
                                />
                                {errors.requirement && (
                                    <h5 className="text-red-500">{String(errors.requirement.message)}</h5>
                                )}
                            </div>
                        )}
                    />
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
                                selectedOption={field.value}  // Use field.value instead of watch('topicName')
                                onChange={(e) => field.onChange(e.target.value)}  // Use field.onChange to update the form state
                            />
                        )}
                    />
                    {errors.topicName && <h5 className="text-red-500">{String(errors.topicName.message)}</h5>}
                </div>

                <div>
                    <label>Thumbnail</label>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p>Drop the files here ...</p> :
                                <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                    </div>
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourseMolecule;
