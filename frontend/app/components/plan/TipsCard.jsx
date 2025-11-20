"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function TipsCard({ tips }) {
  // 🔒 Safety: ensure tips is ALWAYS an array
  const safeTips = Array.isArray(tips) ? tips : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="
        p-6 rounded-3xl 
        bg-gradient-to-br from-white/60 to-white/30 
        dark:from-gray-900/60 dark:to-gray-800/40
        backdrop-blur-xl 
        border border-white/20 dark:border-gray-700/20
        shadow-xl hover:shadow-2xl 
        transition
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-yellow-500 w-6 h-6" />
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Tips & Motivation
        </h3>
      </div>

      {/* Tips List */}
      {safeTips.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic text-sm">
          No tips available.
        </p>
      ) : (
        <ul className="space-y-3">
          {safeTips.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="text-green-500 w-5 h-5 mt-1" />
              <span className="text-gray-700 dark:text-gray-300 text-sm leading-snug">
                {tip}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
