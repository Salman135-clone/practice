import React from "react";
import { useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../constant/Firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [defaultRole, setDefaultRole] = useState("YL7SXFEXXaFbFKL9uK3R");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
  });
  // console.log(formData);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearInput = (e) => {
    setFormData({
      email: "",
      password: "",
      username: "",
    });
  };

  const onSignup = async (e) => {
    e.preventDefault();
    const { email, password, username, role } = formData;
    if (!email || !password || !username) {
      toast.error("Please Fill all the field");
      return;
    }

    try {
      setLoading(true);
      const registerCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const result = registerCredential.user;

      await setDoc(doc(db, "users", result.uid), {
        uid: result.uid,
        email,
        username,
        role: defaultRole,
      });
      toast.success("Register Successfully");
      clearInput();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center">
        <div className=" p-5 max-w-[400px] text-center w-full ">
          <p className="text-center mb-4 tracking-wider text-2xl font-bold">
            Register
          </p>
          <div className="flex flex-col w-full gap-7">
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleInput}
              id="username"
              placeholder="Set your username"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              id="email"
              placeholder="Enter Your Email"
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              id="password"
              placeholder="Enter Your Password"
              className="mb-4 p-1 w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            />
          </div>
          <button
            onClick={onSignup}
            disabled={loading}
            className={`relative font-mono w-full p-2 rounded-sm cursor-pointer flex justify-center items-center transition-colors duration-200 ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {loading ? (
              <CircularProgress
                size="sm"
                variant="solid"
                className="cursor-not-allowed"
              />
            ) : (
              "Signup"
            )}
          </button>
          <div className="text-left mt-3">
            <p>
              <span className="text-gray-600">Already have account?</span>
              <span
                className="text-green-700 ml-1 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
