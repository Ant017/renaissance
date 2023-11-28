// AllCoursesPage.tsx

import React, { useEffect, useState } from 'react';
import NavBarOrganism from '../../organisms/CommonOrganisms/NavBarOrganism';
import GetCoursesOrganism from '../../organisms/CommonOrganisms/GetCoursesOrganism';
import LoaderComponent from '../../atoms/Loader';

type Props = {};

const AllCoursesPage = (props: Props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating a 2-second delay
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBarOrganism />
            {loading ? (
                <div className="flex items-center justify-center flex-grow">
                    <LoaderComponent />
                </div>
            ) : (
                <GetCoursesOrganism />
            )}
        </div>
    );
};

export default AllCoursesPage;
