import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Send, Maximize2, X, Volume2, Copy, Leaf, 
  Clock, Video, Brain, Wind, MessageSquare 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";
import main from "./gemini.js";

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [actualList, isBotTyping]);

  const formatMsgTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to Sanctuary");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleSpeak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const onSend = async () => {
    if (!data.trim()) return;
    const userMsg = data;
    const msgTime = Date.now();
    setData("");
    
    setactualList(prev => [...prev, { user: userMsg, bot: null, date: msgTime }]);
    setIsBotTyping(true);

    try {
      const botResponse = await main(userMsg);
      setTimeout(() => {
        setactualList(prev => {
          const newList = [...prev];
          newList[newList.length - 1].bot = botResponse;
          return newList;
        });
        setIsBotTyping(false);
      }, 1000);
    } catch (e) {
      setIsBotTyping(false);
      toast.error("Gemini unreachable");
    }
  };

  // --- Quick Action Component ---
  const QuickActions = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-2 mb-2"
    >
      <button 
        onClick={() => navigate("/ChatDesktop")}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold hover:bg-indigo-100 transition-all shadow-sm"
      >
        <Video size={12} /> Talk to Expert
      </button>
      <button 
        onClick={() => navigate("/WellnessCheck")}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold hover:bg-amber-100 transition-all shadow-sm"
      >
        <Brain size={12} /> Mind Audit
      </button>
      <button 
        onClick={() => navigate("/MeditationAndExercise")}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold hover:bg-emerald-100 transition-all shadow-sm"
      >
        <Wind size={12} /> Quick Zen
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-[350px] md:w-[380px] h-[520px] z-50 flex flex-col rounded-[2.2rem] shadow-2xl border border-slate-200 bg-white/95 backdrop-blur-xl overflow-hidden"
    >
      <Toaster position="top-center" />

      {/* Header */}
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
            window.speechSynthesis.cancel();
            setisChatOpen(false);
          }} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/40 hide-scrollbar">
        {actualList.map((item, index) => (
          <div key={index} className="space-y-1.5">
            <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-end">
              <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-none bg-indigo-600 text-white shadow-sm">
                <p className="text-xs font-medium leading-relaxed">{item.user}</p>
              </div>
              <span className="text-[9px] text-slate-400 font-bold mt-1 mr-1 uppercase">{formatMsgTime(item.date)}</span>
            </motion.div>

            {item.bot && (
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-start">
                <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tl-none bg-white border border-slate-100 text-slate-700 shadow-sm relative group">
                  <p className="text-xs leading-relaxed">{item.bot}</p>
                  <div className="mt-3 pt-2 border-t border-slate-50 flex gap-4">
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

      {/* Footer Area with Quick Suggestions */}
      <div className="p-4 bg-white border-t border-slate-100">
        
        {/* Render Buttons only if bot is not typing and there is conversation */}
        {!isBotTyping && actualList.length > 0 && <QuickActions />}

        <div className="relative flex items-center">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSend()}
            placeholder="Search for peace..."
            className="w-full pl-5 pr-12 py-3.5 bg-slate-100 border-none rounded-[1.5rem] text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none text-slate-700"
          />
          <button
            onClick={onSend}
            disabled={!data.trim()}
            className="absolute right-1.5 p-2 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:bg-slate-200"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;