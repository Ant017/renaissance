import { GetCoursesApi, AddCourseApi, GetTopicApi, GetTeachersCoursesApi } from "../ApiCalls/CourseApi";
import { useCallback } from 'react';

const useCourse = () => {
    const getTopic = async () => {
        try {
            const data = await GetTopicApi(); // Await the promise
            return data;
        } catch (error) {
            console.error('Error fetching topics:', error);
            // Handle the error or re-throw it if necessary
        }
    };

    const addCourse = useCallback(
        async (data: any, token: string) => {
            try {
                await AddCourseApi(data, token);
                // Optionally, update the user state or perform other actions
            } catch (error: any) {
                console.log(error)
            }
        },
        []
    );

    const getAllCourses = async () => {
        try {
            const data = await GetCoursesApi();
            return data
            // console.log("data from hook", data)
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const getTeachersCourse = useCallback(
        async (token: string) => {
            try {
                const response = await GetTeachersCoursesApi(token);
                return response
                // Optionally, update the user state or perform other actions
            } catch (error: any) {
                console.log(error)
            }
        },
        []
    );

    return {
        getAllCourses,
        getTopic,
        addCourse,
        getTeachersCourse
    };
};

export default useCourse

// // useCourseHook.tsx
// import { useState, useEffect } from 'react';
// import { debounce } from 'lodash';
// import { GetCoursesApi } from '../ApiCalls/CourseApi';

// type UseCourseHookProps {
//   defaultPage: number;
//   defaultLimit: number;
// }

// const useCourseHook = ({ defaultPage, defaultLimit }: UseCourseHookProps) => {
//   const [courses, setCourses] = useState([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [page, setPage] = useState(defaultPage);
//   const [limit, setLimit] = useState(defaultLimit);
//   const [sortParam, setSortParam] = useState('');
//   const [sortOrder, setSortOrder] = useState('');
//   const [search, setSearch] = useState('');

//   const fetchCourses = async () => {
//     try {
//       const data = await GetCoursesApi(page, selectedSortOption, selectedOrderOption, searchQuery);
//       setCourses(data.courses);
//       setTotalRecords(data.totalRecords);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   // Debounce the fetch function to wait for 3 seconds after the last keystroke
//   const debouncedFetch = debounce(fetchCourses, 3000);

//   useEffect(() => {
//     fetchCourses();
//   }, [page, limit, sortParam, sortOrder, search]);

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handleSortChange = (param: string, order: string) => {
//     setSortParam(param);
//     setSortOrder(order);
//   };

//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     debouncedFetch();
//   };

//   return {
//     courses,
//     totalRecords,
//     page,
//     limit,
//     sortParam,
//     sortOrder,
//     search,
//     handlePageChange,
//     handleSortChange,
//     handleSearchChange,
//   };
// };

// export default useCourseHook;
