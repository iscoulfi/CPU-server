import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      unique: true,
      default: 'user',
    },
  },
  { timestamps: true },
);

type Role = mongoose.InferSchemaType<typeof RoleSchema>;
export default mongoose.model<Role>('Role', RoleSchema);
