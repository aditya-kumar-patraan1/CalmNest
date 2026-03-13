import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Toaster, toast } from "react-hot-toast";
import { User, Mail, MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import animationData from "../assets/animation/ani.json";
import axios from "axios";

const Contact = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.email || !data.name || !data.message) {
      return toast.error("Please fill out all fields.");
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/feedback/addFeedback`, data);
      if (res.data.success) {
        toast.success("Message sent! We'll get back to you soon.");
        setData({ name: "", email: "", message: "" });
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen w-full py-20 px-6 overflow-hidden bg-[#FDFEFF]">
      
      {/* Decorative Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 right-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-10 left-[-10%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left: Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold tracking-wide uppercase mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              We're here to <br />
              <span className="text-emerald-600 italic font-serif">listen.</span>
            </h2>
            
            <p className="text-lg text-slate-500 mb-10 max-w-md leading-relaxed">
              Have questions about your journey or just want to say hello? 
              Drop us a message and our team will reach out to you.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Your Full Name"
                  value={data.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              {/* Message Input */}
              <div className="relative group">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="How can we help you?"
                  value={data.message}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-emerald-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right: Lottie Animation Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-[500px] h-auto p-8 rounded-[3rem] bg-emerald-50/50 border border-emerald-100/50 shadow-inner">
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-full drop-shadow-2xl"
              />
              
              {/* Floating Card inside Lottie area */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="text-emerald-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email us</p>
                    <p className="text-sm font-bold text-slate-700">support@calmnest.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      <Toaster position="top-right" />
    </section>
  );
};

export default Contact;