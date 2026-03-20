import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Sparkles } from "lucide-react";

const Bubble = ({ setisChatOpen, isLightMode }) => {
  const [isBubbleShow, setisBubbleShow] = useState(true);

  return (
    <AnimatePresence>
      {isBubbleShow && (
        <div className="fixed right-6 cursor-pointer bottom-6 lg:right-10 lg:bottom-10 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="relative"
          >
            {/* --- Animated Floating Leaf --- */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 20, 0],
                x: [0, 5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-6 -left-2 text-emerald-500 z-10"
            >
              <Leaf size={24} fill="currentColor" fillOpacity={0.2} />
            </motion.div>

            {/* --- Main Bubble Button --- */}
            <button
              onClick={() => setisChatOpen((prev) => !prev)}
              className="relative group flex items-center justify-center"
            >
              {/* Breathing Glow Aura */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full blur-2xl ${
                  isLightMode ? "bg-emerald-400" : "bg-teal-500"
                }`}
              />

              {/* Central Circle */}
              <div
                className={`relative h-14 w-14 lg:h-20 lg:w-20 rounded-full flex justify-center items-center shadow-2xl transition-all duration-500 group-hover:scale-110 overflow-hidden border-2 border-white/30 ${
                  isLightMode 
                  ? "bg-gradient-to-br from-emerald-400 to-teal-600" 
                  : "bg-gradient-to-br from-slate-800 to-slate-900"
                }`}
              >
                {/* Close Button (Small & Subtle) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setisBubbleShow(false);
                  }}
                  className="absolute top-1 right-1 p-1 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors cursor-pointer z-20"
                >
                  <X size={12} strokeWidth={3} />
                </div>

                {/* Zen Icon */}
                <div className="flex flex-col items-center justify-center text-white">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Sparkles size={28} className="drop-shadow-md" />
                  </motion.div>
                  <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-80">
                    Zen AI
                  </span>
                </div>

                {/* Internal Water Ripple Effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-150 group-hover:scale-100" />
              </div>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Bubble;