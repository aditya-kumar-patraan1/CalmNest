import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../Context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { setisLoggedIn, BACKEND_URL } = useAppContext();
  
  const [formData, setFormdata] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      return toast.error("Please fill all details.");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/register`, formData);
      if (res.data.status === 1) {
        toast.success("Welcome to the family! Redirecting...");
        setTimeout(() => navigate("/LoginPage"), 2000);
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />

      {/* --- Left Side: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-slate-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <div className="lg:hidden flex items-center gap-2 mb-8 text-emerald-700">
               <Leaf className="w-8 h-8" />
               <span className="text-xl font-bold">CalmNest</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium">Join us on your journey to mindfulness.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="hello@calmnest.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/LoginPage")}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>

      {/* --- Right Side: Branding (Visible on Desktop) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1500&q=80" 
            className="h-full w-full object-cover opacity-30 mix-blend-overlay"
            alt="Mindfulness Workspace"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-slate-900/90 to-slate-900" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CalmNest</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} /> Start Your Journey
            </div>
            <h2 className="text-5xl font-bold text-white leading-tight">
              Design a better <br />
              <span className="text-emerald-400 italic">version of you.</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed">
              "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity."
            </p>
          </motion.div>

          <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;