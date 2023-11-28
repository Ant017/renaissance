import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import useAuth from '../../../hooks/useAuthHooks';
// import { SignupApi } from '../../ApiCalls/Auth/AuthApi';

type FormData = {
    username: string;
    email: string;
    role: string;
    password: string;
    confirm_password: string;
};

type SignUpBoxProps = {
    className?: string;
};

const SignUpBoxMolecule = ({ className }: SignUpBoxProps) => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            role: 'student',
            password: '',
            confirm_password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (data: FormData) => {
        console.log(data);
        await signup(data);
        navigate('/login');
    };

    return (
        <div className={`max-w-md p-4 rounded-lg shadow-lg flex flex-col justify-center h-[95vh] ${className}`}>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Create a New Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                {/* form items container */}
                <div>
                    <label>Username</label>
                    <Controller
                        name="username"
                        control={control}
                        rules={{
                            required: 'Username is required',
                            minLength: {
                                value: 4,
                                message: 'Minimum length must be 4',
                            },
                            maxLength: {
                                value: 30,
                                message: 'Maximum length must be 30',
                            },
                        }}
                        render={({ field }) => (
                            <input
                                placeholder="Enter username"
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.username ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.username && <h5 className="text-red-500">{String(errors.username.message)}</h5>}
                </div>

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
                    <label>Role</label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className={`w-full px-4 py-2 border rounded ${errors.role ? 'border-red-500' : ''}`}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        )}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
                                message:
                                    'Password must contain at least one capital letter, one digit, one special character, and be 8 characters or more long.',
                            },
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

                <div>
                    <label>Confirm Password</label>
                    <Controller
                        name="confirm_password"
                        control={control}
                        rules={{
                            required: 'Confirm your password',
                            validate: (value) =>
                                value === watch('password') || 'Confirm password should match given password',
                        }}
                        render={({ field }) => (
                            <div className="relative">
                                <input
                                    placeholder="Confirm password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...field}
                                    className={`w-full px-4 py-2 border rounded ${errors.confirm_password ? 'border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <FiEye className="h-6 w-6 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        )}
                    />
                    {errors.confirm_password && (
                        <div className="mt-2">
                            <h5 className="text-red-500">{errors.confirm_password.message}</h5>
                        </div>
                    )}
                </div>

                <div className="text-center flex flex-col justify-center gap-3">
                    <Button type="submit" value="Sign Up" additionalStyles="bg-blue-500 hover:bg-blue-700 text-white font-bold w-full mt-4" />
                    <p className='text-grey-700'>Already have an account? <Link to="/login" className='text-blue-700'>Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default SignUpBoxMolecule;
