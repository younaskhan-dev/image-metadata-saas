import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch actual statistics for the logged-in user
    const totalUploads = await ImageModel.countDocuments({ userId });
    
    // For GPS Edits, we check if they have updated their metadata
    // Since default is {}, we can check for documents where updatedMetadata has keys
    // A simple way is to fetch and filter, or just count where updatedMetadata.GPS exists
    const gpsEdits = await ImageModel.countDocuments({ 
      userId, 
      "updatedMetadata.latitude": { $exists: true, $ne: "" },
      "updatedMetadata.longitude": { $exists: true, $ne: "" }
    });

    return NextResponse.json({
      totalUploads,
      activeImages: totalUploads, // Assuming all uploaded are active
      gpsEdits,
      systemStatus: "Online"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
