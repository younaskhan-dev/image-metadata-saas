import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";
import piexif from "piexifjs";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const imageId = searchParams.get("imageId");

    if (!imageId) return NextResponse.json({ error: "Missing imageId" }, { status: 400 });

    await connectToDatabase();
    const imageDoc = await ImageModel.findOne({ _id: imageId, userId });
    
    if (!imageDoc) return NextResponse.json({ error: "Image not found" }, { status: 404 });

    // Fetch the original image from Cloudinary as an array buffer
    const response = await fetch(imageDoc.imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to base64 string because piexifjs requires it
    const base64Image = "data:image/jpeg;base64," + buffer.toString("base64");

    const metadata = imageDoc.updatedMetadata || {};
    
    // Create EXIF structure according to piexifjs format
    const zeroth: any = {};
    const exif: any = {};
    const gps: any = {};

    // 1. Description/Title (ImageDescription tag)
    if (metadata.description || metadata.title) {
      zeroth[piexif.ImageIFD.ImageDescription] = metadata.description || metadata.title || "Modified by MetaEdit SaaS";
    }

    // 2. Timestamp
    if (metadata.timestamp) {
      // EXIF date format must be exactly "YYYY:MM:DD HH:MM:SS"
      const date = new Date(metadata.timestamp);
      if (!isNaN(date.getTime())) {
        const exifDate = date.toISOString().replace(/-/g, ":").replace("T", " ").substring(0, 19);
        exif[piexif.ExifIFD.DateTimeOriginal] = exifDate;
        exif[piexif.ExifIFD.DateTimeDigitized] = exifDate;
        zeroth[piexif.ImageIFD.DateTime] = exifDate;
      }
    }

    // 3. GPS Coordinates
    if (metadata.latitude && metadata.longitude) {
      const lat = parseFloat(metadata.latitude);
      const lng = parseFloat(metadata.longitude);
      
      const latRef = lat < 0 ? "S" : "N";
      const lngRef = lng < 0 ? "W" : "E";
      
      // Helper function to convert decimal degrees to EXIF Rational format ([degrees, minutes, seconds])
      const degToDmsRational = (degrees: number) => {
        const d = Math.abs(degrees);
        const deg = Math.floor(d);
        const min = Math.floor((d - deg) * 60);
        const sec = Math.round((d - deg - min / 60) * 3600 * 100);
        return [[deg, 1], [min, 1], [sec, 100]];
      };

      gps[piexif.GPSIFD.GPSLatitudeRef] = latRef;
      gps[piexif.GPSIFD.GPSLatitude] = degToDmsRational(lat);
      gps[piexif.GPSIFD.GPSLongitudeRef] = lngRef;
      gps[piexif.GPSIFD.GPSLongitude] = degToDmsRational(lng);
    }

    // Pack the data
    const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
    const exifBytes = piexif.dump(exifObj);
    
    // Insert new EXIF bytes into the original JPEG base64 string
    const newJpeg = piexif.insert(exifBytes, base64Image);
    
    // Convert back to binary buffer for download
    const newBuffer = Buffer.from(newJpeg.replace(/^data:image\/jpeg;base64,/, ""), "base64");

    const filename = `MetaEdit-${imageId.toString().slice(-6)}.jpg`;

    // Return as a downloadable file attachment
    return new NextResponse(newBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Failed to process image download: " + error.message }, { status: 500 });
  }
}
