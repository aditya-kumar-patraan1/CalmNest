import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import Photo1 from "../assets/BookReadingImage.png";
import blogtop2 from "../assets/blogtop2.png";
import blogtop3 from "../assets/blogtop3.png";
import blogtop4 from "../assets/blogtop4.jpeg";
import god_meditation from "../assets/god_meditation.png";
import mountain from "../assets/mountain.png";
import relaxation from "../assets/relaxation.png";
import Peace from "../assets/Peace.png";
import yoga from "../assets/yoga.png";
import stress from "../assets/stress.png";
import attentive from "../assets/attentive.png";
import sleep from "../assets/sleep.png";
import girl_meditation from "../assets/girl_meditation.png";
import leafGirl from "../assets/leafGirl.png";
import happyBalls from "../assets/happyBalls.png";
import meditationFlower from "../assets/meditationFlower.png";
import flower from "../assets/flower.png";
import blessing from "../assets/blessing.png";

const imageColumns = [
  [
    { src: meditationFlower },
    { src: girl_meditation },
    { src: happyBalls },
    { src: flower },
    { src: mountain },
    { src: blessing },
  ],
  [
    { src: Photo1 },
    { src: blogtop2 },
    { src: leafGirl },
    { src: god_meditation },
    { src: relaxation },
    { src: blogtop4 },
  ],
  [
    { src: blogtop3 },
    { src: Peace },
    { src: yoga },
    { src: attentive },
    { src: stress },
    { src: sleep },
  ],
];

const squareSize = 175;

export default function Component() {
  const navigate = useNavigate();
  const headRef = useRef(null);
  const [isAnimate, setisAnimate] = useState(false);

  useEffect(() => {
    if (isAnimate) {
      gsap.fromTo(
        headRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );
    }
  }, [isAnimate]);

  useEffect(() => {
    setisAnimate(true);
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center bg-gradient-to-br bg-[#F8FAFC] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-200 blur-[120px] opacity-40 rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px] bg-blue-200 blur-[120px] opacity-40 rounded-full bottom-[-100px] right-[-100px]" />

      <div className="w-screen h-full px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 h-full items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-6">

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
                  Understand Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Mind Better
                </span>
              </h1>

              <p
                className="text-lg text-gray-600 leading-relaxed max-w-lg"
                ref={headRef}
              >
                Take a quick mental health assessment to discover insights
                about your emotional well-being and get personalized
                recommendations for a healthier and calmer mind.
              </p>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-black text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/QuestionnaireLanding")}
              >
                Start Your Assessment
                <span className="group-hover:translate-x-1 transition">
                  →
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* IMAGE COLUMN */}
          <div className="relative h-full overflow-hidden">
            <div className="flex gap-4 h-full">

              {imageColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex-1 relative overflow-hidden">

                  <motion.div
                    className="flex flex-col gap-4"
                    animate={{ y: [0, -2000] }}
                    transition={{
                      duration: 22 + columnIndex * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {[...column, ...column, ...column].map((img, i) => (
                      <motion.div
                        whileHover={{ scale: 1.07 }}
                        key={i}
                        className="rounded-2xl overflow-hidden shadow-xl bg-white"
                        style={{
                          height: `${squareSize}px`,
                          width: `${squareSize}px`,
                        }}
                      >
                        <img
                          src={img.src}
                          alt="mindfulness"
                          className="object-cover w-full h-full"
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}