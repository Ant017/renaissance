import { Link } from 'react-router-dom'
import { jwtDecode } from "jwt-decode"
import { useSelector } from "react-redux";

type MyToken = {
    _id: string;
    username: string;
    email: string;
    role: string; // Replace with actual roles
    isVerified: boolean;
    isBanned: boolean;
    teacherID?: string;
    iat: number;
    exp: number;
}

const LinksNavMolecule = () => {

    const state = useSelector((state: any) => state.user);

    const checkString = state.token;

    if (checkString) {
        const decodedToken = jwtDecode<MyToken>(checkString);
        if (decodedToken.role === "student") {
            return (
                <div className='flex gap-6 flex-wrap'>
                    <div>
                        <Link className='link' to="/courses">Courses</Link>
                    </div>
                    <div>
                        <Link className='link' to="/login/student/student-profile">Profile</Link>
                    </div>
                    <div>
                        <Link className='link' to="/contact">Contact</Link>
                    </div>
                </div>
            )
        }
        if (decodedToken.role === "teacher") {
            return (
                <div className='flex gap-6 flex-wrap'>
                    <div>
                        <Link className='link' to="/courses">Courses</Link>
                    </div>
                    <div>
                        <Link className='link' to="/login/teacher/teacher-profile">Profile</Link>
                    </div>
                    <div>
                        <Link className='link' to="/contact">Contact</Link>
                    </div>
                </div>
            )
        }
        if (decodedToken.role === "admin") {
            return (
                <div className='flex gap-6 flex-wrap'>
                    <div>
                        <Link className='link' to="/courses">Courses</Link>
                    </div>
                    <div>
                        <Link className='link' to="/login/admin/admin-profile">Profile</Link>
                    </div>
                    <div>
                        <Link className='link' to="/contact">Contact</Link>
                    </div>
                </div>
            )
        }
    }
    return (
        <div className='flex gap-6 flex-wrap'>
            <div>
                <Link className='link' to="/courses">Courses</Link>
            </div>
            <div>
                <Link className='link' to="/about">About</Link>
            </div>
            <div>
                <Link className='link' to="/contact">Contact</Link>
            </div>
        </div>
    )
}

export default LinksNavMolecule