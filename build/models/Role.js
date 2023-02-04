import mongoose from 'mongoose';
const RoleSchema = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        default: 'user',
    },
}, { timestamps: true });
export default mongoose.model('Role', RoleSchema);
//# sourceMappingURL=Role.js.map