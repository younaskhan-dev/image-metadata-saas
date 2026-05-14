"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Map must be dynamically imported with SSR disabled because Leaflet uses the window object
const MapPicker = dynamic(() => import("@/components/map/CoordinatePicker"), { 
  ssr: false, 
  loading: () => <div className="h-[250px] w-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 font-medium">Loading Interactive Map...</div> 
});

export default function MetadataForm({ image }: { image: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const metadata = image.updatedMetadata || image.originalMetadata || {};

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      latitude: metadata.latitude || "",
      longitude: metadata.longitude || "",
      timestamp: metadata.timestamp ? new Date(metadata.timestamp).toISOString().slice(0, 16) : "",
      title: metadata.title || "",
      description: metadata.description || "",
    }
  });

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/metadata/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: image._id,
          updatedMetadata: data
        })
      });

      if (!response.ok) throw new Error("Failed to update metadata");

      toast.success("Metadata saved successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    toast.success("Preparing your image with new metadata...", { duration: 3000 });
    // Open the download API route in a new tab which triggers a file download
    window.open(`/api/download?imageId=${image._id}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Image Title</label>
          <input 
            {...register("title")} 
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm" 
            placeholder="e.g., Summer Vacation" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Description / Caption</label>
          <textarea 
            {...register("description")} 
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm resize-none" 
            rows={3} 
            placeholder="Add some notes about this photo..."
          ></textarea>
        </div>

        <div className="pt-2 pb-2">
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Location Map</label>
          <MapPicker 
            latitude={watch("latitude") ? parseFloat(watch("latitude") as string) : null} 
            longitude={watch("longitude") ? parseFloat(watch("longitude") as string) : null} 
            onChange={(newLat, newLng) => {
              setValue("latitude", newLat.toFixed(6));
              setValue("longitude", newLng.toFixed(6));
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Latitude</label>
            <input 
              {...register("latitude")} 
              type="number" 
              step="any" 
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm font-mono text-sm" 
              placeholder="e.g. 34.123" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Longitude</label>
            <input 
              {...register("longitude")} 
              type="number" 
              step="any" 
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm font-mono text-sm" 
              placeholder="e.g. -118.456" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Date & Time Taken</label>
          <input 
            {...register("timestamp")} 
            type="datetime-local" 
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm" 
          />
        </div>
      </div>

      <div className="pt-6 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800">
        <button 
          type="submit" 
          disabled={isSaving} 
          className="w-full relative flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
        >
          {isSaving ? "Saving Edits..." : "Save Metadata Edits"}
        </button>
        <button 
          type="button" 
          onClick={handleDownload} 
          className="w-full relative flex items-center justify-center py-3.5 px-4 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
        >
          Download Modified Image
        </button>
      </div>
    </form>
  );
}
