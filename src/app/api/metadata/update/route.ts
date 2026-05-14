import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongodb";
import { ImageModel } from "@/models/Image";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { imageId, updatedMetadata } = await req.json();

    await connectToDatabase();
    
    const image = await ImageModel.findOneAndUpdate(
      { _id: imageId, userId },
      { updatedMetadata },
      { new: true }
    );

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
