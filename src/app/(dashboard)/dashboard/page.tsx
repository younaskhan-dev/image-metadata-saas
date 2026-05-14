"use client";

import { useUser } from "@clerk/nextjs";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Map, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalUploads: 0,
    activeImages: 0,
    gpsEdits: 0,
    systemStatus: "Checking...",
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/images/stats");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalUploads: data.totalUploads,
            activeImages: data.activeImages,
            gpsEdits: data.gpsEdits,
            systemStatus: data.systemStatus,
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Failed to load stats", error);
        setStats(prev => ({ ...prev, isLoading: false, systemStatus: "Offline" }));
      }
    };
    fetchStats();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.firstName || "Creator"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Here is an overview of your metadata activity.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {/* Stat Cards */}
        {[
          { label: "Total Uploads", value: stats.isLoading ? "..." : stats.totalUploads.toString(), icon: Upload, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Active Images", value: stats.isLoading ? "..." : stats.activeImages.toString(), icon: ImageIcon, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
          { label: "GPS Edits", value: stats.isLoading ? "..." : stats.gpsEdits.toString(), icon: Map, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "System Status", value: stats.systemStatus, icon: Activity, color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/20" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-6 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-default relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100 to-transparent dark:from-slate-800 dark:to-transparent opacity-0 group-hover:opacity-50 transition-opacity rounded-bl-full pointer-events-none"></div>
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4 relative z-10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 relative z-10">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white relative z-10">{stat.value}</h3>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Link href="/dashboard/upload" className="group block h-full">
            <div className="h-full p-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl text-white shadow-xl hover:shadow-indigo-500/25 transition-all overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <Upload className="w-10 h-10 mb-6 text-indigo-100 group-hover:text-white transition-colors" />
              <h2 className="text-2xl font-bold mb-2">Upload New Image</h2>
              <p className="text-indigo-100 opacity-90 max-w-sm leading-relaxed">Extract GPS, camera settings, and timestamps instantly using our deep EXIF parser.</p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/dashboard/images" className="group block h-full">
            <div className="h-full p-8 bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <ImageIcon className="w-10 h-10 mb-6 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">View Library</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">Browse your previously uploaded images, edit their metadata on the map, and download the modified files.</p>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
