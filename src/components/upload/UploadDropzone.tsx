"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileImage, X, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      toast.error("Invalid file. Please upload a valid JPG/JPEG under 10MB.");
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Extracting metadata & uploading...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Image processed successfully!", { id: toastId });
      router.push(`/dashboard/images/${data.imageId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image", { id: toastId });
      setIsUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`relative overflow-hidden group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer ${
            isDragActive 
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[0.99]" 
              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-zinc-800"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center p-6 text-center z-10">
            <div className={`p-4 rounded-full mb-4 transition-colors duration-300 shadow-sm ${isDragActive ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500"}`}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {isDragActive ? "Drop your image here" : "Click or drag image to upload"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Supports high-resolution JPG & JPEG files up to 10MB. We automatically extract EXIF & GPS data.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for processing
                </p>
              </div>
            </div>
            {!isUploading && (
              <button 
                onClick={removeFile}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="relative w-full h-72 bg-slate-100 dark:bg-zinc-950 flex items-center justify-center">
            {preview && (
              <Image 
                src={preview} 
                alt="Preview" 
                fill 
                className={`object-contain p-4 ${isUploading ? 'opacity-50 blur-sm scale-95' : 'opacity-100'} transition-all duration-500`}
              />
            )}
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200 bg-white/80 dark:bg-black/80 px-4 py-1.5 rounded-full shadow-sm">Analyzing Metadata...</p>
              </div>
            )}
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full relative flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing Image...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Extract EXIF & Upload
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
