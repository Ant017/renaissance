import { useState } from 'react'
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeLogin } from "../../../redux/slices/UserSlice";
import { BiPowerOff } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FiBookOpen } from "react-icons/fi";
import { LuPlusSquare } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { HiOutlineHeart } from "react-icons/hi";
import StudentDashboardMolecule from '../../molecules/StudentMolecules/StudentDashboardMolecule';
import StudentEnrolledCoursesMolecule from '../../molecules/StudentMolecules/StudentEnrolledCoursesMolecule';
import StudentCompletedCoursesMolecule from '../../molecules/StudentMolecules/StudentCompletedCoursesMolecule';
import StudentCartMolecule from '../../molecules/StudentMolecules/StudentCartMolecule';
import StudentWishListMolecule from '../../molecules/StudentMolecules/StudentWishListMolecule';
import CreateCourseMolecule from '../../molecules/TeacherMolecules/CreateCourseMolecule';
import TeacherDashboardMolecule from '../../molecules/TeacherMolecules/TeacherDashboardMolecule';
import TeacherCoursesMolecule from '../../molecules/TeacherMolecules/TeacherCoursesMolecule';
import AdminDashboardMolecule from '../../molecules/AdminMolecules/AdminDashboardMolecule';
import AdminAnalyticsMolecule from '../../molecules/AdminMolecules/AdminAnalyticsMolecule';
import AdminTeacherRequestsMolecule from '../../molecules/AdminMolecules/AdminTeacherRequestsMolecule';
import AdminCourseApprovalRequestsMolecule from '../../molecules/AdminMolecules/AdminCourseApprovalMolecule';
import { LuCopyPlus } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import { LuPaperclip } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { BsBookmarkCheck } from "react-icons/bs";
import AdminSubscriptionRequestsMolecule from '../../molecules/AdminMolecules/AdminSubscriptionRequestsMolecule';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import EvaluateAssignmentsMolecule from '../../molecules/TeacherMolecules/EvaluateAssignmentsMolecule';

type MyToken = {
    _id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBanned: boolean;
    teacherID?: string;
    iat: number;
    exp: number;
}

type Props = {
    tabNumber?: Number
}

const SideBarOrganism = (props: Props) => {
    const navigate = useNavigate();



    const state = useSelector((state: any) => state.user);

    const checkString = state.token;

    const decodedToken = jwtDecode<MyToken>(checkString);

    const dispatch = useDispatch();
    // log out
    const logout = () => {
        dispatch(removeLogin());
    }

    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabNumber: number) => {
        setActiveTab(Number(tabNumber) || 0);
    };

    if (decodedToken.role === "admin") {
        return (
            <div className='flex pt-10 px-10 gap-20'>
                <div className='flex flex-col gap-3 w-[18rem] p-7 rounded-lg h-[60vh] shadow-md sticky top-[100px]'>
                    {/* <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <LuLayoutDashboard className='font-bold text-xl' />
                        Dashboard
                    </div>
                    <hr className='w-40'></hr> */}
                    {/* <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <IoAnalyticsOutline className='font-bold text-xl' />
                        Analytics
                    </div> */}
                    {/* <hr className='w-40'></hr> */}
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <PiStudent className='font-bold text-xl' />
                        Student Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(2)}>
                        <LiaChalkboardTeacherSolid className='font-bold text-xl' />
                        Teacher Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(3)}>
                        <BsBookmarkCheck className='font-bold text-xl' />
                        Course Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'>
                        <BiPowerOff className='font-bold text-xl' />
                        <div onClick={logout}>Log out</div>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    {/* {activeTab === 1 && <div>
                        <AdminDashboardMolecule />
                    </div>} */}
                    {/* {activeTab === 1 && <div>
                        <AdminAnalyticsMolecule />
                    </div>} */}
                    {activeTab === 1 && <div>
                        <AdminSubscriptionRequestsMolecule />
                    </div>}
                    {activeTab === 2 && <div>
                        <AdminTeacherRequestsMolecule />
                    </div>}
                    {activeTab === 3 && <div>
                        <AdminCourseApprovalRequestsMolecule />
                    </div>}
                </div>
            </div>
        )
    }

    if (decodedToken.role === "teacher") {
        return (
            <div className='flex pt-10 px-10 gap-20'>
                <div className='flex flex-col gap-3 w-[19rem] p-7 rounded-lg h-[60vh] shadow-md sticky top-[100px]'>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <LuLayoutDashboard className='font-bold text-xl' />
                        Dashboard
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(2)}>
                        <FiBookOpen className='font-bold text-xl' />
                        My Courses
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(3)}>
                        <LuPlusSquare className='font-bold text-xl' />
                        Create Course
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(4)}>
                        <IoShieldCheckmarkOutline className='font-bold text-xl' />
                        Evaluate Assignments
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'>
                        <BiPowerOff className='font-bold text-xl' />
                        <div onClick={logout}>Log out</div>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center w-full'>
                    {activeTab === 1 && <div>
                        <TeacherDashboardMolecule />
                    </div>}
                    {activeTab === 2 && <div>
                        <TeacherCoursesMolecule />
                    </div>}
                    {activeTab === 3 && <div>
                        <CreateCourseMolecule />
                    </div>}
                    {activeTab === 4 && <div>
                        <EvaluateAssignmentsMolecule />
                    </div>}
                </div>
            </div>
        )
    }

    if (decodedToken.role === "student") {
        return (
            <div className='flex pt-10 px-10 gap-20'>
                <div className='flex flex-col gap-3 w-[19rem] p-7 rounded-lg h-[60vh] shadow-md sticky top-[100px]'>
                    {/* <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <LuLayoutDashboard className='font-bold text-xl' />
                        Dashboard
                    </div>
                    <hr className='w-40'></hr> */}
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <LuPaperclip className='font-bold text-xl' />
                        Enrolled Courses
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(2)}>
                        <IoMdCheckmarkCircleOutline className='font-bold text-xl' />
                        Completed Courses
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(3)}>
                        <MdOutlineShoppingCart className='font-bold text-xl' />
                        My Cart
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(4)}>
                        <HiOutlineHeart className='font-bold text-xl' />
                        My Wish-list
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'>
                        <BiPowerOff className='font-bold text-xl' />
                        <div onClick={logout}>Log out</div>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center w-full'>
                    {/* {activeTab === 1 && <div>
                        <StudentDashboardMolecule />
                    </div>} */}
                    {activeTab === 1 && <div>
                        <StudentEnrolledCoursesMolecule />
                    </div>}
                    {activeTab === 2 && <div>
                        <StudentCompletedCoursesMolecule />
                    </div>}
                    {activeTab === 3 && <div>
                        <StudentCartMolecule />
                    </div>}
                    {activeTab === 4 && <div>
                        <StudentWishListMolecule />
                    </div>}
                </div>
            </div>
        )
    }
}

export default SideBarOrganism