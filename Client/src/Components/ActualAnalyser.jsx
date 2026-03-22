import React, { useCallback, useState,useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EmbeddedBreathingExercie from "./EmbeddedBreathingExercie";
import mainToMoodGemini from "../Service/ai.service";
import { 
  FaRegChartBar, FaBrain, FaUserMd, FaHeart, FaLeaf, 
  FaSmileBeam, FaStar, FaCloud, FaSpa, FaPlus, 
  FaPause, FaPlay, FaUndo, FaMapMarkerAlt 
} from "react-icons/fa";

const ActualAnalyser = () => {

  const [mood, setMood] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setisOpen] = useState(false);
  // const meditationLink="https://res.cloudinary.com/diwodg2yv/video/upload/v1756541350/inhale-exhale-ambient-peaceful-meditation-365001_tawmlu.mp3";
  const navigate = useNavigate();
  const [myActualMood, setmyActualMood] = useState("");
  const [positiveResult, setpositiveResult] = useState(false);
  const [negativeResult, setnegativeResult] = useState(false);
  const phaseConfig = {
  inhale: { duration: 4, label: 'Inhale', color: 'bg-emerald-400' },
  hold1: { duration: 4, label: 'Hold', color: 'bg-emerald-500' },
  exhale: { duration: 6, label: 'Exhale', color: 'bg-emerald-600' },
  hold2: { duration: 2, label: 'Hold', color: 'bg-emerald-500' }
};

  // --- BREATHING LOGIC STATES ---
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const phases = ['inhale', 'hold1', 'exhale', 'hold2'];

  const getNextPhase = useCallback((phase) => {
    const currentIndex = phases.indexOf(phase);
    return phases[(currentIndex + 1) % phases.length];
  }, []);

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeRemaining(4);
    setCycleCount(0);
  };

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (isActive && timeRemaining === 0) {
      const nextPhase = getNextPhase(currentPhase);
      setCurrentPhase(nextPhase);
      setTimeRemaining(phaseConfig[nextPhase].duration);
      if (currentPhase === 'hold2') setCycleCount(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentPhase, getNextPhase]);


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

  const submitPrompt = async (e) => {
    e.preventDefault();
    if (mood.trim().length == 0) {
      toast.error("Please Provide Your Thought");
      return;
    }
    try {
      // console.log("sended mood is : ",mood);
      const result = await mainToMoodGemini(mood.trim());
      setmyActualMood(result);
      toast.success("Mood analyzed");
      openNewScreen();
    } catch (e) {
      toast.error("Server issue");
    }
  };

  return (
    <>
      <Toaster />
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden px-6 py-12">
        <p>{myActualMood}</p>

        {/* --- POSITIVE RESULT PANEL --- */}
        <AnimatePresence>
          {positiveResult && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header - Kept your gradient */}
                <div className="w-full flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-500 p-5">
                  <h2 className="text-white text-2xl sm:text-3xl font-bold capitalize">
                    {myActualMood} ✨
                  </h2>
                  <button
                    onClick={() => setpositiveResult(false)}
                    className="text-white text-xl bg-white/20 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col gap-6 p-6 sm:p-8">
                  <p className="text-gray-800 text-center text-xl font-semibold">
                    Do you want to make it memorable by adding it to your
                    journal?
                  </p>

                  <textarea
                    rows="4"
                    placeholder="Write about your feelings..."
                    className="w-full bg-gray-100 rounded-xl border-2 border-gray-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  ></textarea>

                  {/* Feature Buttons Row */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-8 py-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold shadow-md">
                      <FaPlus /> Add Mood Entry
                    </button>
                    <button
                      onClick={() => Navigate("/Mood-Analytics")} // Linked to your analytics
                      className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold"
                    >
                      <FaRegChartBar /> View Trends
                    </button>
                  </div>

                  <div className="flex justify-center mt-2">
                    <p
                      onClick={() => Navigate("/Mood-Analytics")}
                      className="text-purple-600 hover:text-purple-500 hover:underline transition-all cursor-pointer font-medium text-sm uppercase tracking-widest"
                    >
                      View Past 3 Days Analysis
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      <AnimatePresence>
  {negativeResult && (
    <div className="fixed w-3/4 mx-auto inset-0 h-screen backdrop-blur-md flex justify-center items-center z-[100] px-4 py-6">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-6xl h-fit max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
      >
        {/* Header - Gradient & Pulse */}
        <div className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]"></div>
            <h2 className="font-black text-xl tracking-tighter uppercase">Sanctuary Zone</h2>
          </div>
          <button
            onClick={() => setnegativeResult(false)}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content Area - Modular Grid Layout */}
        <div className="p-6 flex flex-row gap-4 overflow-y-auto bg-slate-50/50">
          
          {/* TOP ROW: Small Card + Wide Breathing Exercise */}
          <div className="grid grid-cols-2  gap-4">
            {/* Card 1: Join Session (Small Box) */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => navigate("/LobbyPage")}
              className="px-3 py-5 bg-[#FFFFFF] rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-[20px] group-hover:rotate-12 transition-transform">
                ✨
              </div>
              <h3 className="font-black text-slate-800 text-sm">Join Session</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">Connect in live sessions</p>
            </motion.div>

            
            {/* Card 2: Find Nearby */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => navigate("/LocationTracker")}
              className="px-3 py-5 bg-[#FFFFFF] rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-[20px] mb-3 group-hover:rotate-12 transition-transform">
                📍
              </div>
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Find Nearby</h4>
              <p className="text-slate-500 text-[10px] font-bold">Meditation centers near you</p>
            </motion.div>

            {/* Card 3: Self Audit */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => navigate("/WellnessCheck")}
              className="px-3 py-5 bg-[#FFFFFF] rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-[20px] mb-3 group-hover:rotate-12 transition-transform">
                <FaBrain />
              </div>
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Self Audit</h4>
              <p className="text-slate-500 text-[10px] font-bold">Take clinical assessments</p>
            </motion.div>

            {/* Card 4: Expert Advice */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => navigate("/Experts")}
              className="px-3 py-5 bg-[#FFFFFF]  rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-[20px] mb-3 group-hover:rotate-12 transition-transform">
                <FaUserMd />
              </div>
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Expert Advice</h4>
             
              <p className="text-slate-500 text-[10px] font-bold">Professional guidance</p>
            </motion.div>
          </div>

             {/* Breathing Exercise (Wide Box) */}
            <div className=" flex-1 rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[#F7F8F9] to-transparent pointer-events-none"></div>
               <div className="relative gap-0 z-10 w-full  flex flex-col items-center">
                  <h4 className="text-[#314158] font-black text-[10px] uppercase tracking-[0.4em] mb-6">Focus on your breath</h4>
                  <div className="transform scale-75 flex flex-col items-center md:scale-90 lg:scale-100">
                    {/* here here here */}
                    {/* <div className="flex-1 bg-yellow-950 rounded-[2.5rem] p-10 flex flex-col gap-2 items-center justify-between shadow-2xl relative overflow-hidden min-h-[350px]"> */}
                       {/* <div className=" bg-amber-300 flex flex-col gap-3 inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 pointer-events-none"></div> */}
                       
                       {/* Circle Visualization Area */}
                       {/* <div className="relative z-10 flex-1 flex flex-col items-center"> */}
                          <div className="relative  w-32 h-32 flex items-center justify-center">
                            {/* Inner Pulsing Circle */}
                            <motion.div
                              className="w-32 h-32 rounded-full bg-emerald-500/20"
                              animate={isActive ? { scale: (currentPhase === 'inhale' || currentPhase === 'hold1') ? 1.6 : 0.8 } : { scale: 1 }}
                              transition={{ duration: phaseConfig[currentPhase].duration, ease: "easeInOut" }}
                            />
                            {/* Text Info Inside */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                               <div className="text-5xl font-black mb-1">{timeRemaining}</div>
                               <div className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400">{currentPhase}</div>
                            </div>
                          </div>
                       {/* </div> */}

                       {/* Stats & Controls Area */}
                       <div className="relative z-10  flex-1 flex flex-col items-center md:items-start gap-5 px-6">
                          <div className="flex items-center flex-col w-full md:text-left p-3">
                            <h4 className="text-[#314158] font-black mx-auto text-2xl ">Mindful Breathing</h4>
                            <p className="text-slate-500 text-sm mt-1">Sync your soul with the rhythm</p>
                          </div>

                          <div className="flex items-center gap-8">
                            <button onClick={() => setIsActive(!isActive)} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                              {isActive ? <FaPause /> : <FaPlay />} {isActive ? "Pause" : "Begin"}
                            </button>
                            <button onClick={resetExercise} className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all">
                              <FaUndo />
                            </button>
                            <div className="text-[#314158] text-[10px] font-black uppercase tracking-widest pl-4 border-l border-slate-800">
                               Cycles <br/> <span className="text-[#314158] text-lg font-black">{cycleCount}</span>
                            </div>
                          </div>

                          {/* Phase Trackers */}
                          <div className="grid grid-cols-4 gap-3 w-full">
                             {phases.map(p => (
                               <div key={p} className={`py-3 rounded-2xl text-center border-2 transition-all ${currentPhase === p ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                                  <p className="text-[8px] font-black uppercase tracking-tighter">{phaseConfig[p].label}</p>
                                  <p className="text-[12px] font-black">{phaseConfig[p].duration}s</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    {/* </div> */}
                    {/* here here here end */}
                  </div>
               </div>
            </div>

        </div>

        {/* Footer Note */}
        <div className="px-8 py-3 bg-white border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            CalmNest Sanctuary • Focus on clarity, leave the rest behind
          </p>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

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
            <form
              onSubmit={(e) => submitPrompt(e)}
              className="w-full flex gap-4"
            >
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Express your mood here..."
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
