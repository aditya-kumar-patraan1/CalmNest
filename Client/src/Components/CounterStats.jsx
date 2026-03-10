import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const CounterStats = ({ value, label, suffix, index }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    // Number animation logic
    gsap.to(countRef.current, {
      val: value,
      duration: 2.5,
      delay: 0.8 + index * 0.2, // Staggered start
      ease: "power4.out",
      onUpdate: () => {
        setDisplayValue(Math.floor(countRef.current.val));
      },
    });
  }, [value, index]);

  return (
    <div className="flex flex-col items-center sm:items-start group">
      <div className="text-3xl font-bold text-slate-900 tabular-nums transition-transform group-hover:scale-110 duration-300">
        {displayValue}
        <span className="text-emerald-600">{suffix}</span>
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">
        {label}
      </div>
    </div>
  );
};

export default CounterStats;