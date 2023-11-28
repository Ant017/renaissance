const authModel = require("../../model/authModel/auth")
const studentModel = require("../../model/authModel/student")
const teacherModel = require("../../model/authModel/teacher")
const { success, failure } = require("../../utils/successError")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const path = require("path")
const { promisify } = require('util')
const ejs = require('ejs');
const ejsRenderFile = promisify(ejs.renderFile)
const { sendMail } = require('../../config/sendMail')
const { validationResult } = require("express-validator")

class AuthController {
    // validation
    async createValiadtion(req, res, next) {
        try {
            const validation = validationResult(req).array()
            if (validation.length > 0) {
                return res.status(400).send({ message: "validation error", validation })
            }
            next()
        } catch (error) {
            console.log("error has occured")
        }
    }

    // sign up
    async signUp(req, res) {
        try {
            const { username, email, password, role } = req.body;

            if (!username || !email || !password || !role) {
                return res.status(400).send(failure("Please fill all the fields"))
            }

            const user = await authModel.findOne({ email });
            if (user) {
                return res.status(400).send({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            let userInfo;
            let authUser;

            if (role === "student") {
                userInfo = await studentModel.create({
                    username,
                    email,
                    role
                });

                authUser = await authModel.create({
                    username,
                    email,
                    password: hashedPassword,
                    role,
                    studentID: userInfo._id
                });

                await authUser.save();
                await userInfo.save();

            } else if (role === "teacher") {
                userInfo = await teacherModel.create({
                    username,
                    email,
                    role
                });

                authUser = await authModel.create({
                    username,
                    email,
                    password: hashedPassword,
                    role,
                    teacherID: userInfo._id
                });

                await authUser.save();
                await userInfo.save();
            }

            else if (role === "admin") {
                authUser = await authModel.create({
                    username,
                    email,
                    password: hashedPassword,
                    role
                });

                await authUser.save();
            }

            // Create a verification token
            const token = crypto.randomBytes(32).toString('hex');
            authUser.emailVerificationToken = token;
            authUser.emailVerificationTokenExpired = new Date(Date.now() + 60 * 60 * 1000);

            await authUser.save();

            // Create an email verification link
            const emailVerificationURL = path.join(process.env.FRONTEND_URL, "verify-email", authUser._id.toString(), token);

            // Compose the email content using EJS
            const htmlBody = await ejsRenderFile(path.join(__dirname, '../../views/emailVerification.ejs'), {
                name: authUser.username,
                emailVerificationURL: emailVerificationURL,
            });

            // Send the email
            const emailResult = await sendMail(email, "Email Verification", htmlBody);

            if (emailResult) {
                const responseAuth = authUser.toObject();
                delete responseAuth.password;
                delete responseAuth.loginAttempt;
                delete responseAuth.__v;
                delete responseAuth.createdAt;
                delete responseAuth.updatedAt;

                return res.status(200).send(success("Sign up successful. Please verify your email.", responseAuth));
            } else {
                return res.status(400).send(failure("Failed to send the email"));
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }

    // Resend verification email
    async resendVerificationEmail(req, res) {
        try {
            const { email } = req.body;

            const user = await authModel.findOne({ email });

            if (!user) {
                return res.status(400).send(failure("User not found. Please sign up first."));
            }

            if (user.isVerified) {
                return res.status(400).send(failure("User is already verified."));
            }

            const newToken = crypto.randomBytes(32).toString('hex');
            user.emailVerificationToken = newToken;
            user.emailVerificationTokenExpired = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes from now

            await user.save();

            const emailVerificationURL = path.join(process.env.FRONTEND_URL, "verify-email", user._id.toString(), newToken);

            const htmlBody = await ejsRenderFile(path.join(__dirname, '../../views/emailVerification.ejs'), {
                name: user.username,
                emailVerificationURL: emailVerificationURL,
            });

            const emailResult = await sendMail(email, "Email Verification", htmlBody);

            if (emailResult) {
                return res.status(200).send(success("New verification email sent. Please check your email and verify."));
            } else {
                return res.status(400).send(failure("Failed to send the email"));
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }


    // Verify email
    async verifyEmail(req, res) {
        try {
            const { userId, token } = req.params;
            console.log("userId", userId)
            console.log("token", token)

            const user = await authModel.findOne({ _id: userId });

            if (!user) {
                return res.status(400).send({ message: "User does not exist" });
            }

            if (user.isVerified) {
                return res.status(400).send({ message: "User is already verified" });
            }

            if (user.emailVerificationToken !== token) {
                return res.status(400).send({ message: "Invalid verification token" });
            }

            if (user.emailVerificationTokenExpired < new Date()) {
                return res.status(400).send(failure("Verification token has expired. Resend?", null, "/resend-verification-email"));
            }

            // Mark the user as verified
            user.isVerified = true;
            user.emailVerificationToken = null
            user.emailVerificationTokenExpired = null

            await user.save();

            return res.status(200).send(success("Congratulations! You are now a verifired user."));
        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }

    //login
    async login(req, res) {
        try {
            const { email, password } = req.body
            const auth = await authModel.findOne({ email })

            if (!auth) {
                return res.status(400).send(failure("User not registered."))
            }

            // if user not verified, throw error
            if (!auth.isVerified) {
                return res.status(400).send(failure("Please verify your email first."))
            }

            const currentTime = new Date()
            // the future time when a user can log in again is saved in timeToLogin which is 15 seconds following the last updateAt value.
            const timeToLogin = new Date(auth.updatedAt.getTime() + 15 * 1000);
            if (auth.loginAttempt >= 3) {
                console.log("Too many failed login attempts. Try again in " + (timeToLogin - currentTime) / 1000 + " seconds")
                if (timeToLogin - currentTime > 0) {
                    return res.status(400).send(failure(`Too many login attempts. Try again in ${(timeToLogin - currentTime) / 1000} seconds.`));
                }
                auth.loginAttempt = 0;
                await auth.save();
            }
            // if user tries to log in with wrong password, the loginAttempt property will increase 
            auth.loginAttempt++
            await auth.save()

            const checkPassword = await bcrypt.compare(password, auth.password)

            if (!checkPassword) {
                return res.status(400).send(failure("Authentication failed"))
            }

            // If the password is right, the loginAttempt property will be 0
            auth.loginAttempt = 0;
            await auth.save();

            const responseAuth = auth.toObject()

            delete responseAuth.password
            delete responseAuth.loginAttempt
            delete responseAuth.__v
            delete responseAuth.createdAt
            delete responseAuth.updatedAt
            delete responseAuth.isApprovedInstructor
            delete responseAuth.educationalCertificates
            delete responseAuth.emailVerificationToken
            delete responseAuth.emailVerificationTokenExpired
            delete responseAuth.resetPassword
            delete responseAuth.resetPasswordToken
            delete responseAuth.resetPasswordExpired

            const generatedToken = jwt.sign(responseAuth, process.env.JWT_SECRET, {
                expiresIn: "30d"
            })

            responseAuth.token = generatedToken
            return res.status(200).send(success("Login successful", responseAuth))

        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error", error));
        }
    }

    //send email to reset password
    async sendForgotPasswordEmail(req, res) {
        try {
            const { recipient } = req.body
            console.log("recipient mail", recipient)
            if (!recipient || recipient === "") {
                return res.status(400).send(failure("invalid request"))
            }

            const auth = await authModel.findOne({ email: recipient })
            if (!auth) {
                return res.status(400).send(failure("invalid request"))
            }

            const resetToken = crypto.randomBytes(32).toString('hex')
            auth.resetPasswordToken = resetToken
            auth.resetPasswordExpired = new Date(Date.now() + 60 * 60 * 1000)

            await auth.save()

            const resetPasswordURL = path.join(process.env.FRONTEND_URL, "reset-password", auth._id.toString(), resetToken);

            const htmlBody = await ejsRenderFile(path.join(__dirname, '../../views/forgotPassword.ejs'), {
                name: auth.username,
                resetPasswordURL: resetPasswordURL
            })
            console.log("htmlBody", htmlBody)

            const emailResult = await sendMail(recipient, "Reset Password", htmlBody);

            if (emailResult) {
                return res.status(200).send(success("Reset password link sent to your email"))
            }
            return res.status(400).send(failure("Something went wrong"))


        } catch (error) {
            console.log("error found", error)
            return res.status(500).send(failure("Internal server error", error))
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, userId } = req.params;

            const auth = await authModel.findOne({ _id: userId, resetPasswordToken: token, resetPasswordExpired: { $gt: new Date() } });
            if (!auth) {
                return res.status(400).send(failure("invalid request"));
            }
            console.log("authPass", auth.password)


            const { newPassword, confirmPassword } = req.body
            console.log("authPass", newPassword)
            if (!newPassword || !confirmPassword) {
                return res.status(400).send(failure("Please enter all the fields"))
            }

            const passwordMatch = await bcrypt.compare(newPassword, auth.password);

            if (passwordMatch) {
                console.log("newpass=oldpass");
                return res.status(400).send(failure("You are setting up an old password"));
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).send(failure("Passwords do not match"))
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
                return hash
            })

            auth.password = hashedPassword
            auth.resetPasswordToken = null
            auth.resetPasswordExpired = null

            await auth.save()

            return res.status(200).send(success("Password reset successful"))
        } catch (error) {
            return res.status(500).send(failure("Internal server error", error))
        }
    }

    async validatePasswordResetRequest(req, res) {
        try {
            const { token, userId } = req.params;

            const auth = await authModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
            if (!auth) {
                return res.status(400).send(failure("Invalid request"))
            }

            if (auth.resetPasswordExpired < Date.now()) {
                return res.status(400).send(failure("Expired request"))
            }

            if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
                return res.status(400).send(failure("Invalid token"))
            }
            return res.status(200).send(success("Request is still valid"))
        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // check if teacher is approved
    async isTeacherApproved(req, res) {
        try {
            const teacher = await teacherModel.findOne({ email: req.user.email });

            if (!teacher || !teacher.isApproved) {
                return res.status(200).send(false); // Send boolean value true if the teacher is not approved
            }

            console.log("teacher", teacher);
            return res.status(200).send(true);

        } catch (error) {
            console.log(error);
            return res.status(500).send(failure("Internal server error"));
        }
    }

}

module.exports = new AuthController()