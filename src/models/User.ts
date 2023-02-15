import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    statusUser: {
      type: String,
      default: 'available',
    },
    roles: [{ type: String, ref: 'Role' }],
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  },
  { timestamps: true },
);

type User = mongoose.InferSchemaType<typeof UserSchema>;
export default mongoose.model<User>('User', UserSchema);
