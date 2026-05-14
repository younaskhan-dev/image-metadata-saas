import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";
import Link from "next/link";
import Image from "next/image";
import DownloadAllButton from "@/components/image/DownloadAllButton";

export default async function MyImagesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  await connectToDatabase();
  const images = await ImageModel.find({ userId }).sort({ createdAt: -1 });
  const imageIds = images.map((img) => img._id.toString());

  return (
    <div className="max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Library</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">View and edit the metadata of your previously uploaded images.</p>
        </div>
        
        {images.length > 0 && (
          <DownloadAllButton imageIds={imageIds} />
        )}
      </div>

      {images.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">You haven't uploaded any images yet.</p>
          <Link href="/dashboard/upload" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-sm">
            Upload Your First Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <Link key={img._id.toString()} href={`/dashboard/images/${img._id}`} className="group block h-full">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 h-full flex flex-col">
                <div className="relative w-full h-48 bg-slate-50 dark:bg-zinc-950 overflow-hidden border-b border-slate-100 dark:border-slate-800">
                  <Image 
                    src={img.imageUrl} 
                    alt="Thumbnail" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate" title={img.updatedMetadata?.title || "Untitled Image"}>
                      {img.updatedMetadata?.title || "Untitled Image"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Uploaded on {new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {img.updatedMetadata?.latitude && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        GPS Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
