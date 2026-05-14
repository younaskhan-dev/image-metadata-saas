import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";
import exifr from "exifr";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer for processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract EXIF data using exifr
    let metadata = {};
    try {
      const extractedData = await exifr.parse(buffer, true); // true to parse all tags
      
      if (extractedData) {
        // Normalize coordinates and dates
        metadata = {
          ...extractedData,
          latitude: extractedData.latitude || null,
          longitude: extractedData.longitude || null,
          timestamp: extractedData.DateTimeOriginal || extractedData.CreateDate || null,
          camera: (extractedData.Make || extractedData.Model) 
            ? `${extractedData.Make || ''} ${extractedData.Model || ''}`.trim() 
            : null,
        };
      }
    } catch (err) {
      // It's okay if metadata extraction fails or has no EXIF, we proceed with upload
    }

    // Upload to Cloudinary using upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "image-metadata-saas" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    await connectToDatabase();

    // Save image reference and metadata to MongoDB
    const newImage = await ImageModel.create({
      userId,
      imageUrl: uploadResult.secure_url,
      originalMetadata: metadata,
      updatedMetadata: metadata, // initially the same as original
    });

    return NextResponse.json({
      message: "Upload successful",
      imageId: newImage._id,
      metadata
    });

  } catch (error: any) {
    console.error("Upload error details:", error?.message || error, JSON.stringify(error));
    return NextResponse.json(
      { error: "Internal server error during upload: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
