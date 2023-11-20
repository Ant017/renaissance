import { useState } from 'react'
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeLogin } from "../../redux/slices/UserSlice";
import { BiPowerOff } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import { RiTodoLine } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import { LuPlusSquare } from "react-icons/lu";
import { MdOutlineShoppingCart } from "react-icons/md";
import { HiOutlineHeart } from "react-icons/hi";
import StudentDashboardMolecule from '../molecules/StudentDashboardMolecule';
import StudentCoursesMolecule from '../molecules/StudentCoursesMolecule';
import StudentCartMolecule from '../molecules/StudentCartMolecule';
import StudentWishListMolecule from '../molecules/StudentWishListMolecule';
import CreateCourseMolecule from '../molecules/CreateCourseMolecule';
import TeacherDashboardMolecule from '../molecules/TeacherDashboardMolecule';
import TeacherCoursesMolecule from '../molecules/TeacherCoursesMolecule';
import AdminDashboardMolecule from '../molecules/AdminDashboardMolecule';
import AdminAnalyticsMolecule from '../molecules/AdminAnalyticsMolecule';
import AdminTeacherRequestsMolecule from '../molecules/AdminTeacherRequestsMolecule';
import AdminCourseApprovalRequestsMolecule from '../molecules/AdminCourseApprovalMolecule';
import { LuCopyPlus } from "react-icons/lu";
import AdminSubscriptionRequestsMolecule from '../molecules/AdminSubscriptionRequestsMolecule';

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
                <div className='flex flex-col gap-3 w-[18rem] p-7 rounded-lg h-[60vh] shadow-md'>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(1)}>
                        <LuLayoutDashboard className='font-bold text-xl' />
                        Dashboard
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(2)}>
                        <IoAnalyticsOutline className='font-bold text-xl' />
                        Analytics
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(3)}>
                        <RiTodoLine className='font-bold text-xl' />
                        Student Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(4)}>
                        <RiTodoLine className='font-bold text-xl' />
                        Teacher Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'
                        onClick={() => handleTabClick(5)}>
                        <RiTodoLine className='font-bold text-xl' />
                        Course Requests
                    </div>
                    <hr className='w-40'></hr>
                    <div className='flex gap-2 flex-wrap cursor-pointer hover:scale-105'>
                        <BiPowerOff className='font-bold text-xl' />
                        <div onClick={logout}>Log out</div>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    {activeTab === 1 && <div>
                        <AdminDashboardMolecule />
                    </div>}
                    {activeTab === 2 && <div>
                        <AdminAnalyticsMolecule />
                    </div>}
                    {activeTab === 3 && <div>
                        <AdminSubscriptionRequestsMolecule />
                    </div>}
                    {activeTab === 4 && <div>
                        <AdminTeacherRequestsMolecule />
                    </div>}
                    {activeTab === 5 && <div>
                        <AdminCourseApprovalRequestsMolecule />
                    </div>}
                </div>
            </div>
        )
    }

    if (decodedToken.role === "teacher") {
        return (
            <div className='flex pt-10 px-10 gap-20'>
                <div className='flex flex-col gap-3 w-[13rem] p-7 rounded-lg h-[60vh] shadow-md'>
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
                        <LuCopyPlus className='font-bold text-xl' />
                        Create Lesson
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
                    {activeTab === 4 && <>{navigate(`/login/teacher/teacher-profile/create-lesson/6559df0a57fce2e6fc969da0`)}</>}
                </div>
            </div>
        )
    }

    if (decodedToken.role === "student") {
        return (
            <div className='flex pt-10 px-10 gap-20'>
                <div className='flex flex-col gap-3 w-[13rem] p-7 rounded-lg h-[60vh] shadow-md'>
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
                    {activeTab === 1 && <div>
                        <StudentDashboardMolecule />
                    </div>}
                    {activeTab === 2 && <div>
                        <StudentCoursesMolecule />
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