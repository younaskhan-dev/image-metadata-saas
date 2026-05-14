import UploadDropzone from "@/components/upload/UploadDropzone";

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Image</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Upload a JPG or JPEG image to securely store it and extract its EXIF metadata.</p>
      </div>
      
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
        <UploadDropzone />
      </div>
    </div>
  );
}
