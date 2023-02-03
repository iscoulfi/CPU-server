import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
    },
  },
  { timestamps: true },
);

type Collection = mongoose.InferSchemaType<typeof CollectionSchema>;
export default mongoose.model<Collection>('Collection', CollectionSchema);
