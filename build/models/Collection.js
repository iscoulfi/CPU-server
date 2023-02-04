import mongoose from 'mongoose';
const CollectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        default: '',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
}, { timestamps: true });
export default mongoose.model('Collection', CollectionSchema);
//# sourceMappingURL=Collection.js.map