import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Save,
  Smile,
  Moon,
  Zap,
  Heart,
  Sparkles,
  Clock,
  Trash2,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";

const moodMapping = {
  happy: {
    label: "Happy",
    emoji: "😊",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  sad: {
    label: "Sad",
    emoji: "😔",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  angry: {
    label: "Angry",
    emoji: "😡",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  anxious: {
    label: "Anxious",
    emoji: "😰",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  excited: {
    label: "Excited",
    emoji: "🤩",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  grateful: {
    label: "Grateful",
    emoji: "🙏",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

export default function MoodJournal() {
  const { userData, BACKEND_URL, savedEntries, setSavedEntries,getSavedEntries } =
    useAppContext();

  // Form States
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteEntry = async (deletedItemId) => {
    try {
      console.log(deletedItemId);
      const res = await axios.delete(
        `${BACKEND_URL}/api/v3/deleteMoodEntry/${deletedItemId}`,
        {
          withCredentials: true,
        },
      );

      if (res.data.status == 1) {
        toast.success(`Entry deleted..`);
        setSavedEntries(savedEntries.filter((entry) => entry._id !== deletedItemId));
        getSavedEntries();
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error(`Entry not deleted`);
    }
  };

  const handleSaveEntry = async () => {
    if (!selectedMood || !journalEntry.trim()) {
      toast.error("Please select a mood and write your Daily Pour.");
      return;
    }

    setIsLoading(true);
    const data = {
      mood: selectedMood,
      intensity_level: moodIntensity,
      sleepQuality,
      sleepHours,
      stress_level: stressLevel,
      energy_level: energyLevel,
      dailyPour: journalEntry,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v3/addMoodJournal`,
        data,
        { withCredentials: true },
      );
      if (res.data.status === 1) {
        toast.success("Reflection locked in your vault.");
        setSavedEntries([data, ...savedEntries]);
        getSavedEntries();
        resetForm();
      }
    } catch (e) {
      toast.error("Failed to connect to the vault.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMood("");
    setJournalEntry("");
    setMoodIntensity(5);
    setSleepQuality(3);
    setSleepHours(7);
    setStressLevel(5);
    setEnergyLevel(5);
  };

  return (
    <div className="min-h-screen  bg-[#F8FAFC] pb-20">
      <Toaster position="top-center" />

      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              Mood Journal
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Capture the colors of your mind.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl text-slate-600 font-bold text-sm shadow-sm">
            <Calendar size={18} className="text-indigo-500" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- LEFT FORM (7 Cols) --- */}
        <div className="lg:col-span-7 space-y-8">
          {/* Mood Selector */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Smile className="text-amber-500" /> Current State
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(moodMapping).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMood(key)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                    selectedMood === key
                      ? `${value.bg} ${value.border} scale-105 shadow-md`
                      : "bg-slate-50 border-transparent text-slate-400"
                  }`}
                >
                  <span className="text-3xl mb-1">{value.emoji}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {value.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8"
              >
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Intensity: {moodIntensity}/10
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodIntensity}
                  onChange={(e) => setMoodIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </motion.div>
            )}
          </motion.section>

          {/* Life Metrics (Sleep, Stress, Energy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Moon size={18} className="text-indigo-500" /> Sleep Tracking
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-2">
                    Quality: {sleepQuality}/5
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSleepQuality(star)}
                        className={`text-2xl transition-transform active:scale-90 ${sleepQuality >= star ? "grayscale-0" : "grayscale"}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase mb-1">
                    Hours: {sleepHours}h
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" /> Vitality
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1">
                    <span>Stress</span> <span>{stressLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full accent-red-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1">
                    <span>Energy</span> <span>{energyLevel}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: JOURNEY LIST (5 Cols) --- */}
        <div className="lg:col-span-5 h-full  space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
              Journey Timeline
            </h2>
            <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
              {savedEntries?.length || 0} Entries
            </span>
          </div>

          <div className="h-[calc(100vh-212px)] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            <AnimatePresence mode="popLayout">
              {savedEntries?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200"
                >
                  <MessageCircle
                    className="text-slate-300 mx-auto mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 font-medium text-sm px-10">
                    Your timeline is waiting for its first memory.
                  </p>
                </motion.div>
              ) : (
                savedEntries?.map((entry, idx) => {
                  const mood = moodMapping[entry.mood] || moodMapping.grateful;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      layout
                      className={`relative bg-white p-6 rounded-[2rem] border-l-8 ${mood.border} shadow-sm group hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{mood.emoji}</span>
                          <div>
                            <h4 className={`font-bold text-sm ${mood.color}`}>
                              {mood.label}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <Clock size={10} />{" "}
                              {new Date(entry.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-300 uppercase">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 italic line-clamp-3">
                        "{entry.dailyPour}"
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Moon size={12} className="text-indigo-400" />{" "}
                            {entry.sleepQuality}/5
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Zap size={12} className="text-amber-400" />{" "}
                            {entry.energy_level}/10
                          </div>
                        </div>
                        <Trash2
                          onClick={() => handleDeleteEntry(entry._id)}
                          size={14}
                          className="text-slate-200 hover:text-red-400 cursor-pointer transition-colors"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4">
        {/* Text Area */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">The Daily Pour</h2>
            <Sparkles className="text-indigo-300" />
          </div>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="What's flowing through your mind?"
            className="w-full h-44 p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-2 focus:ring-indigo-100 text-slate-700 text-lg leading-relaxed resize-none"
          />
        </motion.section>

        <button
          onClick={handleSaveEntry}
          disabled={isLoading}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300"
        >
          {isLoading ? (
            <span className="animate-pulse">Archiving...</span>
          ) : (
            <>
              <Save size={20} /> Complete Reflection
            </>
          )}
        </button>
      </div>

      {/* --- Custom Scrollbar CSS --- */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
