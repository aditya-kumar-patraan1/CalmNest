import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardCheck, 
  BarChart3, 
  ShieldCheck, 
  Heart, 
  Brain, 
  Zap, 
  Clock, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const QuestionnaireLanding = () => {
  const navigate = useNavigate();

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: <ClipboardCheck className="w-7 h-7" />,
      title: "Clinical Standards",
      description: "Uses PHQ-9, GAD-7, and DASS-21 gold-standard protocols.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Real-time Tracking",
      description: "Visualize your mood swings and patterns over months.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "100% Private",
      description: "End-to-end encryption. Your data stays only with you.",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Actionable Steps",
      description: "Get personalized coping strategies based on your score.",
      color: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900 selection:bg-purple-100">
      
      {/* --- Decorative Background --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px]" />
      </div>

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Science-Backed Insights</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6"
          >
            Measure Your <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Emotional Wellness
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Take a moment for yourself. Our clinically-validated assessments help you understand your mental state with clarity and compassion.
          </motion.p>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- Assessment Modes (Comparison Section) --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
          <p className="text-slate-500">Select the depth of analysis you need right now.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Quick Mode */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="relative p-10 rounded-[3rem] bg-white border border-slate-200 shadow-lg group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-purple-50 transition-colors">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">5-7 MINS</span>
            </div>
            <h3 className="text-3xl font-bold mb-4">Quick Screening</h3>
            <p className="text-slate-500 mb-8">Best for a regular check-in or when you're short on time.</p>
            
            <ul className="space-y-4 mb-10">
              {["16 Targeted questions", "Mood & Anxiety focus", "Instant summary"].map((li) => (
                <li key={li} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> {li}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/MentalHealthQuestionnaire", { state: { mode: "quick" } })}
              className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
            >
              Start Quick Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Detailed Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="relative p-10 rounded-[3rem] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl shadow-purple-200"
          >
            <div className="absolute top-6 right-8 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
              RECOMMENDED
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-white/10 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="px-4 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase">15-20 MINS</span>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Detailed Analysis</h3>
            <p className="text-purple-100 mb-8">Comprehensive evaluation for deeper insights and clinical patterns.</p>
            
            <ul className="space-y-4 mb-10">
              {["47 Comprehensive questions", "Stress, Anxiety & Depression", "Deep AI-generated report", "Personalized Coping Plan"].map((li) => (
                <li key={li} className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {li}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/MentalHealthQuestionnaire", { state: { mode: "detailed" } })}
              className="w-full py-5 rounded-2xl bg-white text-purple-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
            >
              Start Detailed Analysis <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        <p className="mt-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> HIPAA compliant & Secure data handling
        </p>
      </section>

    </div>
  );
};

export default QuestionnaireLanding;