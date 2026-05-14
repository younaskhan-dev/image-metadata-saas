import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImage extends Document {
  userId: string;
  imageUrl: string;
  originalMetadata: Record<string, any>;
  updatedMetadata: Record<string, any>;
  createdAt: Date;
}

const ImageSchema: Schema = new Schema({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  originalMetadata: { type: Object, default: {} },
  updatedMetadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export const ImageModel: Model<IImage> = mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
