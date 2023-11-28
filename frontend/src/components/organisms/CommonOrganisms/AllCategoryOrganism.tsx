import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const AllCategoryOrganism = (props: Props) => {
  const navigate = useNavigate();
  const imgURL =
    "https://images.unsplash.com/photo-1613946709284-0aa74f040a12?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const containerStyle = {
    backgroundImage: `url(${imgURL})`,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={containerStyle}
    >
      <div className="text-white text-center flex flex-col justify-center items-center">
        <img src="setting.png" className="w-[80px] h-[80px] text-white"></img>
        <h1 className="text-6xl font-bold mb-6">Welcome to Renaissance</h1>
        <p className="text-lg mb-8">
          Unlock Your Potential with Online Learning
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="bg-yellow-500 text-gray-900 rounded-full px-8 py-3 text-xl font-semibold transition duration-300 hover:bg-yellow-400"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AllCategoryOrganism;
