import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Sparkles } from 'lucide-react';
import BreathingExercise from './BreathingExercise';
import { MeditationPlayer } from './MeditationPlayer';

const MeditationAndExercise = () => {
  // Animation Variants for the content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  return (
    <section className="relative min-h-screen py-20 px-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* --- Animated Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Teal Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px]" 
        />
        {/* Soft Blue Orb */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -60, 0] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16 space-y-4"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold tracking-wide uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>Daily Serenity</span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            Mindfulness & <span className="italic font-serif text-emerald-600">Wellness</span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl max-w-2xl mx-auto text-slate-500 leading-relaxed"
          >
            Find your center in the chaos. Use our guided tools to regulate your breath 
            and calm your mind. A better you begins with a single deep breath.
          </motion.p>
        </motion.div>

        {/* --- Main Content Grid --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
        >
          {/* Meditation Player Card */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 border border-white hover:border-emerald-200 transition-all duration-500"
          >
            <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
              <Leaf className="w-12 h-12 text-emerald-500" />
            </div>
            <MeditationPlayer />
          </motion.div>

          {/* Breathing Exercise Card */}
          <motion.div 
            variants={itemVariants}
            className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-8 shadow-xl shadow-slate-200/50 border border-white hover:border-blue-200 transition-all duration-500"
          >
            <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
              <Wind className="w-12 h-12 text-blue-500" />
            </div>
            <BreathingExercise />
          </motion.div>
        </motion.div>

        {/* --- Footer Note --- */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-slate-400 text-sm font-medium"
        >
          Remember: Consistency is the key to inner peace. See you tomorrow.
        </motion.p>

      </div>
    </section>
  );
};

export default MeditationAndExercise;