"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Heart, Activity, Home, Clipboard } from "lucide-react";

export default function UserForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    height: "",
    weight: "",
    goal: "Weight Loss",
    level: "Beginner",
    location: "Home",
    dietPref: "Non-Veg",
    medicalHistory: "",
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl bg-white/95 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 space-y-6 sm:space-y-8"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex justify-center items-center gap-2 sm:gap-3">
          <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-600" />
          Personal Details
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
          Fill out the form to generate your AI fitness plan
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <FloatingInput 
          label="Full Name" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        <FloatingInput 
          label="Age" 
          name="age" 
          value={form.age} 
          onChange={handleChange} 
          icon={<Activity className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        <FloatingSelect 
          label="Gender" 
          name="gender" 
          value={form.gender} 
          onChange={handleChange} 
          options={["Male", "Female", "Other"]} 
        />

        <FloatingInput 
          label="Height (cm)" 
          name="height" 
          value={form.height} 
          onChange={handleChange} 
          icon={<Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        <FloatingInput 
          label="Weight (kg)" 
          name="weight" 
          value={form.weight} 
          onChange={handleChange} 
          icon={<Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        <FloatingSelect 
          label="Fitness Goal" 
          name="goal" 
          value={form.goal} 
          onChange={handleChange} 
          options={["Weight Loss", "Muscle Gain", "Maintain Fitness"]} 
        />

        <FloatingSelect 
          label="Experience Level" 
          name="level" 
          value={form.level} 
          onChange={handleChange} 
          options={["Beginner", "Intermediate", "Advanced"]} 
        />

        <FloatingSelect 
          label="Workout Location" 
          name="location" 
          value={form.location} 
          onChange={handleChange} 
          options={["Home", "Gym", "Outdoor"]} 
          icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        <FloatingSelect 
          label="Diet Preference" 
          name="dietPref" 
          value={form.dietPref} 
          onChange={handleChange} 
          options={["Non-Veg", "Veg", "Vegan", "Keto"]} 
          icon={<Heart className="w-4 h-4 sm:w-5 sm:h-5" />} 
        />

        {/* Textarea - Full Width */}
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            Medical Notes (Optional)
          </label>
          <textarea
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
            placeholder="Mention any injuries, restrictions or medical conditions"
            className="w-full rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 min-h-[100px] sm:min-h-[110px] text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base sm:text-lg shadow-lg transition-all"
      >
        Generate My AI Plan 🚀
      </motion.button>
    </motion.form>
  );
}

/* -------------------- FLOATING INPUT -------------------- */
function FloatingInput({ label, icon, ...props }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-indigo-500">
        {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
        <input 
          {...props} 
          className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 text-sm sm:text-base" 
        />
      </div>
      <span className="absolute -top-2 left-3 sm:left-4 bg-white dark:bg-gray-900 px-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

/* -------------------- FLOATING SELECT -------------------- */
function FloatingSelect({ label, options, icon, ...props }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 focus-within:ring-2 focus-within:ring-indigo-500">
        {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
        <select 
          {...props} 
          className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 text-sm sm:text-base cursor-pointer"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <span className="absolute -top-2 left-3 sm:left-4 bg-white dark:bg-gray-900 px-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}
