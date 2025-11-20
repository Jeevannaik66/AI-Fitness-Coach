"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, RotateCcw, Loader2 } from "lucide-react";

export default function ImageViewer({ prompt }) {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

  async function generate() {
    try {
      setLoading(true);

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Image generation failed");

      setImg(json.image);
    } catch (e) {
      console.error(e);
      alert("Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        p-6 rounded-3xl bg-white/30 dark:bg-gray-900/30 
        backdrop-blur-xl border border-white/20 dark:border-gray-700/20 
        shadow-xl space-y-4 w-full max-w-md
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            AI Image Generator
          </h3>
        </div>

        {/* Generate Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generate}
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            bg-indigo-600 hover:bg-indigo-700 text-white font-medium
            shadow-lg transition disabled:opacity-50
          "
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
          {loading ? "Generating..." : "Regenerate"}
        </motion.button>
      </div>

      {/* Image Container */}
      <div className="w-full flex justify-center">
        {/* Loading Skeleton */}
        {loading && (
          <div
            className="
              w-64 h-64 rounded-2xl 
              bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
              dark:from-gray-700 dark:via-gray-800 dark:to-gray-700
              animate-pulse shadow-lg
            "
          ></div>
        )}

        {/* Final Image */}
        {img && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/20
            "
          >
            <img
              src={img}
              alt={prompt}
              className="
                w-64 h-64 object-cover transition-all duration-300 
                group-hover:scale-105
              "
            />

            {/* Overlay when hovering */}
            <div
              className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                bg-black/20 dark:bg-black/30 
                flex items-center justify-center text-white text-sm 
                transition
              "
            >
              {prompt}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
