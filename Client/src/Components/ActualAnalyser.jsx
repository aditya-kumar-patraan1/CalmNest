import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaLeaf,
  FaSmileBeam,
  FaStar,
  FaCloud,
  FaSpa,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import EmbeddedBreathingExercie from "./EmbeddedBreathingExercie";

const ActualAnalyser = () => {
  const [mood, setMood] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [myActualMood, setmyActualMood] = useState("sad");
  const [positiveResult, setpositiveResult] = useState(false);
  const [negativeResult, setnegativeResult] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  // const meditationLink="https://res.cloudinary.com/diwodg2yv/video/upload/v1756541350/inhale-exhale-ambient-peaceful-meditation-365001_tawmlu.mp3";
  const Navigate = useNavigate();

  const negativeEmotions = [
    "sad",
    "angry",
    "fearful",
    "disgusted",
    "stressed",
    "tired",
    "frustrated",
    "bored",
    "lonely",
  ];

  const PositiveEmotions = [
    "happy",
    "surprised",
    "calm",
    "excited",
    "confident",
    "grateful",
    "curious",
    "loved",
    "neutral",
  ];

  function openNewScreen() {
    console.log(myActualMood);
    if (PositiveEmotions.includes(myActualMood)) {
      setpositiveResult(true);
      setnegativeResult(false);
    } else {
      setnegativeResult(true);
      setpositiveResult(false);
    }
  }

  const callToMood = async () => {
    const result = await axios.post(`${BACKEND_URL}/api/mood_analysis/getMyCurrentMood`, {
      myCurrMood: mood
    })
    return result.data;
  }


const submitPrompt = async (e) => {
  e.preventDefault();
  if (mood.trim().length == 0) {
    toast.error("Please Provide Your Thought");
    return;
  }
  try{
    const result = await callToMood();
    if (result.status == 1){
      toast.success("Mood analyzed");
    }
    else{
      throw new Error();
    }
    openNewScreen();
  }catch(e){
    toast.error("Server issue");
  }
};

return (
  <>
    <Toaster />
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden px-6 py-12">
      {/* {positiveResult && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

            <div className="w-full flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-500 p-4 sm:p-5">
              <h2 className="text-white text-2xl sm:text-3xl font-bold">
                {myActualMood}
              </h2>
              <button
                onClick={() => setpositiveResult(false)}
                className="text-white text-xl bg-white/20 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <p className="text-gray-800 text-center text-xl sm:text-2xl font-semibold">
                Do you want to make it memorable by adding it to your journal?
              </p>

              <textarea
                rows="4"
                placeholder="Write about your feelings..."
                className="w-full bg-gray-100 rounded-xl border-2 border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              ></textarea>

              <button className="w-full sm:w-auto px-8 py-3 rounded-full text-white mx-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-lg">
                <FaPlus />
                Add Mood Entry
              </button>

              <div className="flex justify-end mt-2">
                <p
                  onClick={() => Navigate("/Mood-Analytics")}
                  className="text-purple-600 hover:text-purple-500 hover:underline transition-all duration-300 cursor-pointer font-medium"
                >
                  Past 3 Days Data
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* {negativeResult && (
  <div className="fixed inset-0 h-screen  backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6">
    <div className="w-full max-w-5xl h-[100%] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">

      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xl sm:text-2xl">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-white/40 animate-pulse"></div>
          Meditation Zone
        </div>
        <button
          onClick={() => setnegativeResult(false)}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col lg:flex-row p-4 sm:p-6 gap-6 overflow-hidden  overflow-y-auto">

        <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 sm:gap-3 hover:scale-105 duration-300 transition-all ease-in-out cursor-pointer" onClick={()=>window.open("/LobbyPage","_blank")}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-md">
              ✨
            </div>
            <h3 className="font-bold text-md sm:text-lg text-gray-800 text-center">Join a Session</h3>
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              Connect with others in guided meditation
            </p>
          </div>

          <div className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl  flex-col items-center justify-center gap-2 sm:gap-3 hover:scale-105 duration-300 transition-all ease-in-out cursor-pointer"
          onClick={()=>window.open("/LocationTracker","_blank")}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r block mx-auto from-green-400 to-teal-500  items-center justify-center text-white text-2xl">
              <p className="text-center p-2">📍</p>
            </div>
            <h3 className="font-bold text-md sm:text-lg text-gray-800 text-center">Find Nearby</h3>
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              Discover meditation centers around you
            </p>
          </div>
        </div>

        <div className="lg:w-2/3 flex flex-col items-center justify-center gap-4 sm:gap-6">
          <div className="lg:w-fit lg:h-fit sm:h-80  flex flex-col items-center justify-center gap-2 sm:gap-3 text-white hover:scale-[1.02] p-4 sm:p-6 duration-300 transition-all ease-in-out">
          <EmbeddedBreathingExercie/>
        </div>
        </div>
      </div>
    </div>
  </div>
)} */}

      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 4 }}
        className="absolute top-10 left-10 text-pink-400 text-4xl opacity-70"
      >
        <FaHeart />
      </motion.div>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: -20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 5 }}
        className="absolute bottom-20 left-16 text-green-400 text-4xl opacity-70"
      >
        <FaLeaf />
      </motion.div>
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 6 }}
        className="absolute top-28 right-14 text-yellow-400 text-4xl opacity-70"
      >
        <FaStar />
      </motion.div>
      <motion.div
        initial={{ x: 20 }}
        animate={{ x: -20 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 7 }}
        className="absolute bottom-12 right-24 text-blue-400 text-4xl opacity-70"
      >
        <FaCloud />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <FaSpa className="text-6xl text-purple-500 mx-auto" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-4 tracking-wide">
            Mindful
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent font-medium">
              {" "}
              Reflection
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Share your thoughts, feelings, or experiences. Let us guide you to
            inner peace and clarity.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <form onSubmit={(e)=>submitPrompt(e)} className="w-full flex gap-4">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Type your mood here..."
              className="flex-1 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm w-5/6"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-3 py-3 cursor-pointer rounded-xl text-white bg-blue-600 font-semibold shadow-md transition-all duration-300 w-1/6 hover:bg-blue-700"
            >
              Analyse
            </motion.button>
          </form>
        </motion.div>

        <div className="flex justify-center gap-4 mt-8 text-2xl">
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            😊
          </span>
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            😔
          </span>
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            😡
          </span>
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            😴
          </span>
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            🤩
          </span>
          <span className="hover:scale-115 cursor-pointer duration-200 transition-all">
            🥰
          </span>
        </div>
      </motion.div>
    </div>
  </>
);
};

export default ActualAnalyser;
