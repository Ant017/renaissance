import useCourse from "../../../hooks/useCourseHooks";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import SubmitAssignmentAtom from "../../atoms/SubmitAssignmentAtom";

type Assignment = {
  _id?: string;
  title?: string;
  totalMarks?: number;
  passMarks?: number;
  createdAt?: string;
  updatedAt?: string;
  documents?: string;
};

const GetAssignmentMolecule = () => {
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const courseID = pathArray[pathArray.length - 1];

  const state = useSelector((state: any) => state.user);
  const checkString = state.token;

  const { getAssignment } = useCourse();
  const [assignment, setAssignment] = useState<Assignment>({
    _id: "",
    title: "",
    totalMarks: undefined,
    passMarks: undefined,
    createdAt: "",
    updatedAt: "",
    documents: "",
  });

  const getAssignments = async () => {
    const data = await getAssignment(courseID, checkString);
    setAssignment(data);
  };

  useEffect(() => {
    getAssignments();
  }, [])

  return (
    <div>
      <div className="flex flex-col justify-start p-5">
        <h4 className="text-2xl font-semibold mb-4">Assignment</h4>
        {assignment && (
          <div className="flex flex-col gap-3 shadow-lg p-9 rounded-lg w-[700px]">
            <p className="text-lg font-semibold">{assignment.title}</p>
            <p>Total marks: {assignment.totalMarks}</p>
            <p>Pass marks: {assignment.passMarks}</p>
            <p>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <a href={assignment.documents} target="_blank" rel="noopener noreferrer">Download Assignment</a>
              </button>
            </p>

          </div>
        )}
      </div>
      <div>
        <SubmitAssignmentAtom />
      </div>
    </div>
  );
};

export default GetAssignmentMolecule;
