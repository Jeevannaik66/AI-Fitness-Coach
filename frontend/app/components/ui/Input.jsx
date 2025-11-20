"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Input({ 
  label,
  icon,
  error,
  success,
  className = "",
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-2"
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Input Container */}
      <motion.div
        whileFocus={{ scale: 1.02 }}
        whileHover={{ scale: 1.01 }}
        className={`
          relative flex items-center gap-3
          px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border-2 transition-all duration-300
          ${
            error 
              ? "border-red-500 dark:border-red-400 shadow-lg shadow-red-500/10" 
              : success 
              ? "border-green-500 dark:border-green-400 shadow-lg shadow-green-500/10"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus-within:border-blue-500 dark:focus-within:border-blue-400"
          }
          ${className}
        `}
      >
        {/* Icon */}
        {icon && (
          <div className={`
            flex-shrink-0
            ${error ? "text-red-500 dark:text-red-400" : 
              success ? "text-green-500 dark:text-green-400" : 
              "text-gray-400 dark:text-gray-500"}
          `}>
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          {...props}
          className={`
            w-full bg-transparent outline-none
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            text-base font-medium
            autofill:bg-transparent
            ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

        {/* Status Icons */}
        {error && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 text-red-500 dark:text-red-400"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 text-green-500 dark:text-green-400"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}

      {/* Success Message */}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </motion.p>
      )}
    </motion.div>
  );
}