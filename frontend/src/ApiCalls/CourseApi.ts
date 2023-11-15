import axios from 'axios';
// import { toast } from 'react-toastify';
import { ALL_COURSES_URL } from "../utils/constants";

type Course = {
    currentPage: number;
    selectedSortOption: string;
    selectedOrderOption: string;
    searchQuery: string;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setFetchedData: React.Dispatch<React.SetStateAction<any>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const GetCoursesApi = ({ currentPage, selectedSortOption, selectedOrderOption, searchQuery,setTotalPages,setFetchedData, setCurrentPage}: Course) => {
    // Fetch data from API
    axios
      .get(`${ALL_COURSES_URL}?page=${currentPage}&limit=6&sortParam=${selectedSortOption}&sortOrder=${selectedOrderOption}&search=${searchQuery}`)
      .then((response) => response.data)
      .then((data) => {
        // setNoBooksFound(false);
        setTotalPages(Math.ceil(data.data.totalRecords / 6));
        setCurrentPage(currentPage);
        setFetchedData(data);
      })
      .catch((error) => {
        // swal(error.response.data.message);
        // Handle other errors (network error, timeout, etc.) here.
        console.error("Other Error:", error);
      });
  }

// Add other API functions as needed



// export const GetCoursesApi = async (page: number, selectedSortOption: string, selectedOrderOption: string, searchQuery: string) => {
//     try {
//         const response = await axios.get(
//             `${ALL_COURSES_URL}?page=${page}&limit=6&sortParam=${selectedSortOption}&sortOrder=${selectedOrderOption}&search=${searchQuery}`
//         );

//         const data = response.data;

//         if (data.success === false) {
//             toast.error(data.message);
//         } else if (data.success === true) {
//             return data;
//         }
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 const errorMessage = error.response.data?.message || 'An error occurred during the API request';
//                 toast.error(errorMessage);
//             } else if (error.request) {
//                 toast.error('No response received from the server during the API request');
//             } else {
//                 toast.error('Error setting up the API request');
//             }
//         } else {
//             toast.error('An unknown error occurred during the API request');
//         }
//         throw error; // Re-throw the error so that the caller can handle it
//     }
// };
