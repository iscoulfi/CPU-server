import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

type Comment = mongoose.InferSchemaType<typeof CommentSchema>;
export default mongoose.model<Comment>('Comment', CommentSchema);
