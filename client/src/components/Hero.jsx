import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, Search, User } from "lucide-react";
import landing_img from "../assets/landing_img.png";
import hero_img from "../assets/hero_img.png";
import { containerVariants, itemVariants } from "./Variants";

export default function Hero({ setShowNavbar }) {
  // TRUE  -> skip intro
  // FALSE -> show intro
  const [showHero, setShowHero] = useState(() => {
    return sessionStorage.getItem("introShown") === "true";
  });

  useEffect(() => {
    // IF INTRO ALREADY SHOWN
    if (showHero) {
      setShowNavbar(true);
      return;
    }

    // FIRST VISIT

    const timer = setTimeout(() => {
      setShowHero(true);
      setShowNavbar(true);

      sessionStorage.setItem("introShown", "true");
    }, 5000);

    return () => clearTimeout(timer);
  }, [showHero, setShowNavbar]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* INTRO SCREEN */}

      <AnimatePresence mode="wait">
        {!showHero && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.05,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="absolute inset-0 z-50"
          >
            {/* Landing Image */}
            <img
              src={landing_img}
              alt="Landing"
              className="h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Center Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.4,
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <h1 className="font-serif text-5xl md:text-7xl tracking-[0.35em] text-[#220328]">
                CARRYON
              </h1>

              <p className="mt-5 text-sm md:text-lg tracking-[0.5em] text-[#220328]/80">
                LUXURY REDEFINED
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}

      <AnimatePresence>
        {showHero && (
          <motion.section
            key="hero"
            initial={{
              y: sessionStorage.getItem("introShown") ? 0 : "100%",
            }}
            animate={{
              y: 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.6, 0.05, 0.01, 0.9],
            }}
            className="absolute inset-0"
          >
            {/* Hero Image */}
            <img
              src={hero_img}
              alt="Hero"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center text-[#220328]"
            >
              <motion.h1
                variants={itemVariants}
                className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Made for the Journey Ahead
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-2xl text-lg leading-8 text-[#220328] md:text-xl"
              >
                From city streets to weekend escapes, CarryOn bags are built to
                move with you effortlessly.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-6"
              >
                <button className="rounded-md bg-secondary/35 px-8 py-3 text-sm font-medium text-black transition hover:bg-secondary/15">
                  SHOP NOW
                </button>

                <button className="rounded-md border border-secondary px-8 py-3 text-sm font-medium text-secondary transition hover:bg-white/10">
                  VIEW
                </button>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
