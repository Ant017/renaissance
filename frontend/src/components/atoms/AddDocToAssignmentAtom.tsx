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

type FormData = {
    docLink?: FileList;
}

type AssignmentID = {
    assignmentID?: string;
}
const AddDocToAssignmentAtom = ({ assignmentID }: AssignmentID) => {

    const { addDocToAssignment } = useCourse();

    const state = useSelector((state: any) => state.user);
    const checkString = state.token;

    console.log("assignmentID from doc atom", assignmentID);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            docLink: [] as unknown as FileList,
        },
    });

    const [docLink, setDocLink] = useState<any>([]);

    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
        setDocLink(acceptedFiles);
    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const onSubmit = async () => {
        const formData = new FormData();

        formData.append('documents', docLink[0]);

        console.log({ docLink: docLink })

        if (assignmentID) {
            await addDocToAssignment(assignmentID, formData, checkString);
        }
        else {
            toast.error("Please submit the title and description first")
        }
    };

    return (
        <div className='mt-3 flex flex-col gap-2 items-center border-2 w-[400px] rounded p-3 mx-auto'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 justify-center items-center'>
                <div className='flex items-center gap-2 text-xl'>Upload Assignment
                </div>

                <div {...getRootProps()} className='flex items-center justify-center'>
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

export default AddDocToAssignmentAtom