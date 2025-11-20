"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Card({ 
  children, 
  className = "",
  hoverScale = 1.02,
  animate = true
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      whileHover={{ scale: hoverScale, y: -2 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`
        w-full 
        max-w-[950px]     /* 🔥 WIDEN THE ENTIRE FORM CARD */
        mx-auto           /* 🔥 CENTER IT */
        p-8               /* bigger padding */
        rounded-2xl
        bg-white/80 dark:bg-gray-800/90
        backdrop-blur-lg
        border border-gray-200/60 dark:border-gray-700/60
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
