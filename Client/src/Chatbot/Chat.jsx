import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Maximize2, X, Volume2, Copy, Leaf, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";

// --- DUMMY PREVIEW DATA ---
const DUMMY_CHATS = [
  {
    user: "I'm feeling a bit overwhelmed today.",
    bot: "I hear you. Take a deep breath. 🌿 I'm here to help you find some calm. Would you like to try a short breathing exercise?",
    date: Date.now() - 120000,
  }
];

const Chat = ({ setisChatOpen }) => {
  const { userData, BACKEND_URL, getUserData } = useAppContext();
  const navigate = useNavigate();
  const [data, setData] = useState(""); 
  const [actualList, setactualList] = useState(DUMMY_CHATS); 
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [actualList, isBotTyping]);

  // --- Helper: Format Time ---
  const formatMsgTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- Helper: Copy to Clipboard ---
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to Sanctuary", {
        style: { borderRadius: '15px', background: '#334155', color: '#fff', fontSize: '12px' }
      });
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  // --- Helper: Text to Speech ---
  const handleSpeak = (text) => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for meditation vibe
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const onSend = async () => {
    if (!data.trim()) return;
    const userMsg = data;
    const msgTime = Date.now();
    setData("");
    
    setactualList(prev => [...prev, { user: userMsg, bot: null, date: msgTime }]);
    setIsBotTyping(true);

    // Mock response logic (Re-integrate Gemini here later)
    setTimeout(() => {
      setactualList(prev => {
        const newList = [...prev];
        newList[newList.length - 1].bot = "That sounds like a beautiful step toward mindfulness. I'm here to support your journey. 🧘‍♂️";
        return newList;
      });
      setIsBotTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-[350px] md:w-[380px] h-[520px] z-50 flex flex-col rounded-[2.2rem] shadow-2xl border border-slate-200 bg-white/95 backdrop-blur-xl overflow-hidden"
    >
      <Toaster position="top-center" />

      {/* --- Header --- */}
      <div className="p-5 flex items-center justify-between bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Leaf size={18} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Zen Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate("/ChatDesktop")} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
            <Maximize2 size={16} />
          </button>
          <button onClick={() => {
            window.speechSynthesis.cancel(); // Stop talking on close
            setisChatOpen(false);
          }} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* --- Chat Content --- */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/40 hide-scrollbar">
        {actualList.map((item, index) => (
          <div key={index} className="space-y-1.5">
            {/* User Message */}
            <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-end">
              <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-none bg-indigo-600 text-white shadow-sm">
                <p className="text-xs font-medium leading-relaxed">{item.user}</p>
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1 mr-1 uppercase">{formatMsgTime(item.date)}</span>
            </motion.div>

            {/* Bot Message */}
            {item.bot && (
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-start">
                <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-slate-700 shadow-sm relative group">
                  <p className="text-xs leading-relaxed">{item.bot}</p>
                  
                  {/* Hover Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-50 flex gap-4 transition-opacity">
                    <button onClick={() => handleSpeak(item.bot)} className="text-slate-400 hover:text-emerald-600 transition-colors">
                      <Volume2 size={13} />
                    </button>
                    <button onClick={() => handleCopy(item.bot)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-1 ml-1 uppercase">{formatMsgTime(item.date)}</span>
              </motion.div>
            )}
          </div>
        ))}
        
        {isBotTyping && (
          <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1 bg-white p-2 rounded-full shadow-sm border border-slate-100">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bot is reflecting...</span>
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="Tell me what's on your mind..."
            className="w-full pl-5 pr-12 py-3.5 bg-slate-100 border-none rounded-[1.5rem] text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700"
          />
          <button
            onClick={onSend}
            disabled={!data.trim()}
            className="absolute right-1.5 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:bg-slate-200"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[8px] text-center mt-2.5 text-slate-400 font-bold uppercase tracking-tighter">Secure & Mindful Conversation</p>
      </div>
    </motion.div>
  );
};

export default Chat;