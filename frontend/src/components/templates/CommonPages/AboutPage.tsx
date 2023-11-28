// AboutPage.tsx

import React from "react";
import NavBarOrganism from "../../organisms/CommonOrganisms/NavBarOrganism";
import FooterMolecule from "../../molecules/CommonMolecules/FooterMolecule";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBarOrganism />
      <div className="flex-grow container mx-auto my-8 p-8">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-gray-700">
          Welcome to our e-learning platform, Renaissance! We are dedicated to providing
          high-quality education and learning resources to help you achieve your
          goals.
        </p>
      </div>
      <FooterMolecule />
    </div>
  );
};

export default AboutPage;
