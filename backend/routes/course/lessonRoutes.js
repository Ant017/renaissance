const express = require('express')
const routes = express()
const multer = require('multer');
const upload = multer();
const LessonController = require('../../controller/course/lessonController')
const { isUserLoggedIn,
    isUserAdmin,
    isUserStudent,
    isUserTeacher } = require('../../middleware/auth')

routes.post("/create-lesson/:courseID", isUserLoggedIn, isUserTeacher, LessonController.createLesson)
routes.post("/add-video/:lessonID", isUserLoggedIn, isUserTeacher, upload.single('videoLink'), LessonController.addVideos)
routes.delete("/delete-video/:lessonID", LessonController.deleteVideo)
routes.post("/add-note/:lessonID", isUserLoggedIn, isUserTeacher, upload.single('noteLink'), LessonController.addNotes)
routes.delete("/delete-lesson/:lessonID", isUserLoggedIn, isUserTeacher, LessonController.deleteLesson)
routes.get("/complete-lesson/:lessonID", isUserLoggedIn, isUserStudent, LessonController.completeLesson)
routes.get("/get-teachers-lesson", isUserLoggedIn, isUserTeacher, LessonController.getTeacherLessons)

module.exports = routes 