import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  Smile, 
  Moon, 
  Zap, 
  Activity, 
  Heart,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";

// --- API Configuration (Keeping your existing logic) ---
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getJournals = async (userId) => {
  const res = await api.get("/api/journal/getJournals", { params: { userId } });
  return res.data;
};

const addJournal = async (data) => {
  const res = await api.post("/api/journal/addJournal", data);
  return res.data;
};

// --- Helpers ---
const moodMapping = {
  happy: { label: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  sad: { label: "Sad", emoji: "😔", color: "bg-blue-100 text-blue-700 border-blue-200" },
  angry: { label: "Angry", emoji: "😡", color: "bg-red-100 text-red-700 border-red-200" },
  anxious: { label: "Anxious", emoji: "😰", color: "bg-purple-100 text-purple-700 border-purple-200" },
  excited: { label: "Excited", emoji: "🤩", color: "bg-orange-100 text-orange-700 border-orange-200" },
  grateful: { label: "Grateful", emoji: "🙏", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export default function MoodJournal() {
  const { userData, isLoggedIn, getAuthState } = useAppContext();
  const [selectedMood, setSelectedMood] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [stressLevel, setStressLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [activities, setActivities] = useState([]);
  const [gratitudeList, setGratitudeList] = useState(["", "", ""]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    type: 'exercise', duration: 30, moodBefore: 5, moodAfter: 5, description: ''
  });

  useEffect(() => {
    if (isLoggedIn) fetchSavedEntries();
  }, [isLoggedIn]);

  const fetchSavedEntries = async () => {
    try {
      const userId = userData?._id || localStorage.getItem("userId");
      if (!userId) return;
      const resp = await getJournals(userId);
      if (resp.status === 1 && Array.isArray(resp.journals)) {
        setSavedEntries(resp.journals.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) {
      toast.error("Failed to sync journals");
    }
  };

  const handleSaveEntry = async () => {
    if (!selectedMood || !journalEntry.trim()) {
      toast.error("Tell us how you feel today!");
      return;
    }
    setIsLoading(true);
    try {
      const userId = userData?._id || localStorage.getItem("userId");
      const payload = {
        mood: selectedMood,
        description: journalEntry,
        intensity: moodIntensity,
        userId,
        sleepQuality, sleepHours, stressLevel, energyLevel,
        activities,
        gratitude: gratitudeList.filter(g => g.trim() !== "")
      };
      const resp = await addJournal(payload);
      if (resp.status === 1) {
        toast.success("Reflection saved to your journal.");
        resetForm();
        fetchSavedEntries();
      }
    } catch (err) {
      toast.error("Connection lost. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMood(""); setJournalEntry(""); setActivities([]);
    setGratitudeList(["", "", ""]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-right" />
      
      {/* --- Header Area --- */}
      <header className="bg-white border-b border-slate-200 pt-10 pb-6 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="text-indigo-600" /> Mood Journal
            </h1>
            <p className="text-slate-500 mt-1">Reflect, release, and grow through your thoughts.</p>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-700 font-semibold text-sm">
            <Calendar size={18} />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: Entry Form (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Mood Selection Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Smile className="text-amber-500" /> How's your heart today?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(moodMapping).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedMood(key)}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-300 border-2 ${
                    selectedMood === key 
                    ? `${value.color} border-current scale-105 shadow-md` 
                    : "bg-slate-50 border-transparent hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  <span className="text-3xl mb-2">{value.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{value.label}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <motion.div initial={{ opacity: 0, h: 0 }} animate={{ opacity: 1, h: "auto" }} className="mt-8">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Intensity Level</label>
                  <span className="text-indigo-600 font-bold">{moodIntensity}/10</span>
                </div>
                <input
                  type="range" min="1" max="10" value={moodIntensity}
                  onChange={(e) => setMoodIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </motion.div>
            )}
          </motion.section>

          {/* Journal Input */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-slate-800">The Daily Pour</h2>
               <Sparkles className="text-indigo-300" size={20} />
            </div>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="What's on your mind? Don't hold back..."
              className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-indigo-100 text-slate-700 text-lg leading-relaxed placeholder:text-slate-400"
            />
          </motion.section>

          {/* Life Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Moon size={18} className="text-indigo-500" /> Sleep Tracking</h3>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Quality: {sleepQuality}/5</p>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setSleepQuality(star)} className={`text-2xl transition-transform active:scale-90 ${sleepQuality >= star ? "grayscale-0" : "grayscale"}`}>⭐</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-2">Hours Rested: {sleepHours}h</p>
                    <input type="range" min="0" max="12" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> Vitality Levels</h3>
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1"><span>Stress</span> <span>{stressLevel}/10</span></div>
                    <input type="range" min="1" max="10" value={stressLevel} onChange={(e) => setStressLevel(Number(e.target.value))} className="w-full accent-red-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1"><span>Energy</span> <span>{energyLevel}/10</span></div>
                    <input type="range" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(Number(e.target.value))} className="w-full accent-emerald-400" />
                  </div>
               </div>
            </div>
          </div>

          <button
            onClick={handleSaveEntry}
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {isLoading ? "Saving to vault..." : <><Save size={20} /> Complete Entry</>}
          </button>
        </div>

        {/* --- RIGHT: History & Gratitude (4 Cols) --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Gratitude Widget */}
          <section className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-lg shadow-indigo-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Heart fill="white" size={20} /> Gratitude List
            </h2>
            <div className="space-y-3">
              {gratitudeList.map((item, idx) => (
                <div key={idx} className="relative">
                  <input
                    type="text" value={item}
                    onChange={(e) => {
                      const newList = [...gratitudeList];
                      newList[idx] = e.target.value;
                      setGratitudeList(newList);
                    }}
                    placeholder={`I'm grateful for...`}
                    className="w-full bg-white/10 border-none rounded-2xl py-3 px-4 text-sm placeholder:text-white/40 focus:bg-white/20 outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Timeline History */}
          <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Your Journey</h2>
              <Clock size={18} className="text-slate-400" />
            </div>
            
            <div className="p-4 h-[600px] overflow-y-auto custom-scrollbar">
              {savedEntries.length === 0 ? (
                <div className="text-center py-20 px-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <BookOpen size={30} />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">Your story starts with the first word.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {savedEntries.map((day, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white shadow-sm" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      {day.entries?.map((entry, eIdx) => (
                        <motion.div 
                          key={eIdx}
                          whileHover={{ x: 5 }}
                          className="bg-slate-50 p-4 rounded-2xl mb-3 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">{moodMapping[entry.mood]?.emoji || "😶"}</span>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {entry.moodDescription}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* --- Floating Bottom Nav Style CSS --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        input[type=range] { -webkit-appearance: none; background: #F1F5F9; border-radius: 10px; height: 6px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #4F46E5; cursor: pointer; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      `}} />
    </div>
  );
}