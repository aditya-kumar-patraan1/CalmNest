import React, { useEffect, useRef, useState } from "react";
import { Leaf, Menu, X, Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";
import CounterStats from "./CounterStats";
import { useNavigate } from "react-router-dom";

export default function HeaderPage() {
  const [open, setOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigate = useNavigate();
  
  const headRef = useRef(null);
  const imageRef = useRef(null);

  const stats = [
    { value: 15, label: "Expert Guides", suffix: "+" },
    { value: 200, label: "Sessions", suffix: "+" },
    { value: 98, label: "Peace Found", suffix: "%" },
  ];

  const AllTexts = [
    "Calm breath. Quiet mind.",
    "Release tension. Embrace peace.",
    "Observe thoughts. Discover silence.",
    "Seek balance. Welcome harmony.",
    "Breathe deeply. Live mindfully.",
  ];

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/FAQ", label: "About" },
    { href: "/MeditationAndExercise", label: "Exercise" },
    { href: "/Dashboard", label: "Dashboard" },
    { href: "/MoodJournal", label: "Mood Journal" },
    { href: "/Contact", label: "Contact" }
  ];

  // Logic: Quotes cycle hona har 4 seconds mein
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % AllTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // GSAP: Page load animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Header entrance
      tl.from(".nav-item", {
        y: -30,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
      })
      // Hero content sliding up
      .from(".hero-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
      }, "-=0.6")
      // Image scale in
      .from(imageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
      }, "-=1");

      // Floating effect for image (Continuous)
      gsap.to(imageRef.current, {
        y: 15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-900 selection:bg-emerald-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <div className="nav-item flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              CalmNest
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.label} className="nav-item">
                  <a href={item.href} className="text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 nav-item">
              <button onClick={() => navigate("/RegisterPage")} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-all">
                Login
              </button>
              <button onClick={() => window.open("/LobbyPage", "_blank")} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-emerald-700 hover:scale-105 active:scale-95">
                Join Session
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} className="p-2 md:hidden text-slate-600">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 pt-12 pb-24 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          
          <div className="hero-content space-y-8" ref={headRef}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-600/10 shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Personalized Mental Wellness</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
              Your Safe Space <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic font-serif">for Mindfulness.</span>
            </h1>

            <div className="h-10">
              <p className="text-xl font-medium text-slate-600 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                {AllTexts[currentTextIndex]}
              </p>
            </div>

            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Experience the power of guided meditation and real-time support. We help you navigate daily stress with scientifically backed tools.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-white font-bold shadow-xl shadow-emerald-100 transition-all hover:bg-emerald-700 hover:translate-y-[-2px]">
                Start Free Journey
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-8 py-4 font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300">
                Explore Exercises
              </button>
            </div>

            {/* Stats - Staggered animations logic yahan hai */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100">
              {stats.map((stat, index) => (
                <CounterStats
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative" ref={imageRef}>
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-slate-200">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
                alt="Mindfulness Meditation"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>
            
            {/* Decorative Blurs */}
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
          </div>

        </div>
      </main>
    </div>
  );
}