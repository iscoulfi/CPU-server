import { Request, Response } from 'express';
import Collection from '../models/Collection.js';
import Comment from '../models/Comment.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

// Create Collection
export const createCollection = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get The Biggest Collections
export const getAll = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Collection By Id
export const getById = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findById(req.params.id);
    res.json(collection);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Collections By User Id
export const getMyCollections = async (req: Request, res: Response) => {
  try {
    const list = await Collection.find({ author: req.params.userId });
    res.json(list);
  } catch (error) {
    res.json([]);
  }
};

// Update Collection
export const updateCollection = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Remove Collection
export const removeCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.json({ message: "This collection doesn't exist" });

    if (collection.author.toString() !== req.user.id && req.user.roles[0] !== 'admin') {
      return res.json({ message: 'No access' });
    }

    await Collection.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { collections: req.params.id },
    });

    res.json(collection);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Remove All Collections
export const removeAllCollections = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
