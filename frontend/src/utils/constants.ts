const BASE_URL = "http://localhost:3000";

// auth
const LOGIN_URL = `${BASE_URL}/auth/login`;
const SIGNUP_URL = `${BASE_URL}/auth/signup`;
const VERIFY_EMAIL_URL = `${BASE_URL}/auth/verify-email`;
const RESEND_VERIFICATION_EMAIL_URL = `${BASE_URL}/auth/resend-verification-email`;
const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;
const RESET_PASSWORD_URL = `${BASE_URL}/auth/reset-password/:userId/:token`;
const VALIDATE_RESET_REQUEST_URL = `${BASE_URL}/auth/validate-reset-request/:userId/:token`;

//teacher
const TEACHER_INFO = `/notification/teacher-request`;

// course
const ADD_CATEOGRY = `/course/add-category`;
const ADD_COURSE = `/course/create-course`;
const ALL_COURSES_URL = `${BASE_URL}/course/get-courses`;

export {
    BASE_URL,
    LOGIN_URL,
    SIGNUP_URL,
    VERIFY_EMAIL_URL,
    RESEND_VERIFICATION_EMAIL_URL,
    FORGOT_PASSWORD_URL,
    RESET_PASSWORD_URL,
    VALIDATE_RESET_REQUEST_URL,

    TEACHER_INFO,

    ADD_CATEOGRY,
    ADD_COURSE,
    ALL_COURSES_URL
}