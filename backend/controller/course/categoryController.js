const categoryModel = require("../../model/courseModel/category")
const topicModel = require("../../model/courseModel/topic")
const courseModel = require("../../model/courseModel/course")
const { success, failure } = require("../../utils/successError")
const express = require('express')
const mongoose = require("mongoose")
const { validationResult } = require('express-validator')
const fs = require('fs')
const path = require('path')

class CategoryController {
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

    async createCategory(req, res) {
        try {

            const { categoryName } = req.body

            if (!categoryName) {
                return res.status(400).send(failure("Please enter category name."))
            }

            const existingCategory = await categoryModel.findOne({ categoryName })

            if (existingCategory && existingCategory.isDeleted === false) {
                return res.status(400).send(failure("Category name already exists."))
            }

            if (existingCategory && existingCategory.isDeleted === true) {
                existingCategory.isDeleted = false
                await existingCategory.save()
                return res.status(200).send(success("Category created successfully", existingCategory))
            }

            const category = new categoryModel({
                categoryName
            })

            await category.save()

            const response = category.toObject()
            delete response.__v

            return res.status(200).send(success("Category created successfully", response))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // delete a category
    async deleteCategory(req, res) {
        try {
            const { categoryID } = req.params

            const existingCategory = await categoryModel.findOne({ _id: new mongoose.Types.ObjectId(categoryID) })
            if (!existingCategory) {
                return res.status(400).send(failure("Category not found."))
            }

            // Orphanize topics
            await topicModel.updateMany({ categoryID: existingCategory._id }, { $unset: { categoryID: 1 } });

            // soft delete
            existingCategory.isDeleted = true
            await existingCategory.save()
            return res.status(200).send(success("Category deleted successfully"))

        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // edit a category
    async editCategory(req, res) {
        try {
            const { categoryID } = req.params
            const { categoryName } = req.body

            if (!categoryName || !categoryID) {
                return res.status(400).send(failure("Please enter category name and ID."))
            }

            const existingCategory = await categoryModel.findOne({ _id: new mongoose.Types.ObjectId(categoryID) })

            if (!existingCategory || existingCategory.isDeleted === true) {
                return res.status(400).send(failure("Category not found."))
            }

            existingCategory.categoryName = categoryName
            existingCategory.save()

            const response = existingCategory.toObject()
            delete response.__v

            return res.status(200).send(success("Category updated successfully", response))
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get all categories
    async getAllCategories(req, res) {
        try {
            const categories = await categoryModel.find({ isDeleted: false })
                .select("categoryName")

            if (!categories) {
                return res.status(400).send(failure("Categories not found."))
            }

            return res.status(200).send(success("All categories", categories))
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get all topics under this category
    async getTopicsUnderCategory(req, res) {
        try {
            const { categoryID } = req.params
            const topics = await topicModel.find({ categoryID: new mongoose.Types.ObjectId(categoryID), isDeleted: false })
                .select("topicName")

            if (!topics) {
                return res.status(400).send(failure("Topics not found."))
            }

            return res.status(200).send(success("All topics under this category", topics))
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }

    // get all courses under a category
    async getCoursesUnderCategory(req, res) {
        try {
            const { categoryID } = req.params

            // find all topics under this category
            const topics = await topicModel.find({ categoryID: new mongoose.Types.ObjectId(categoryID), isDeleted: false })

            if (!topics) {
                return res.status(400).send(failure("Topics not found."))
            }
            console.log("topics", topics)

            // find all courses under these topics
            const courses = await courseModel.find({ topicID: { $in: topics.map(topic => topic._id) }, isApproved: true, isDeleted: false })
            console.log("courses", courses)

            if (!courses) {
                return res.status(400).send(failure("Courses not found."))
            }

            return res.status(200).send(success("All courses under this category", courses))
        } catch (error) {
            console.log("error", error)
            return res.status(500).send(failure("Internal server error"))
        }
    }
}

module.exports = new CategoryController()