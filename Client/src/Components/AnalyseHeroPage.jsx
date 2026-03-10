import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/blogtop2.png"; // Make sure path is correct
import { FaBrain, FaChartLine, FaSmile, FaHeart, FaLightbulb, FaArrowRight } from "react-icons/fa";

const AnalyseHeroPage = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="relative w-full min-h-[90vh] bg-[#f8fafc] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-12 overflow-hidden">
      
      {/* --- Background Decorative Elements --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-emerald-100/40 rounded-full blur-[100px]" />
      </div>

      {/* --- Left Section (Text & Content) --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8 text-center md:text-left w-full md:w-1/2 z-10"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            AI-Powered Insights
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1]">
            Analyse Your <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Daily Mood
            </span>
          </h1>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-slate-600 text-lg lg:text-xl max-w-md mx-auto md:mx-0 leading-relaxed"
        >
          Understand your emotional patterns with precision. Get deep insights, 
          track your mental growth, and build a resilient mindset.
        </motion.p>

        {/* Highlights Cards */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center md:justify-start"
        >
          {[
            { icon: <FaBrain />, text: "Deep Insights", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: <FaChartLine />, text: "Track Progress", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: <FaSmile />, text: "Boost Wellbeing", color: "text-amber-500", bg: "bg-amber-50" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm px-4 py-3 rounded-2xl hover:shadow-md transition-shadow">
              <span className={`${item.bg} ${item.color} p-2 rounded-lg text-lg`}>
                {item.icon}
              </span>
              <p className="text-sm font-semibold text-slate-700">{item.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Action Button */}
        <motion.div variants={itemVariants}>
          <button
            className="group relative inline-flex items-center justify-center gap-3 bg-slate-900 text-white font-bold py-4 px-10 rounded-2xl overflow-hidden transition-all hover:bg-blue-600 active:scale-95 shadow-xl shadow-slate-200"
            onClick={() => window.open("/ActualAnalyser", "_blank")}
          >
            <span className="relative z-10">Start Mood Analysis</span>
            <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </motion.div>

      {/* --- Right Section (Image & Floating Elements) --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0"
      >
        {/* Decorative Ring */}
        <div className="absolute w-[80%] h-[80%] border-[2px] border-dashed border-slate-200 rounded-full animate-[spin_20s_linear_infinite]" />

        {/* Floating Icon: Heart */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-10 left-10 z-20 bg-white shadow-xl p-4 rounded-3xl text-pink-500 hidden lg:block"
        >
          <FaHeart className="text-3xl drop-shadow-sm"/>
        </motion.div>

        {/* Floating Icon: Idea */}
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-10 right-10 z-20 bg-white shadow-xl p-4 rounded-3xl text-yellow-500 hidden lg:block"
        >
          <FaLightbulb className="text-3xl drop-shadow-sm"/>
        </motion.div>

        {/* Main Hero Image */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-[90%] md:w-[85%] lg:w-[75%]"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-8 ring-white/50">
            <img
              src={heroImg}
              alt="Mood Analysis Illustration"
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AnalyseHeroPage;