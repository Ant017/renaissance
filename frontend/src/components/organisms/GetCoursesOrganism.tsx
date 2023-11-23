import React, { useEffect, useState } from 'react';
import FilterCourseMolecule from '../molecules/FilterCourseMolecule';
import GetCoursesMolecule from '../molecules/GetCoursesMolecule';
import SearchAndDropdownMolecule from '../molecules/SearchAndDropdownMolecule';
import useCourse from '../../hooks/useCourseHooks';

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

const optionsData = [
    { heading: 'Rating', options: ["5 stars", "4 stars", "3 stars", "2 stars", "1 star"] },
    { heading: 'Difficulty', options: ["Beginner", "Intermediate", "Advanced"] },
];

const GetCoursesOrganism = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    return (
        <div>
            <SearchAndDropdownMolecule setCourses={setCourses} />
            <div className="my-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row">
                <FilterCourseMolecule data={optionsData} />
                <GetCoursesMolecule courses={courses} />
            </div>
        </div>
    );
};

export default GetCoursesOrganism;
