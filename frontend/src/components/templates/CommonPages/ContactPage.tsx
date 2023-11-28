// ContactPage.tsx

import React from "react";
import NavBarOrganism from "../../organisms/CommonOrganisms/NavBarOrganism";
import FooterMolecule from "../../molecules/CommonMolecules/FooterMolecule";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBarOrganism />
      <div className="flex-grow container mx-auto my-8 p-7">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-700">
          Have questions or suggestions? Reach out to us using the contact
          information below:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Email: antika.noor98@gmail.com</li>
          <li>Phone: +8801775903550</li>
        </ul>
      </div>
      <FooterMolecule />
    </div>
  );
};

export default ContactPage;
