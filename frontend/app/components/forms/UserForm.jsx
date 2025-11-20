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
      className="w-full max-w-2xl mx-auto p-7 rounded-3xl shadow-xl bg-white/95 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 space-y-8"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex justify-center items-center gap-3">
          <User className="w-7 h-7 text-indigo-600" />
          Personal Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Fill out the form to generate your AI fitness plan
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <FloatingInput label="Full Name" name="name" value={form.name} onChange={handleChange} icon={<User />} />

        <FloatingInput label="Age" name="age" value={form.age} onChange={handleChange} icon={<Activity />} />

        <FloatingSelect label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />

        <FloatingInput label="Height (cm)" name="height" value={form.height} onChange={handleChange} icon={<Clipboard />} />

        <FloatingInput label="Weight (kg)" name="weight" value={form.weight} onChange={handleChange} icon={<Clipboard />} />

        <FloatingSelect label="Fitness Goal" name="goal" value={form.goal} onChange={handleChange} options={["Weight Loss", "Muscle Gain", "Maintain Fitness"]} />

        <FloatingSelect label="Experience Level" name="level" value={form.level} onChange={handleChange} options={["Beginner", "Intermediate", "Advanced"]} />

        <FloatingSelect label="Workout Location" name="location" value={form.location} onChange={handleChange} options={["Home", "Gym", "Outdoor"]} icon={<Home />} />

        <FloatingSelect label="Diet Preference" name="dietPref" value={form.dietPref} onChange={handleChange} options={["Non-Veg", "Veg", "Vegan", "Keto"]} icon={<Heart />} />

        {/* Textarea - Full Width */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Medical Notes (Optional)
          </label>

          <textarea
            name="medicalHistory"
            value={form.medicalHistory}
            onChange={handleChange}
            placeholder="Mention any injuries, restrictions or medical conditions"
            className="w-full rounded-2xl p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 min-h-[110px]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg shadow-lg transition-all"
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
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
        {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
        <input {...props} className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100" />
      </div>

      <span className="absolute -top-2 left-4 bg-white dark:bg-gray-900 px-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

/* -------------------- FLOATING SELECT -------------------- */
function FloatingSelect({ label, options, icon, ...props }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
        {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
        <select {...props} className="w-full bg-transparent outline-none text-gray-800 dark:text-gray-100 cursor-pointer">
          {options.map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      </div>

      <span className="absolute -top-2 left-4 bg-white dark:bg-gray-900 px-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}
