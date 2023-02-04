import Collection from '../models/Collection.js';
import User from '../models/User.js';
export const createCollection = async (req, res) => {
    try {
        const data = req.body;
        const newCollection = new Collection({
            ...data,
            author: req.user.id,
        });
        await newCollection.save();
        await User.findByIdAndUpdate(req.user.id, {
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
        const collections = await Collection.find().sort('-createdAt');
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
        const user = await User.findById(req.user.id);
        if (user) {
            const list = await Promise.all(user.collections.map((post) => {
                return Collection.findById(post._id);
            }));
            res.json(list);
        }
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const updateCollection = async (req, res) => {
    try {
        const { title, text, topic, imgUrl } = req.body;
        const collection = await Collection.findById(req.params.id);
        if (collection) {
            collection.title = title;
            collection.text = text;
            collection.topic = topic;
            collection.imgUrl = imgUrl;
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
        const collection = await Collection.findByIdAndDelete(req.params.id);
        if (!collection)
            return res.json({ message: "This collection doesn't exist" });
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { collections: req.params.id },
        });
        res.json({ message: 'Collection has been deleted' });
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
//# sourceMappingURL=collections.js.map