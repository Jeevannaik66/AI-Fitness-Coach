"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ImageModal({ image, onClose }) {
  // Close modal with ESC key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!image) return null;

  return (
    <AnimatePresence>
      {/* BACKDROP */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="
          fixed inset-0 z-50 
          bg-black/70 backdrop-blur-sm 
          flex items-center justify-center
        "
      />

      {/* MODAL CONTAINER */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        className="
          fixed z-50 
          max-w-2xl w-[90%] 
          p-5 rounded-3xl 
          bg-white dark:bg-gray-900 
          shadow-2xl border border-white/20 dark:border-gray-700/40
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 
            p-2 rounded-full 
            bg-black/50 hover:bg-black/70 
            dark:bg-white/20 dark:hover:bg-white/30
            text-white dark:text-gray-200
            shadow-lg transition
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* IMAGE */}
        <motion.img
          src={image}
          alt="Generated visual"
          className="
            w-full object-cover rounded-2xl 
            shadow-lg border border-gray-300/40 dark:border-gray-700/40
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
