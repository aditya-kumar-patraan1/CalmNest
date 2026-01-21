import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { toast, Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

// Add this CSS to your global styles or a module for the "Breathing" background
// @keyframes breathe {
//   0%, 100% { transform: scale(1); opacity: 0.5; }
//   50% { transform: scale(1.1); opacity: 0.7; }
// }
// .animate-breathe { animation: breathe 8s ease-in-out infinite; }

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  function createNewRoom() {
    const myRoomid = uuidv4().substring(0, 8); 
    setRoom(myRoomid);
    toast.success("A new space has been prepared.");
  }

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !room) {
        toast.error("Please enter your name and room ID");
        return;
      }
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      navigate(`/MyScreen/${room}`, { state: { email } });
    },
    [navigate, email]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => socket.off("room:join", handleJoinRoom);
  }, [socket, handleJoinRoom]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-indigo-50 via-teal-50 to-purple-50">
      
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-breathe"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-breathe" style={{ animationDelay: '2s' }}></div>

      <Toaster position="top-center" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl p-8 sm:p-10">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light tracking-wide text-gray-800 mb-2">
              Breathe In
            </h1>
            <p className="text-gray-500 text-sm italic">Enter your sanctuary</p>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Username Field */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Your Name
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="How shall we call you?"
                className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-300 transition-all duration-300"
              />
            </div>

            {/* Room ID Field */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Space ID
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Enter room code"
                className="w-full px-5 py-4 bg-white/50 border border-gray-100 rounded-2xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-300 transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-4 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-medium rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Enter Sanctuary
            </button>

            {/* Create Room Option */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={createNewRoom}
                className="text-sm text-indigo-500 font-medium hover:text-indigo-700 transition-colors"
              >
                + Create a new private space
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer Note */}
        <p className="mt-8 text-center text-gray-400 text-xs tracking-widest uppercase">
          Peaceful Connections
        </p>
      </div>
    </div>
  );
};

export default LobbyScreen;