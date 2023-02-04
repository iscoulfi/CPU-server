import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: { type: Array, required: true },
    coll: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
    likes: { type: Map, of: Boolean },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    num1: { type: String },
    num2: { type: String },
    num3: { type: String },
    string1: { type: String },
    string2: { type: String },
    string3: { type: String },
    text1: { type: String },
    text2: { type: String },
    text3: { type: String },
    date1: { type: String },
    date2: { type: String },
    date3: { type: String },
    checkbox1: { type: Boolean },
    checkbox2: { type: Boolean },
    checkbox3: { type: Boolean },
  },
  { timestamps: true },
);

type Item = mongoose.InferSchemaType<typeof ItemSchema>;
export default mongoose.model<Item>('Item', ItemSchema);
