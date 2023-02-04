import { Request, Response } from 'express';
import Collection from '../models/Collection.js';
import User from '../models/User.js';

// Create Collection
export const createCollection = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      const newCollection = new Collection({
        ...data,
        imgUrl: req.file.originalname,
        author: req.user.id,
      });
      await newCollection.save();
      await User.findByIdAndUpdate(req.user.id, {
        $push: { collections: newCollection },
      });
      return res.json(newCollection);
    }

    const newCollection = new Collection({
      ...data,
      author: req.user.id,
    });
    await newCollection.save();
    await User.findByIdAndUpdate(req.user.id, {
      $push: { collections: newCollection },
    });
    return res.json(newCollection);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get All Collections
export const getAll = async (req: Request, res: Response) => {
  try {
    const collections = await Collection.find().sort('-createdAt');

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

//Get my collections
export const getMyCollections = async (req: Request, res: Response) => {
  try {
    // чекнуть как это будет работать с админом
    // const list = await Collection.find({ author: req.user.id });
    // res.json(list);
    const user = await User.findById(req.user.id);
    if (user) {
      const list = await Promise.all(
        user.collections.map((post) => {
          return Collection.findById(post._id);
        }),
      );
      res.json(list);
    }
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Update Collection
export const updateCollection = async (req: Request, res: Response) => {
  try {
    const { title, text, topic } = req.body;
    const collection = await Collection.findById(req.params.id);
    if (collection && req.file) {
      collection.title = title;
      collection.text = text;
      collection.topic = topic;
      collection.imgUrl = req.file.originalname;
      await collection.save();
    } else if (collection) {
      collection.title = title;
      collection.text = text;
      collection.topic = topic;
      collection.imgUrl = '';
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
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.json({ message: "This collection doesn't exist" });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { collections: req.params.id },
    });

    res.json({ message: 'Collection has been deleted' });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
