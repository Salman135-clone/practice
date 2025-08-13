import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };
  return (
    <>
      <div className="flex justify-between ">
        {/* <Nav /> */}
        <p>Home</p>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
          onClick={login}
        >
          Login
        </button>
      </div>
    </>
  );
};
export default Home;
