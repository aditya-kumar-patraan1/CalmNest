import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 z-50 px-10 py-4 flex items-center transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <span
          className={`text-2xl font-extrabold tracking-wide pl-16 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          HAPPIER
        </span>
      </div>

      {/* Menu */}
      <ul
        className={`flex-1 flex justify-center space-x-6 text-sm font-medium ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        <li className="cursor-pointer hover:underline">Courses</li>
        <li className="cursor-pointer hover:underline">Meditations</li>
        <li className="cursor-pointer hover:underline">Happier Weekly</li>
        <li className="cursor-pointer hover:underline">Our Story</li>
      </ul>

      {/* Button */}
      <button
        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
          scrolled
            ? "bg-black text-white border-black hover:bg-white hover:text-black"
            : "bg-[#1E1E1C] text-white border-transparent hover:bg-white hover:text-black"
        }`}
      >
        Try free
      </button>
    </nav>
  );
}
