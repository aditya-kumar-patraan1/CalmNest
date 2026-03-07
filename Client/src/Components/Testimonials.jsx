import React, { useState, useRef, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MoveHorizontal } from 'lucide-react';

const FeedbackSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const sliderRef = useRef(null);

    const feedbacks = [
        { id: 1, message: "CalmNest has truly changed my mornings. The guided meditations help me start each day with calm and clarity.", name: "John Doe", rating: 3 },
        { id: 2, message: "I love the combination of mindfulness and reflection. The journaling section especially helps me track my growth.", name: "Ivy Clark", rating: 4 },
        { id: 3, message: "CalmNest has helped me create a small daily ritual that keeps me grounded no matter how hectic life gets.", name: "Hank Martin", rating: 4 },
        { id: 4, message: "The breathing exercises taught here have reduced my stress levels significantly. I feel more balanced every day.", name: "Alice Johnson", rating: 3 },
        // ... add others as needed
    ];

    const infiniteFeedbacks = [...feedbacks, ...feedbacks, ...feedbacks];
    const itemWidth = 380; // Adjusted for better spacing

    useEffect(() => {
        setCurrentIndex(feedbacks.length);
    }, [feedbacks.length]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX((e.clientX || e.touches?.[0]?.clientX) - translateX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || e.touches?.[0]?.clientX;
        setTranslateX(currentX - startX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        const threshold = 100;
        if (translateX < -threshold) moveSlide(1);
        else if (translateX > threshold) moveSlide(-1);
        setTranslateX(0);
    };

    const moveSlide = (direction) => {
        setCurrentIndex((prev) => prev + direction);
    };

    // Smooth loop logic
    useEffect(() => {
        if (currentIndex >= feedbacks.length * 2) {
            setTimeout(() => {
                sliderRef.current.style.transition = 'none';
                setCurrentIndex(feedbacks.length);
            }, 300);
        }
        if (currentIndex < feedbacks.length) {
            setTimeout(() => {
                sliderRef.current.style.transition = 'none';
                setCurrentIndex(feedbacks.length * 2 - 1);
            }, 300);
        }
        sliderRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }, [currentIndex, feedbacks.length]);

    return (
        <div className="bg-[#FFFEFB] py-20 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto relative">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-slate-800 mb-4 italic">What Our Customers Say</h2>
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <MoveHorizontal size={18} className="animate-pulse" />
                        <p className="text-sm font-medium tracking-wide uppercase">Drag to explore</p>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative group">
                    <div
                        ref={sliderRef}
                        className="flex cursor-grab active:cursor-grabbing"
                        style={{
                            transform: `translateX(${-currentIndex * itemWidth + translateX}px)`,
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                    >
                        {infiniteFeedbacks.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 px-4 transition-all duration-500"
                                style={{ width: `${itemWidth}px` }}
                            >
                                <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 h-full flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    <div>
                                        <Quote className="text-emerald-100 fill-emerald-50 mb-4" size={40} />
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={`${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-lg italic">
                                            "{item.message}"
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-50">
                                        <img 
                                            src={`https://i.pravatar.cc/150?u=${item.name}`} 
                                            alt={item.name}
                                            className="w-12 h-12 rounded-full ring-2 ring-emerald-50 object-cover"
                                        />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <h4 className="font-bold text-slate-800">{item.name}</h4>
                                                <CheckCircle2 size={14} className="text-emerald-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">Verified Practitioner</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Controls */}
                    <button 
                        onClick={() => moveSlide(-1)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={() => moveSlide(1)}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSlider;