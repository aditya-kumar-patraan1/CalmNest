import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../Context/AppContext";

const Login = () => {
  const { BACKEND_URL, setisLoggedIn, getUserData } = useAppContext();
  const Navigate = useNavigate();

  const [formData, setFormdata] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/login`, formData, { 
        withCredentials: true 
      });

      if (res.data.status === 0) {
        setisLoggedIn(false);
        setFormdata({ email: "", password: "" });
        Navigate("/RegisterPage");
      } else {
        toast.success("User Logged in successfully !");
        setisLoggedIn(true);
        getUserData();
        Navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" />

      {/* --- Left Side: Branding & Visual (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-emerald-900 overflow-hidden">
        {/* Animated Background Decoration */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=80" 
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
            alt="Nature Calm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-900/50" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <Leaf className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CalmNest</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Reclaim your <br />
              <span className="text-emerald-400 italic">inner peace.</span>
            </h2>
            <p className="text-emerald-100/80 text-lg max-w-md leading-relaxed">
              Log in to access your personalized mindfulness journey, track your moods, and connect with experts.
            </p>
          </motion.div>

          <div className="flex items-center gap-4 text-emerald-200/60 text-sm">
            <span>© 2026 CalmNest Inc.</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
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
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                {/* <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Forgot?
                </button> */}
              </div>
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

            {/* Remember Me & Policy */}
            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="remember" className="text-sm text-slate-500 font-medium select-none">Remember me for 30 days</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:translate-y-0"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins (Optional but improves UI) */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-400 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-600">
               <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="google" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors font-semibold text-slate-600">
               <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="linkedin" /> LinkedIn
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => Navigate("/RegisterPage")}
              className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors underline-offset-4 hover:underline"
            >
              Sign up for free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;