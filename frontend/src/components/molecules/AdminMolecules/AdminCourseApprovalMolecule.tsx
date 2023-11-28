import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../utils/axiosInstance";
import { PiStudent } from "react-icons/pi";
import { format } from 'date-fns';
import { HiCheckCircle } from "react-icons/hi";
import { HiXCircle } from "react-icons/hi";
import useSubscription from "../../../hooks/useSubscriptionHooks";

type From = {
  _id: string;
  username: string;
  email: string;
};

type Req = {
  _id: string;
  type: string;
  message: string;
  to: string;
  from: From | null;
  courseID: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const AdminCourseApprovalMolecule = () => {
  const { respondToCourseReq } = useSubscription()

  const [courseReq, setCourseReq] = useState<Req[]>([]);

  const state = useSelector((state: any) => state.user);
  const checkString = state.token;

  useEffect(() => {
    const fetchCourseReq = async () => {
      try {
        const response = await axiosInstance.get(
          "/notification/show-all-course-request",
          {
            headers: {
              Authorization: `Bearer ${checkString}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCourseReq(response.data.data);
      } catch (error) {
        console.error("Error fetching teacherReq requests:", error);
      }
    };

    fetchCourseReq();
  }, [checkString]);

  const handleRespondToCourseReq = async (data: string, notificationID: string) => {
    try {
      await respondToCourseReq(data, notificationID, checkString);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Course Approval Requests</h1>
      {courseReq.length > 0 ? (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 justify-start items-start">
            {courseReq.map((req: Req) => (
              <div key={req._id} className="relative group bg-white p-6 rounded-md shadow-md">
                {req.from && (
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center gap-3">
                      <PiStudent size={26} />
                      <div className="flex flex-col">
                        <p>{req.from.username}</p>
                        <p className="text-sm text-gray-600">{req && format(new Date(req.createdAt), 'MMMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <p>{req.message}</p>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 flex justify-center items-end gap-2 mr-2 mb-2">
                  <HiCheckCircle size={28} className="text-green-500"
                    onClick={() => {
                      handleRespondToCourseReq("approve", req._id)
                      console.log("approved", req._id)
                    }} />
                  <HiXCircle size={28} className="text-red-500"
                    onClick={() => {
                      handleRespondToCourseReq("reject", req._id)
                      console.log("rejected")
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>No Course Requests</p>
        </div>
      )}
    </div>
  );
};

export default AdminCourseApprovalMolecule;
