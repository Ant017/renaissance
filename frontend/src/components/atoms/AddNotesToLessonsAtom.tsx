import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import "react-quill/dist/quill.snow.css";
import useCourse from "../../hooks/useCourseHooks";
import Dropdown from "../atoms/Dropdown";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import { IoCloudUpload } from "react-icons/io5";
import { toast } from "react-toastify";
import { FaMinus } from "react-icons/fa6";

type FormData = {
  _id?: string;
  noteTitle?: string;
  noteLink?: FileList;
};

type LessonID = {
  lessonID?: string;
  onRemove: () => void;
};
const AddNoteToLessonAtom = ({ lessonID, onRemove }: LessonID) => {
  const { addNote } = useCourse();

  const state = useSelector((state: any) => state.user);
  const checkString = state.token;

  console.log("lessonid from note atom", lessonID);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      noteTitle: "",
      noteLink: [] as unknown as FileList,
    },
  });

  const [noteLink, setNoteLink] = useState<any>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setNoteLink(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append("noteTitle", data.noteTitle ?? "");

    formData.append("noteLink", noteLink[0]);

    console.log({ ...data, noteLink: noteLink });

    if (lessonID) {
      await addNote(lessonID, formData, checkString);
    } else {
      toast.error("Please submit the lesson first");
    }

    // const createdCourseResponse = await getTeachersCourse(checkString);
    // get the last item of the array
    // const newCourseId = createdCourseResponse.data[createdCourseResponse.data.length - 1]._id;

    // Add the ID after the link in navigate
    // navigate(`create-lesson/${newCourseId}`);
  };

  return (
    <div className="flex flex-col gap-2 border w-[700px] rounded p-3 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-[600px] gap-2">
          <label>Title</label>
          <Controller
            name="noteTitle"
            control={control}
            rules={{
              required: "Title is required",
              minLength: {
                value: 4,
                message: "Minimum length must be 4",
              },
              maxLength: {
                value: 100,
                message: "Maximum length must be 100",
              },
            }}
            render={({ field }) => (
              <input
                placeholder="Enter note title"
                {...field}
                className={`w-full px-4 py-2 bg-gray-200 rounded ${
                  errors.noteTitle ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.noteTitle && (
            <h5 className="text-red-500">{String(errors.noteTitle.message)}</h5>
          )}
        </div>

        {/* <div className='flex items-center gap-2 text-xl'>Add Note
                    <IoCloudUpload />
                </div> */}

        <div className="flex flex-col gap-2 items-center justify-center mt-4 border mb-4">
          <label className="font-semibold">Add Note</label>
          <div {...getRootProps()} className="flex items-center justify-center">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <IoCloudUpload className="text-gray-500 h-10 w-10 cursor-pointer" />
            )}
          </div>
        </div>

        <div className="mb-4">
          <Button
            type="submit"
            value="Submit"
            additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          ></Button>
        </div>
      </form>
      <FaMinus
        onClick={onRemove}
        className="bg-red-500 text-white rounded p-1 w-6 h-6 cursor-pointer"
      />
    </div>
  );
};

export default AddNoteToLessonAtom;
