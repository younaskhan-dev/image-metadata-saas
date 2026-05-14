import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";
import Image from "next/image";
import MetadataForm from "@/components/metadata/MetadataForm";

export default async function ImageDetailsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { id } = await params;

  await connectToDatabase();
  const imageDoc = await ImageModel.findById(id);

  if (!imageDoc || imageDoc.userId !== userId) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#0F172A] rounded-xl border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Image Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The image you are looking for does not exist or you don't have access to it.</p>
      </div>
    );
  }

  // Convert mongoose doc to plain JS object to pass to client component
  const image = JSON.parse(JSON.stringify(imageDoc));

  return (
    <div className="max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Metadata</h1>
        <p className="text-gray-600 dark:text-gray-400">Update GPS coordinates, timestamps, and other EXIF details.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8">
        {/* Left Column: Image Preview */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <Image src={image.imageUrl} alt="Uploaded Image" fill className="object-contain" priority />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Original EXIF Data Extracted</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                {Object.keys(image.originalMetadata || {}).length === 0 
                  ? "No GPS or EXIF metadata found in this image." 
                  : JSON.stringify(image.originalMetadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Editor Form */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-fit sticky top-6">
           <MetadataForm image={image} />
        </div>
      </div>
    </div>
  );
}
