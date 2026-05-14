"use client";

import { useState } from "react";
import JSZip from "jszip";
import { DownloadCloud, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DownloadAllButtonProps {
  imageIds: string[];
}

export default function DownloadAllButton({ imageIds }: DownloadAllButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (imageIds.length === 0) {


      toast.error("No images to download.");
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading(`Preparing ZIP archive for ${imageIds.length} image(s)...`);

    try {
      const zip = new JSZip();

      // Fetch each processed image
      for (let i = 0; i < imageIds.length; i++) {
        const id = imageIds[i];
        toast.loading(`Processing image ${i + 1} of ${imageIds.length}...`, { id: toastId });

        const response = await fetch(`/api/download?imageId=${id}`);
        if (!response.ok) {
          console.warn(`Failed to fetch image ${id}`);
          continue;
        }

        const blob = await response.blob();

        // Try to get filename from Content-Disposition, otherwise fallback
        const contentDisposition = response.headers.get("content-disposition");
        let filename = `MetaEdit-${id}.jpg`;
        if (contentDisposition && contentDisposition.includes("filename=")) {
          filename = contentDisposition.split("filename=")[1].replace(/['"]/g, "");
        }

        zip.file(filename, blob);
      }

      toast.loading("Compressing ZIP file...", { id: toastId });

      // Generate ZIP and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = zipUrl;
      a.download = `MetaEdit-Export-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(zipUrl);

      toast.success("ZIP download complete!", { id: toastId });
    } catch (error: any) {
      toast.error("Failed to generate ZIP archive.", { id: toastId });
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (imageIds.length === 0) return null;

  return (
    <button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <DownloadCloud className="w-4 h-4" />
      )}
      {isDownloading ? "Zipping..." : "Export All as ZIP"}
    </button>
  );
}
