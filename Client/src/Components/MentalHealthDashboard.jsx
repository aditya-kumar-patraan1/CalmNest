import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {motion,AnimatePresence} from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FiActivity,
  FiPlus,
  FiMoon,
  FiTrendingUp,
  FiInfo,
  FiX,
  FiCheckCircle,
  FiZap,
  FiMessageCircle,
  FiCpu,
  FiWind,
} from "react-icons/fi";
import { useAppContext } from "../Context/AppContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const MentalHealthDashboard = () => {
  const { userData: user, savedEntries } = useAppContext();
  const navigate = useNavigate();
  const [isAISuggestionOpen, setisAISuggestionOpen] = useState(false);

  // Stats Logic
  const totalEntries = savedEntries?.length || 0;
  const averageMood =
    totalEntries > 0
      ? (
          savedEntries.reduce(
            (sum, entry) => sum + (entry.intensity_level || 0),
            0,
          ) / totalEntries
        ).toFixed(1)
      : "0.0";

  const allDates = savedEntries?.map((entry) => {
    return new Date(entry.createdAt).toLocaleDateString();
  });

  // console.log(allDates);

  const avgForEachDay = savedEntries?.reduce((acc, entry) => {
    const myDate = new Date(entry.createdAt).toISOString().split("T")[0];

    if (!acc[myDate]) {
      acc[myDate] = { sum: 0, count: 0 };
    }

    acc[myDate].sum += entry.intensity_level;
    acc[myDate].count++;

    return acc;
  }, {});

  const initialMoods = {
    happy: 0,
    sad: 0,
    anxious: 0,
    grateful: 0,
    excited: 0,
    angry: 0,
  };

  const seperateMoods =
    savedEntries?.reduce(
      (acc, entry) => {
        const currMood = entry.mood?.toLowerCase();
        if (acc.hasOwnProperty(currMood)) acc[currMood]++;
        return acc;
      },
      { ...initialMoods },
    ) || initialMoods;

  const mostCommonMood = Object.entries(seperateMoods).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["None", 0],
  );

  // --- FIX: Dynamic Labels for Chart ---
  const moodTrendData = {
    // Mapping dates from entries so they match the data points
    labels: Object.keys(avgForEachDay),
    datasets: [
      {
        label: "Mood Level",
        data: Object.entries(avgForEachDay).map((entry) => {
          return (entry[1].sum / entry[1].count).toFixed(1);
        }) || [0],
        borderColor: "rgba(79, 70, 229, 1)",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const moodDistributionData = {
    labels: ["Happy", "Sad", "Anxious", "Grateful", "Excited", "Angry"],
    datasets: [
      {
        data: Object.values(seperateMoods),
        backgroundColor: [
          "#10B981",
          "#6366F1",
          "#F59E0B",
          "#94A3B8",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

  const activityImpactData = {
    labels: ["Exercise", "Meditation", "Social", "Reading", "Work"],
    datasets: [
      {
        label: "Mood Impact",
        data: [1.5, 2.0, 0.8, 1.2, -0.5],
        backgroundColor: "#6366F1",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name || "User"} ✨
            </h1>
            <p className="mt-1 text-gray-600">
              Your mental health journey at a glance.
            </p>
          </div>
          <button
            onClick={() => navigate("/moodJournal")}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold cursor-pointer hover:bg-indigo-700 transition-all shadow-lg"
          >
            <FiPlus /> New Entry
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Avg Mood",
              value: averageMood,
              icon: <FiTrendingUp />,
              color: "text-indigo-600",
              bg: "bg-indigo-100",
            },
            {
              label: "Entries",
              value: totalEntries,
              icon: <FiActivity />,
              color: "text-green-600",
              bg: "bg-green-100",
            },
            {
              label: "Top Mood",
              value: mostCommonMood[0],
              icon: <FiInfo />,
              color: "text-yellow-600",
              bg: "bg-yellow-100",
            },
            {
              label: "Streak",
              value: "5 Days",
              icon: <FiMoon />,
              color: "text-purple-600",
              bg: "bg-purple-100",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center"
            >
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} mr-4 text-xl`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- AI ANALYSIS MODAL --- */}
      <AnimatePresence>
        {isAISuggestionOpen && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setisAISuggestionOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200"><FiCpu size={24} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Emotional Intelligence Report</h3>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Powered by CalmNest Core</p>
                  </div>
                </div>
                <button onClick={() => setisAISuggestionOpen(false)} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-red-500 transition-colors"><FiX size={20} /></button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                    <h4 className="flex items-center gap-2 font-black text-emerald-700 uppercase text-xs tracking-widest mb-4"> <FiCheckCircle /> Primary Strength</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">Your "Stability Index" has improved by 14% this week. You are successfully managing stress during mid-week spikes.</p>
                  </div>
                  <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <h4 className="flex items-center gap-2 font-black text-amber-700 uppercase text-xs tracking-widest mb-4"> <FiZap /> Action Recommended</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">We noticed a slight dip in mood when entries are logged after 10 PM. Consider starting your 5-min meditation earlier.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Key Discoveries</h4>
                  {[
                    "Mindfulness sessions directly correlate with 'Grateful' mood states.",
                    "Exercise entries show a 1.5x increase in focus intensity.",
                    "Your emotional vocabulary has expanded by 3 new keywords this month."
                  ].map((note, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                      <p className="text-sm text-slate-700 font-bold">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                <button onClick={() => navigate("/MeditationAndExercise")} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">Start Suggested Session</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* AI Suggestion Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <FiCpu className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AI Wellness Insight</h3>
                <p className="text-indigo-100 opacity-90">
                  Based on your last entries, you feel most relaxed after{" "}
                  <b>Meditation</b>. Try a AI suggestion from calmnest!
                </p>
              </div>
            </div>
            <button
              className="mt-4 md:mt-0 bg-white cursor-pointer text-indigo-600 px-5 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
              onClick={() => setisAISuggestionOpen(true)}
            >
              View Analysis
            </button>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Mood Stability Trend
            </h3>
            <div className="h-72">
              <Line
                data={moodTrendData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Mood Distribution
            </h3>
            <div className="h-72 flex justify-center">
              <Doughnut
                data={moodDistributionData}
                options={{ cutout: "70%" }}
              />
            </div>
          </div>
        </div>

        {/* Expert Highlight Note */}
        <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-8 mb-8 text-center relative overflow-hidden group">
          <FiMoon className="absolute top-4 left-6 text-indigo-200 text-4xl transform -rotate-12 group-hover:scale-110 transition-transform" />
          <FiWind className="absolute bottom-4 right-6 text-green-200 text-4xl transform rotate-12 group-hover:scale-110 transition-transform" />

          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Feeling overwhelmed or stressed? 🌿
            </h3>
            <p className="text-gray-600 mb-6">
              Sometimes a conversation can change everything. Speak with our
              certified experts for a personalized one-to-one session.
            </p>
            <button
              className="flex items-center gap-2 mx-auto bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate("/LobbyPage")}
            >
              <FiMessageCircle /> Book a Priority Session
            </button>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickNavBtn
            onClick={() => navigate("/moodJournal")}
            icon={<FiPlus />}
            label="Add Journal"
            color="indigo"
            className="cursor-pointer"
          />
          <QuickNavBtn
            onClick={() => navigate("/MeditationAndExercise")}
            icon={<FiMoon />}
            label="Meditate"
            color="purple"
            className="cursor-pointer"
          />
          <QuickNavBtn
            onClick={() => navigate("/QuestionnaireLanding")}
            icon={<FiActivity />}
            className="cursor-pointer"
            label="Wellness Test"
            color="green"
          />
          <QuickNavBtn
            onClick={() => navigate("/MoodJournal")}
            icon={<FiTrendingUp />}
            label="History"
            color="yellow"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Button Component for Cleanliness
const QuickNavBtn = ({ onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-${color}-500 transition-all text-center group`}
  >
    <div
      className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="font-bold text-gray-700">{label}</span>
  </button>
);

export default MentalHealthDashboard;
