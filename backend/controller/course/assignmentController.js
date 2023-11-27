const authModel = require("../../model/authModel/auth")
const studentModel = require("../../model/authModel/student")
const teacherModel = require("../../model/authModel/teacher")
const courseModel = require("../../model/courseModel/course")
const assignmentModel = require("../../model/courseModel/assignment")
const evaluationModel = require("../../model/courseModel/evaluation")
const notificationModel = require("../../model/notificationModel/notification")

const { success, failure } = require("../../utils/successError")
const express = require('express')
const mongoose = require("mongoose")
const { validationResult } = require('express-validator')
const { uploadFile, deleteFile, deleteFolder } = require("../../config/files")
// const fileTypes = require("../constants/fileTypes")
const fs = require('fs')
const path = require('path')
class AssignmentController {
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

    // add quiz
    async createAssignment(req, res) {
        try {
            const { courseID } = req.params
            const { title, totalMarks } = req.body
            console.log(courseID, title, totalMarks)

            if (!courseID || !title || !totalMarks) {
                return res.status(400).send(failure("Please fill all the fields"))
            }

            const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) })

            if (!existingCourse || existingCourse.isDeleted === true) {
                return res.status(400).send(failure("The specified course does not exist. Please enter a valid course."))
            }

            const teacher = await teacherModel.findOne({ email: req.user.email })

            if (!teacher) {
                return res.status(400).send(failure("User not found"))
            }

            // check if teacher teacher this course
            // const authorizedCourses = teacher.coursesTaught.map(courseId => courseId.toString());

            // if (!authorizedCourses.includes(courseID.toString())) {
            //     return res.status(400).send(failure("You are not authorized to create assignments for this course."));
            // }

            // if there is a assignment against the course, throw error
            const existingAssignment = await assignmentModel.findOne({ courseID: courseID });

            if (existingAssignment) {
                return res.status(400).send(failure("Assignment already exists for this course."));
            }

            // calculate pass marks 30% of total marks
            const passMarks = totalMarks * 0.3;

            const assignment = new assignmentModel({
                courseID,
                title,
                totalMarks,
                passMarks: passMarks
            })

            await assignment.save()
            const response = assignment.toObject()
            delete response.__v

            return res.status(200).send(success("Assignment added successfully", response))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // add document to assignment
    async addDocs(req, res) {
        try {
            const { assignmentID } = req.params
            const documents = req.file

            if (!assignmentID || !documents) {
                return res.status(400).send(failure("Please enter a document."))
            }

            const existingAssignment = await assignmentModel.findOne({ _id: new mongoose.Types.ObjectId(assignmentID) })

            if (!existingAssignment) {
                return res.status(400).send(failure("The specified assignment does not exist. Please enter a valid assignment."))
            }

            const teacher = await teacherModel.findOne({ email: req.user.email })

            if (!teacher) {
                return res.status(400).send(failure("User not found"))
            }

            // check if teacher teacher this course
            // const authorizedCourses = teacher.coursesTaught.map(courseId => courseId.toString());

            // if (!authorizedCourses.includes(existingLesson.courseID.toString())) {
            //     return res.status(400).send(failure("You are not authorized to add videos to this lesson."));
            // }

            // push the video inside the videos array
            const uploadRes = await uploadFile(documents, "assignment_docs")

            if (!uploadRes) {
                return res.status(400).send(failure("Error uploading note."))
            }

            // push the title and link to notes
            existingAssignment.documents = uploadRes
            await existingAssignment.save()

            const responseAssignment = existingAssignment.toObject()

            return res.status(200).send(success("Note added successfully.", responseAssignment))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get assignment for course
    async getAssignmentForCourse(req, res) {
        try {
            const { courseID } = req.params;
            console.log(courseID)
            const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) });

            if (!existingCourse || existingCourse.isDeleted === true) {
                return res.status(400).send(failure("The specified course does not exist. Please enter a valid course."));
            }

            const user = req.user;

            // Check if the user is a teacher and matches the courseID with coursesTaught

            if (user.role === "teacher") {
                const teacher = await teacherModel.findOne({ email: user.email });
                if (!teacher) {
                    return res.status(400).send(failure("You are not authorized to access this course."));
                }
            }

            if (user.role === "student") {
                const student = await studentModel.findOne({ email: user.email });
                if (!student) {
                    return res.status(400).send(failure("You are not authorized to access this course."));
                }
                if (!student.enrolledCourses?.find(course => course._id.toString() === courseID.toString())) {
                    return res.status(400).send(failure("You are not authorized to access this course."));
                }
            }

            const assignment = await assignmentModel.findOne({ courseID: courseID });

            if (!assignment) {
                return res.status(400).send(failure("Assignment not found"));
            }

            const response = assignment.toObject()

            delete response.__v

            return res.status(200).send(success("Assignment found successfully", response))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // submit assignment

    async submitAssignment(req, res) {
        try {
            const { courseID } = req.params
            const documents = req.file

            if (!courseID || !documents) {
                return res.status(400).send(failure("Please enter a document."))
            }

            const student = await studentModel.findOne({ email: req.user.email })

            if (!student) {
                return res.status(400).send(failure("User not found"))
            }

            const assignment = await evaluationModel.findOne({ studentID: req.user._id, courseID: courseID })

            if (!assignment) {
                return res.status(400).send(failure("Assignment not found"))
            }

            const score = await assignmentModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) })
            // console.log("score", score)
            // if (!score) {
            //     return res.status(400).send(failure("Attend the quiz first."))
            // }

            if (assignment.assignmentAnswer !== "") {
                return res.status(400).send(failure("Assignment already submitted"))
            }

            const uploadRes = await uploadFile(documents, "assignment_docs")

            if (!uploadRes) {
                return res.status(400).send(failure("Error uploading note."))
            }

            assignment.assignmentAnswer = uploadRes
            await assignment.save()

            // send notification to the teacher
            const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) })

            if (!existingCourse) {
                return res.status(400).send(failure("Course not found"))
            }

            const notification = {
                type: "assignment_submitted",
                to: existingCourse.teacherID,
                from: req.user._id,
                courseID: existingCourse._id,
                message: `${req.user.username} has submitted the assignment for, ${existingCourse.title}.`,
            };

            await notificationModel.create(notification);

            return res.status(200).send(success("Assignment submitted successfully", assignment))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // fetch assignment

    async fetchAssignment(req, res) {
        try {
            const teacher = await authModel.findOne({ _id: req.user._id })

            if (!teacher) {
                return res.status(400).send(failure("User not found"))
            }

            // find the teacher in the course
            const course = await courseModel.find({ teacherID: teacher._id })

            if (!course) {
                return res.status(400).send(failure("Course not found"))
            }

            const response = course.map(async (course) => {

                const assignment = await evaluationModel.findOne({ courseID: course._id })
                    .populate("studentID")
                    .populate("courseID")

                if (!assignment) {
                    return res.status(400).send(failure("Assignment not found"))
                }

                return assignment
            })

            const assignments = await Promise.all(response)

            return res.status(200).send(success("Assignment found successfully", assignments))

            // console.log(course)
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }
    // evaluate assignment 
    async evaluateAssignment(req, res) {
        try {

            const { courseID, studentID } = req.params
            const { assignmentScore } = req.body

            if (!courseID || !studentID || !assignmentScore) {
                return res.status(400).send(failure("Please enter a score."))
            }

            const teacher = await authModel.findOne({ _id: req.user._id })

            if (!teacher) {
                return res.status(400).send(failure("User not found"))
            }

            const course = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) })

            if (!course) {
                return res.status(400).send(failure("Course not found"))
            }

            // check if course.teacherID is the same as req.user._id

            if (!course.teacherID.equals(teacher._id)) {
                return res.status(400).send(failure("Only the teacher who created the course can evaluate the course."))
            }

            const student = await evaluationModel.findOne({ studentID: studentID, courseID: courseID })

            if (!student) {
                return res.status(400).send(failure("User not found"))
            }

            const assignment = await evaluationModel.findOne({ studentID: studentID, courseID: courseID })

            if (!assignment) {
                return res.status(400).send(failure("Assignment not found"))
            }

            const score = await assignmentModel.findOne({ courseID: courseID })

            if (!score) {
                return res.status(400).send(failure("assignment not found"))
            }

            if (assignment.assignmentScore !== 0) {

                return res.status(400).send(failure("Assignment already evaluated"))
            }

            assignment.assignmentScore = assignmentScore
            console.log(score)
            if (assignmentScore < score.passMarks) {
                assignment.isPassedInAssignment = false

            }
            else {
                assignment.isPassedInAssignment = true
            }
            assignment.assignmentScore = assignmentScore
            await assignment.save()

            return res.status(200).send(success("Assignment evaluated successfully", assignment))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get quiz
    // async getQuiz(req, res) {
    //     try {
    //         const { courseID } = req.params;
    //         const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) });

    //         if (!existingCourse || existingCourse.isDeleted === true) {
    //             return res.status(400).send(failure("The specified course does not exist. Please enter a valid course."));
    //         }

    //         const user = req.user;
    //         const quiz = await quizModel.findOne({ courseID: courseID });

    //         if (!quiz) {
    //             return res.status(400).send(failure("Quiz not found"));
    //         }

    //         // Check if the user is a teacher and matches the courseID with coursesTaught
    //         if (user.role === "teacher") {
    //             const teacher = await teacherModel.findOne({ email: user.email });
    //             if (!teacher || !teacher.coursesTaught.includes(courseID)) {
    //                 return res.status(400).send(failure("You are not authorized to view this quiz."));
    //             }
    //         }

    //         // Check if the user is a student and enrolled in the course
    //         if (user.role === "student") {
    //             const student = await studentModel.findOne({ email: user.email });
    //             if (!student || !student.enrolledCourses.find(course => course._id.toString() === courseID.toString())) {
    //                 return res.status(400).send(failure("You are not enrolled in this course."));
    //             }
    //         }

    //         const response = quiz.toObject();

    //         // Remove the correctOption property from each question if user is a student
    //         if (user.role === "student" && response.questions && response.questions.length > 0) {
    //             response.questions = response.questions.map(({ correctOption, ...rest }) => rest);
    //         }

    //         delete response._id;
    //         delete response.__v;
    //         delete response.updatedAt;
    //         delete response.createdAt;

    //         return res.status(200).send(success("Quiz fetched successfully", response));
    //     } catch (error) {
    //         console.error("Error", error);
    //         return res.status(500).send(failure("Internal server error"));
    //     }
    // }

}

module.exports = new AssignmentController()