import React from "react";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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

  const avgForEachDay = savedEntries?.reduce((acc,entry)=>{
    
    const myDate = new Date(entry.createdAt).toISOString().split('T')[0];

    if(!acc[myDate]){
      acc[myDate] = {sum:0,count:0};
    }

    acc[myDate].sum += entry.intensity_level;
    acc[myDate].count++;
    
    return acc;
  },{});

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
        data: Object.entries(avgForEachDay).map((entry)=>{ return (entry[1].sum/entry[1].count).toFixed(1)}) || [0],
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
            className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg"
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
            <button className="mt-4 md:mt-0 bg-white text-indigo-600 px-5 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all">
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
              className="flex items-center gap-2 mx-auto bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-600 transition-all shadow-lg transform hover:-translate-y-1"
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
          />
          <QuickNavBtn
            onClick={() => navigate("/MeditationAndExercise")}
            icon={<FiMoon />}
            label="Meditate"
            color="purple"
          />
          <QuickNavBtn
            onClick={() => navigate("/QuestionnaireLanding")}
            icon={<FiActivity />}
            label="Wellness Test"
            color="green"
          />
          <QuickNavBtn
            onClick={() => navigate("/MoodJournal")}
            icon={<FiTrendingUp />}
            label="History"
            color="yellow"
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
