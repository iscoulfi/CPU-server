import Item from '../models/Item.js';
import Comment from '../models/Comment.js';
import Collection from '../models/Collection.js';
export const createItem = async (req, res) => {
    const data = req.body;
    try {
        const newItem = new Item({
            ...data,
            coll: req.params.colid,
        });
        await newItem.save();
        await Collection.findByIdAndUpdate(req.params.colid, {
            $push: { items: newItem },
        });
        return res.json(newItem);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getAll = async (req, res) => {
    try {
        const items = await Item.find().sort('-createdAt');
        if (!items) {
            return res.json({ message: 'No items' });
        }
        res.json(items);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getCollectionItems = async (req, res) => {
    try {
        const list = await Item.find({ coll: req.params.colid });
        res.json(list);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const updateItem = async (req, res) => {
    try {
        const data = req.body;
        const item = await Item.findById(req.params.id);
        if (item) {
            item.title = data.title;
            item.tags = data.tags;
            item.num1 = data.num1;
            item.num2 = data.num2;
            item.num3 = data.num3;
            item.string1 = data.string1;
            item.string2 = data.string2;
            item.string3 = data.string3;
            item.text1 = data.text1;
            item.text2 = data.text2;
            item.text3 = data.text3;
            item.date1 = data.date1;
            item.date2 = data.date2;
            item.date3 = data.date3;
            item.checkbox1 = data.checkbox1;
            item.checkbox2 = data.checkbox2;
            item.checkbox3 = data.checkbox3;
            await item.save();
        }
        res.json(item);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const removeItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item)
            return res.json({ message: "This Item doesn't exist" });
        await Collection.findByIdAndUpdate(req.params.colid, {
            $pull: { items: req.params.id },
        });
        res.json({ message: 'Item has been deleted' });
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getLastTags = async (req, res) => {
    try {
        const items = await Item.find().limit(5).exec();
        const tags = items
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    }
    catch (err) {
        res.json({ message: 'Something went wrong' });
    }
};
export const getItemComments = async (req, res) => {
    try {
        const list = await Comment.find({ item: req.params.id });
        res.json(list);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id);
        if (item) {
            const isLiked = item.likes.get(req.user.id);
            if (isLiked) {
                item.likes.delete(req.user.id);
            }
            else {
                item.likes.set(req.user.id, true);
            }
            const updatedItem = await Item.findByIdAndUpdate(id, { likes: item.likes }, { new: true });
            res.json(updatedItem);
        }
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
//# sourceMappingURL=items.js.map