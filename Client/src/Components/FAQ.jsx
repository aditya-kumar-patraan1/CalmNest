import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, MessageCircle, Sparkles, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is CalmNest and how did it get started?",
    answer: "CalmNest is a sanctuary for mental wellness, founded by a collective of mindfulness experts and psychologists. Our journey began with a simple mission: to make mental peace accessible in a fast-paced digital world."
  },
  {
    question: "What’s included in my membership?",
    answer: "Your membership unlocks our full library of 500+ guided meditations, personalized mood analytics, 1:1 expert sessions, and exclusive access to our 'Deep Sleep' soundscapes collection."
  },
  {
    question: "How is CalmNest priced?",
    answer: "We believe in flexible peace. We offer Monthly ($9.99), Yearly ($69.99), and a one-time Lifetime access option. Every plan starts with a 7-day free trial."
  },
  {
    question: "What types of practices does CalmNest offer?",
    answer: "From 5-minute 'Quick Breathers' to intensive 8-week mindfulness courses, we cover breathing techniques, body scans, mindful movement, and cognitive behavioral tools."
  },
  {
    question: "Who are the teachers behind CalmNest?",
    answer: "We collaborate with world-renowned practitioners like Zen masters, licensed therapists, and neuroscientists to ensure every session is both calming and effective."
  },
  {
    question: "Can beginners use CalmNest?",
    answer: "Absolutely. We have a dedicated 'Basics of Zen' series specifically designed to help beginners build a consistent habit without feeling overwhelmed."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqContainerRef = useRef(null);
  const answerRefs = useRef([]);

  // Initial Entrance Animation

  const toggleFAQ = (index) => {
    const isOpen = index === openIndex;
    setOpenIndex(isOpen ? null : index);

    faqs.forEach((_, i) => {
      if (answerRefs.current[i]) {
        if (i === index && !isOpen) {
          // Open animation
          gsap.to(answerRefs.current[i], {
            height: "auto",
            duration: 0.6,
            ease: "elastic.out(1, 0.8)",
            opacity: 1,
            marginTop: 12
          });
        } else {
          // Close animation
          gsap.to(answerRefs.current[i], {
            height: 0,
            duration: 0.3,
            ease: "power2.inOut",
            opacity: 0,
            marginTop: 0
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFA] py-20 px-6 relative overflow-hidden selection:bg-emerald-100">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-blue-50/50 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* --- Left Column: Header --- */}
          <div className="lg:w-1/3 faq-header">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles size={14} /> <span>Support Center</span>
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] mb-8">
              Everything you <br /> 
              <span className="text-emerald-600 font-serif italic">need to know.</span>
            </h2>
            
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              Can't find the answer you're looking for? Our soul-support team is always ready to help you center yourself.
            </p>

            <button className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-100 active:scale-95">
              <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
              Chat with an Expert
            </button>
          </div>

          {/* --- Right Column: Accordion --- */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item group border rounded-[2rem] transition-all duration-300 ${
                  openIndex === index 
                  ? "bg-white border-emerald-200 shadow-xl shadow-emerald-50/50" 
                  : "bg-transparent border-slate-100 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex items-center justify-between p-6 md:p-8 focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold transition-colors ${
                    openIndex === index ? "text-emerald-700" : "text-slate-800"
                  }`}>
                    {faq.question}
                  </span>
                  
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    openIndex === index ? "bg-emerald-600 text-white rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                <div
                  ref={(el) => (answerRefs.current[index] = el)}
                  style={{ height: 0, overflow: "hidden", opacity: 0 }}
                  className="px-8"
                >
                  <div className="pb-8 text-slate-500 text-lg leading-relaxed border-t border-slate-50 pt-6">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Help Card */}
            <div className="mt-12 p-8 rounded-[2.5rem] bg-emerald-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Still have questions?</h4>
                <p className="text-emerald-100/70">Our dedicated support is available 24/7.</p>
              </div>
              <button className="relative z-10 bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                Contact Us
              </button>
              <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;