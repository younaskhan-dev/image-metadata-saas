"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, DownloadCloud, Bell, Save, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    exportQuality: "original",
    stripOriginalMetadata: false,
    defaultLat: 34.0522,
    defaultLng: -118.2437,
    emailNotifications: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto text-slate-900 dark:text-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">Application preferences and configuration.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6 pb-12"
      >
        {/* Bulk Export Preferences */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export Preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure how images are processed during ZIP download.</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Quality Strategy</label>
              <select 
                value={settings.exportQuality}
                onChange={(e) => setSettings({...settings, exportQuality: e.target.value})}
                className="w-full sm:w-1/2 px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
              >
                <option value="original">Original (Lossless EXIF injection)</option>
                <option value="high">High Quality (Compress slightly)</option>
                <option value="web">Web Optimized (Faster download)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Strip Unedited Metadata</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Remove camera serials and other identifying EXIF tags.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.stripOriginalMetadata} onChange={() => setSettings({...settings, stripOriginalMetadata: !settings.stripOriginalMetadata})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600 shadow-inner"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Default Map Location */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Map Configuration</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set the default location when images lack GPS data.</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Latitude</label>
              <input 
                type="number" 
                value={settings.defaultLat}
                onChange={(e) => setSettings({...settings, defaultLat: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Longitude</label>
              <input 
                type="number" 
                value={settings.defaultLng}
                onChange={(e) => setSettings({...settings, defaultLng: parseFloat(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your system alerts.</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">Email Receipts</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Receive an email summary when a bulk ZIP export completes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.emailNotifications} onChange={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600 shadow-inner"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_-3px_rgba(99,102,241,0.6)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSaving ? (
              <Shield className="w-5 h-5 animate-pulse" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Saving Settings..." : "Save Preferences"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
