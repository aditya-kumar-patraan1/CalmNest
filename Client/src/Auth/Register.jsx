import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import BackgroundTemplate from "../assets/BackgroundTemplate.png";

const Register = () => {
  const Navigate = useNavigate();
  const { setisLoggedIn, isLoggedIn, userData, getUserData } = useAppContext();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  async function saveToMongo(){
    console.log(formData);
    const result = await axios.post(`${BACKEND_URL}/api/v1/register`,formData)
    return result.data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      toast.error(`Please fill all details.`);
    }

    try{
      const res = await saveToMongo();
      console.log(res);
      if(res.status === 1){
        toast.success("User registered");
        navigate("/LoginPage");
      }
      else{
        throw new Error();
      }
    } 
    catch(e){
      toast.error("User not registered");
    }
  }

  function handleChange(e) {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {}, [formData]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 bg-gray-50 relative">
      <img src={BackgroundTemplate} className="absolute top-0 left-0 h-full w-full"/>
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-xl shadow-lg p-6 sm:p-8 md:p-10 bg-white z-40">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 text-gray-900">
          Create Your Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
              Name
            </label>
            <div className="relative">
              <FiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition cursor-pointer"
            >
              Register
            </button>

            <button
              type="button"
              className="text-sm text-gray-600 hover:underline cursor-pointer"
              onClick={() => Navigate("/LoginPage")}
            >
              Already have an account?
            </button>
          </div>
        </form>

        <Toaster />
      </div>
    </div>
  );
};

export default Register;
