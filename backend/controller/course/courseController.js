const courseModel = require("../../model/courseModel/course")
const authModel = require("../../model/authModel/auth")
const topicModel = require("../../model/courseModel/topic")
const { success, failure } = require("../../utils/successError")
const { uploadFile, deleteFile, deleteFolder } = require("../../config/files")
const express = require('express')
const mongoose = require("mongoose")
const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

class CourseController {
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

    async handleDeleteFile(req, res) {
        try {
            const fileUrl = req.body.fileUrl

            const existingURL = await courseModel.findOne({ thumbnail: fileUrl })

            if (!existingURL) {
                return res.status(400).send(failure("File not found."));
            }

            // await imageModel.deleteOne({ image: fileUrl })

            await deleteFile(fileUrl)

            return res.status(200).send(success("File deleted."));
        } catch (error) {
            console.error("Error while handling delete file:", error);
            return res.status(500).send(failure("Internal server error."));
        }
    }

    async createCourse(req, res) {
        try {
            const thumbnail = req.file
            const { title, description, language, learingOutcome, requirement, topicID } = req.body

            console.log(title, description, language, learingOutcome, requirement, topicID)

            if (!title || !description || !language || !learingOutcome || !requirement || !topicID) {
                return res.status(400).send(failure("Please fill all the fields"))
            }

            const existingTitle = await courseModel.findOne({ title })

            if (existingTitle) {
                return res.status(400).send(failure("Course title already exists. Please choose a different title."))
            }

            const existingteacher = await authModel.findOne({ _id: new mongoose.Types.ObjectId(req.user._id) })
                .select("role isVerified isBanned")

            if (!existingteacher) {
                return res.status(400).send(failure("teacher not found"))
            }

            const existingTopic = await topicModel.findOne({ _id: new mongoose.Types.ObjectId(topicID) })
            if (!existingTopic || existingTopic.isDeleted === true) {
                return res.status(400).send(failure("Topic not found"))
            }

            const uploadRes = await uploadFile(thumbnail, "thumbnail_folder")

            const course = new courseModel({
                title,
                description,
                teacherID: req.user._id,
                language,
                learingOutcome,
                requirement,
                topicID,
                thumbnail: uploadRes,
            })

            await course.save()

            const response = course.toObject()
            delete response.__v
            delete response.isDeleted

            return res.status(200).send(success("Course created successfully", response))
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get all courses
    async getCourses(req, res) {
        try {
            let { page, limit, sortParam, sortOrder, search } = req.query

            let result = 0
            // Total number of records in the whole collection
            const totalRecords = await courseModel.countDocuments({})

            if (!page || !limit) {
                page = 1
                limit = 6
            }

            if (page < 1 || limit < 0) {
                return res.status(400).send(failure("Page must be at least 1 and limit must be at least 0"))
            }

            // sorting
            if (
                (sortParam && !sortOrder) ||
                (!sortParam && sortOrder) ||
                (sortParam && sortParam !== "rating" && sortParam !== "createdAt") ||
                (sortOrder && sortOrder !== "asc" && sortOrder !== "desc")
            ) {
                return res.status(400).send(failure("Invalid sort parameters provided."));
            }

            // search
            if (search) {
                filter["$or"] = [
                    { title: { $regex: search, $options: "i" } },
                ];
            }

            result = await courseModel.find()
                .sort(sortParam ? {
                    [sortParam]: sortOrder === "asc" ? 1 : -1,
                } : {
                    _id: 1
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-__v -updatedAt')


            if (result.length > 0) {
                const paginationResult = {
                    courses: result,
                    totalInCurrentPage: result.length,
                    currentPage: parseInt(page),
                    totalRecords: totalRecords
                }
                return res.status(200).send(success("All courses", paginationResult))
            }
            return res.status(400).send(failure("No course was found"));

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // delete a course
    async deleteCourse(req, res) {
        try {
            const { courseID } = req.body

            const existingCourse = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(courseID) })
            if (!existingCourse) {
                return res.status(400).send(failure("This course does not exist. Please enter a valid course."))
            }

            // soft delete
            existingCourse.isDeleted = true
            existingCourse.lessonID = [];
            await existingCourse.save()

            return res.status(200).send(success("Course deleted successfully"))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }
}

module.exports = new CourseController()