"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Image as ImageIcon, Map, Layers, DownloadCloud, ChevronRight, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ImageIcon className="w-6 h-6" />
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">MetaEdit</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)]">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Background Glowing Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/10 dark:to-violet-500/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen Metadata Editor is live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl"
        >
          Control your image data with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            surgical precision.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed"
        >
          Upload images, extract hidden EXIF and GPS data, visually edit coordinates on an interactive map, and securely download the modified files in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Open Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 w-full max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#020617] via-transparent to-transparent z-10 h-full w-full"></div>
          <div className="relative rounded-2xl md:rounded-[2rem] border border-slate-200/50 dark:border-slate-800 bg-white/50 dark:bg-[#0F172A]/50 backdrop-blur-md shadow-2xl overflow-hidden p-2">
            <div className="absolute top-4 left-4 flex gap-1.5 z-20">
              <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-sm"></div>
            </div>
            <div className="mt-8 rounded-xl md:rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="text-center p-8 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-10 hover:scale-105 transition-transform duration-500">
                  <Layers className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Premium UI Infrastructure</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs text-sm">Experience the speed and elegance of modern web engineering.</p>
                </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Powerful Developer Tools</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to manage image metadata securely.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Deep EXIF Extraction", icon: Lock, desc: "Automatically reads raw binary markers from JPG files to find hidden timestamps and camera models." },
              { title: "Interactive Map Editor", icon: Map, desc: "Visual coordinate picker using Leaflet and OpenStreetMap for surgical GPS modifications." },
              { title: "Lossless Re-injection", icon: DownloadCloud, desc: "We compile your edits back into the image binary without re-encoding the actual photo." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
