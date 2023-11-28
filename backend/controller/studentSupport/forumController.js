const courseModel = require("../../model/courseModel/course")
const authModel = require("../../model/authModel/auth")
const forumModel = require("../../model/studentSupport/forum")
const studentModel = require("../../model/authModel/student")
const teacherModel = require("../../model/authModel/teacher")
const { success, failure } = require("../../utils/successError")
const express = require('express')
const mongoose = require("mongoose")
const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

class ForumController {
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

    // post a question
    async postQuestion(req, res) {
        try {
            const { courseID } = req.params
            const { question } = req.body
            if (!courseID || !question) {
                return res.status(400).send(failure("Please fill all the fields."))
            }

            const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) });

            const user = await authModel.findOne({ _id: new mongoose.Types.ObjectId(req.user._id) });

            if (!user) {
                return res.status(400).send(failure("User not found."))
            }

            if (!existingCourse || existingCourse.isDeleted === true || existingCourse.isApproved === false) {
                return res.status(400).send(failure("The specified course does not exist. Please enter a valid course."))
            }

            // check if user is enrolled in that course
            const student = await studentModel.findOne({ email: user.email });
            if (!student) {
                return res.status(400).send(failure("Student not found."))
            }

            const enrolledCourse = student.enrolledCourses.find(course => course._id.toString() === courseID);
            if (!enrolledCourse) {
                return res.status(400).send(failure("You are not enrolled in this course."))
            }

            const forum = new forumModel({
                courseID,
                userWithQuestion: user._id,
                question
            });

            await forum.save();

            return res.status(200).send(success("Question posted successfully", forum));
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // post answer to a specific question
    async postAnswer(req, res) {
        try {
            const { forumID } = req.params
            const { answer } = req.body
            if (!forumID || !answer) {
                return res.status(400).send(failure("Please fill all the fields."))
            }

            const existingForum = await forumModel.findOne({ _id: new mongoose.Types.ObjectId(forumID) });

            if (!existingForum) {
                return res.status(400).send(failure("Forum not found."))
            }

            const user = await authModel.findOne({ _id: new mongoose.Types.ObjectId(req.user._id) });

            if (!user) {
                return res.status(400).send(failure("User not found."))
            }

            // check if user is enrolled in that course
            if (user.role === "student") {
                const student = await studentModel.findOne({ email: user.email });
                if (!student) {
                    return res.status(400).send(failure("User not found."))
                }

                // const enrolledCourse = student.enrolledCourses.find(course => course._id.toString() === existingForum.courseID.toString());
                // if (!enrolledCourse) {
                //     return res.status(400).send(failure("You are not enrolled in this course."));
                // }
            }

            // if answer is posted by a teacher, check if teacher is the one who created the course
            if (user.role === "teacher") {
                const teacher = await teacherModel.findOne({ email: user.email });
                if (!teacher) {
                    return res.status(400).send(failure("User not found."))
                }

                // const authorizedCourses = teacher.coursesTaught.map(courseId => courseId.toString());

                // if (!authorizedCourses.includes(existingForum.courseID.toString())) {
                //     return res.status(400).send(failure("You are not authorized to post an answer to this forum."));
                // }

            }

            // push answer in existing forum
            existingForum.answers.push({
                userWithAnswer: user._id,
                answer
            })
            existingForum.isAnswered = true;
            await existingForum.save();

            return res.status(200).send(success("Answer posted successfully"))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // Assuming you have the User and Question models defined as shown in the previous example

    async getForumForCourse(req, res) {
        try {
            const { courseID } = req.params;

            if (!courseID) {
                return res.status(400).send(failure("Please enter a valid course id."));
            }

            const forum = await forumModel.find({ courseID: courseID })
                .populate('userWithQuestion', '_id email username')
                .populate('answers.userWithAnswer', '_id email username')
                .exec();

            if (!forum) {
                return res.status(400).send(failure("Forum not found"));
            }

            return res.status(200).send(success("Forum found successfully", forum));
        } catch (error) {
            console.log("error", error);
            return res.status(500).send(failure("Internal server error"));
        }
    }

}

module.exports = new ForumController()