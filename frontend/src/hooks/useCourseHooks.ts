import {
  GetCoursesApi,
  AddCourseApi,
  AddVideoApi,
  AddLessonApi,
  GetTopicApi,
  GetTeachersCoursesApi,
  GetTeachersLessonsApi,
  AddNoteApi,
  GetEnrolledCoursesApi,
  GetCompletedCoursesApi,
  AddQuizApi,
  AddDocToAssignmentApi,
  GetAssignmentForCourseApi,
  AddAssignmentApi
} from "../ApiCalls/CourseApi";
import { useCallback } from "react";
import { useState, useEffect, ChangeEvent } from "react";

type Course = {
  _id?: string;
  title?: string;
  description?: string;
  teacherID?: string;
  language?: string;
  learingOutcome?: string;
  requirement?: string[];
  isApproved?: boolean;
  isPublished?: boolean;
  isDeleted?: boolean;
  topicID?: string;
  rating?: number;
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
  lessonID?: string[];
  thumbnail?: string;
};

const useCourse = () => {
  //search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);

  // Search query handler
  const handleSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getTopic = async () => {
    try {
      const data = await GetTopicApi();
      return data;
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const addCourse = useCallback(async (data: any, token: string) => {
    try {
      await AddCourseApi(data, token);
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const addVideo = useCallback(
    async (lessonID: string, data: any, token: string) => {
      try {
        await AddVideoApi(lessonID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const addNote = useCallback(
    async (lessonID: string, data: any, token: string) => {
      try {
        await AddNoteApi(lessonID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const addLesson = useCallback(
    async (courseID: string, data: any, token: string) => {
      try {
        await AddLessonApi(courseID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const addAssignment = useCallback(
    async (courseID: string, data: any, token: string) => {
      try {
        await AddAssignmentApi(courseID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const addQuiz = useCallback(
    async (courseID: string, data: any, token: string) => {
      try {
        await AddQuizApi(courseID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const addDocToAssignment = useCallback(
    async (assignmentID: string, data: any, token: string) => {
      try {
        await AddDocToAssignmentApi(assignmentID, data, token);
      } catch (error: any) {
        console.log(error);
      }
    },
    []
  );

  const getAllCourses = async () => {
    try {
      const data = await GetCoursesApi(searchQuery);
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    const timeOutFunc = setTimeout(() => {
      console.log("changed");
      getAllCourses().then((data: Course[] | void) => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      });
    }, 2000);

    return () => clearTimeout(timeOutFunc);
  }, [searchQuery]);

  console.log("courses from hook", courses);

  const getEnrolledCourses = async (token: string) => {
    try {
      const data = await GetEnrolledCoursesApi(token);
      console.log("data from hook", data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const getCompletedCourses = async (token: string) => {
    try {
      const data = await GetCompletedCoursesApi(token);
      console.log("data from hook", data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const getTeachersCourse = useCallback(async (token: string) => {
    try {
      const response = await GetTeachersCoursesApi(token);
      return response;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const getAssignmentForCourse = useCallback(async (token: string, courseID: string) => {
    try {
      const response = await GetAssignmentForCourseApi(token, courseID);
      console.log("ass from hook", response);
      return response;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const getTeachersLesson = useCallback(async (token: string) => {
    try {
      const response = await GetTeachersLessonsApi(token);
      console.log("response from hook", response.data);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  return {
    getAllCourses,
    getTopic,
    addCourse,
    getTeachersCourse,
    getTeachersLesson,
    addLesson,
    addVideo,
    addNote,
    getEnrolledCourses,
    getCompletedCourses,
    handleSearchQuery,
    searchQuery,
    courses,
    addQuiz,
    addDocToAssignment,
    getAssignmentForCourse,
    addAssignment
  };
};

export default useCourse;