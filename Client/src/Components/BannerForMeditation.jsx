import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PreaceFulYogaImage from "../assets/PeacefulYogaImage.png";
import BookReadingImage from "../assets/BookReadingImage.png";

const BannerForMeditation = () => {
  const [turn, setTurn] = useState(true);
  const navigate = useNavigate();

  const slides = [
    {
      turn: true,
      heading: "Connect with Experts Nearby for Your Well-Being",
      description:
        "Get guidance from trusted professionals around you — whether it’s a doctor, therapist, or wellness expert.",
      image: PreaceFulYogaImage,
      url: "/LocationTracker",
    },
    {
      turn: false,
      heading: "Your AI Expert, Always Here for You",
      description:
        "Get instant support and personalized guidance from our AI Expert with smart recommendations.",
      image: BookReadingImage,
      url: "/AIHealthAssistant",
    },
  ];

  const activeSlide = slides.find((item) => item.turn === turn);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-200 blur-[120px] opacity-40 rounded-full top-[-80px] left-[-80px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-200 blur-[120px] opacity-40 rounded-full bottom-[-80px] right-[-80px]" />

      <div className="w-10/12 h-[80%] grid lg:grid-cols-2 gap-10 items-center">

        {/* IMAGE */}
        <div className="flex justify-center items-center">

          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide.heading}
              src={activeSlide.image}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl shadow-2xl w-[85%] hover:scale-105 transition duration-500"
            />
          </AnimatePresence>

        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-center">

          {/* Toggle */}
          <div className="flex justify-start mb-8">
            <div className="flex gap-2 bg-white shadow-md p-1 rounded-full">

              <button
                onClick={() => setTurn(true)}
                className={`px-5 py-2 text-sm rounded-full font-medium transition ${
                  turn
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Experts Nearby
              </button>

              <button
                onClick={() => setTurn(false)}
                className={`px-5 py-2 text-sm rounded-full font-medium transition ${
                  !turn
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                AI Expert
              </button>

            </div>
          </div>

          {/* Animated Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.heading}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
            >

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
                  {activeSlide.heading}
                </span>
              </h1>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-xl">
                {activeSlide.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
                onClick={() => navigate(activeSlide.url)}
              >
                Try for Free
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </motion.button>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

export default BannerForMeditation;