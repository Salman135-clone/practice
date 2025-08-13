import React, { useEffect } from "react";
import { useState } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { authProvider } from "../context/MyProvider";

const Login = () => {
  const { login, user } = authProvider();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  // console.log(role);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearInput = (e) => {
    setFormData({
      email: "",
      password: "",
    });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Please Fill all the field");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login Successfully");
      clearInput();
      navigate("/dashboard");
    } catch (error) {
      console.log(error.messages);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center">
        <div className=" p-5 max-w-[400px] text-center w-full ">
          <p className="text-center mb-4 tracking-wider text-2xl font-bold">
            Log In
          </p>
          <div className="flex flex-col w-full gap-7">
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
            onClick={submitLogin}
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
              "Login"
            )}
          </button>
          <div className="text-left mt-3">
            <p>
              <span className="text-gray-600">Don't Have Account?</span>
              <span
                className="text-green-700 ml-1 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
