import mongoose from 'mongoose';
const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: Array, required: true },
    coll: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
    likes: { type: Map, of: Boolean, default: {} },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    number1: { type: String },
    number2: { type: String },
    number3: { type: String },
    string1: { type: String },
    string2: { type: String },
    string3: { type: String },
    text1: { type: String },
    text2: { type: String },
    text3: { type: String },
    date1: { type: String },
    date2: { type: String },
    date3: { type: String },
    checkbox1: { type: String },
    checkbox2: { type: String },
    checkbox3: { type: String },
}, { timestamps: true });
export default mongoose.model('Item', ItemSchema);
//# sourceMappingURL=Item.js.map