import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
// import useAuth from '../../hooks/useAuthHooks';
// import { login } from '../../hooks/useAuthHooks';
import { LoginApi } from '../../../ApiCalls/AuthApi';

import { useDispatch } from 'react-redux';
import { saveLogin } from "../../../redux/slices/UserSlice";
// import { useSelector } from 'react-redux';

type FormData = {
    email: string;
    password: string;
};

type BoxProps = {
    className?: string;
};

const LoginBoxMolecule = ({ className }: BoxProps) => {

    // const token = useSelector((state: { user: { token: string } }) => state.user.token)
    // console.log(token)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: FormData) => {
        console.log(data);
        const response = await LoginApi(data)
        if (response) {
            dispatch(saveLogin(response));
            navigate('/');
        }
    };

    return (
        <div className={`max-w-md p-4 rounded-lg shadow-lg flex flex-col justify-center h-[95vh] ${className}`}>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Log in to Your Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                {/* form items container */}
                <div>
                    <label>Email</label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                                message: 'Enter a valid email address.',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter email"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.email && <h5 className="text-red-500">{errors.email.message}</h5>}
                </div>

                <div>
                    <label>Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                        }}
                        render={({ field }) => (
                            <div className="relative">
                                <input
                                    placeholder="Enter password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    className={`w-full px-4 py-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <FiEye className="h-6 w-6 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        )}
                    />
                    {errors.password && <h5 className="text-red-500">{errors.password.message}</h5>}
                </div>

                {/* <div className="text-left text-blue-700"><Link to="/forgot-password">Forgot Password?</Link></div> */}

                <div className='text-center flex flex-col justify-center gap-3'>
                    <Button type="submit" value="Log in" additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full mt-4" />
                    <p className='text-grey-700'>Not Registered? <Link to="/signup" className='text-blue-700'>Sign Up</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginBoxMolecule;
