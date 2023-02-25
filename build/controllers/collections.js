import Collection from '../models/Collection.js';
import Comment from '../models/Comment.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
export const createCollection = async (req, res) => {
    if (req.body.userId !== req.user.id && req.user.roles[0] !== 'admin') {
        return res.json({ message: 'No access' });
    }
    try {
        const data = req.body;
        const newCollection = new Collection({
            ...data,
            author: req.body.userId,
        });
        await newCollection.save();
        await User.findByIdAndUpdate(req.body.userId, {
            $push: { collections: newCollection },
        });
        return res.json(newCollection);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getAll = async (req, res) => {
    try {
        const collections = await Collection.aggregate([
            {
                $addFields: {
                    itemsLength: {
                        $size: '$items',
                    },
                },
            },
            {
                $sort: {
                    itemsLength: -1,
                },
            },
            { $limit: 4 },
        ]);
        if (!collections) {
            return res.json({ message: 'No collections' });
        }
        res.json(collections);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        res.json(collection);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getMyCollections = async (req, res) => {
    try {
        const list = await Collection.find({ author: req.params.userId });
        res.json(list);
    }
    catch (error) {
        res.json([]);
    }
};
export const updateCollection = async (req, res) => {
    try {
        const { title, text, imgUrl, adFields } = req.body;
        const collection = await Collection.findById(req.params.id);
        if (collection && collection.author.toString() !== req.user.id && req.user.roles[0] !== 'admin') {
            return res.json({ message: 'No access' });
        }
        if (collection) {
            collection.title = title;
            collection.text = text;
            collection.imgUrl = imgUrl;
            collection.adFields = adFields;
            await collection.save();
        }
        res.json(collection);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const removeCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection)
            return res.json({ message: "This collection doesn't exist" });
        if (collection.author.toString() !== req.user.id && req.user.roles[0] !== 'admin') {
            return res.json({ message: 'No access' });
        }
        await Collection.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { collections: req.params.id },
        });
        res.json(collection);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const removeAllCollections = async (req, res) => {
    if (req.params.id !== req.user.id && req.user.roles[0] !== 'admin') {
        return res.json({ message: 'No access' });
    }
    try {
        const collections = await Collection.find({ author: req.params.id });
        await Collection.deleteMany({ author: req.params.id });
        for (let c of collections) {
            const items = await Item.find({ coll: c._id });
            await Item.deleteMany({ coll: c._id });
            for (let i of items) {
                await Comment.deleteMany({ item: i._id });
            }
        }
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
//# sourceMappingURL=collections.js.map