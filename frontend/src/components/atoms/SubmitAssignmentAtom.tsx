import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import 'react-quill/dist/quill.snow.css';
import useCourse from '../../hooks/useCourseHooks';
import Dropdown from '../atoms/Dropdown';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { IoCloudUpload } from "react-icons/io5";
import { toast } from 'react-toastify';
import { FaMinus } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';

type FormData = {
    documents?: FileList;
}
const SubmitAssignmentAtom = () => {

    const { submitAssignment } = useCourse();

    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const courseID = pathArray[pathArray.length - 1];

    const state = useSelector((state: any) => state.user);
    const checkString = state.token;

    console.log("assignmentID from doc atom", courseID);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            documents: [] as unknown as FileList,
        },
    });

    const [documents, setDocuments] = useState<any>([]);

    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
        setDocuments(acceptedFiles);
    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const onSubmit = async () => {
        const formData = new FormData();

        formData.append('documents', documents[0]);

        console.log({ documents: documents })

        if (courseID) {
            await submitAssignment(courseID, formData, checkString);
        }
        else {
            toast.error("Course Not found")
        }
    };

    return (
        <div className='mt-3 flex flex-col gap-2 items-center border-2 w-[700px] rounded p-3 mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 justify-center items-center'>
                <div className='flex items-center gap-2 text-xl'>Upload Assignment
                </div>

                <div {...getRootProps()} className='flex items-center justify-center z-10'>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <IoCloudUpload className='text-gray-500 h-10 w-10' />

                    }
                </div>

                <div className="mb-4" >
                    <Button
                        type="submit"
                        value="Add"
                        additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SubmitAssignmentAtom