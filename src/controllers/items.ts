import { Request, Response } from 'express';
import Item from '../models/Item.js';
import Comment from '../models/Comment.js';
import Collection from '../models/Collection.js';

// Create Item
export const createItem = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get All Items
export const getAll = async (req: Request, res: Response) => {
  try {
    const items = await Item.find().sort('-createdAt');

    if (!items) {
      return res.json({ message: 'No items' });
    }

    res.json(items);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Item By Id
export const getById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

//Get collection Items
export const getCollectionItems = async (req: Request, res: Response) => {
  try {
    const list = await Item.find({ coll: req.params.colid });
    res.json(list);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Update Item
export const updateItem = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Remove Item
export const removeItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.json({ message: "This Item doesn't exist" });

    await Collection.findByIdAndUpdate(req.params.colid, {
      $pull: { items: req.params.id },
    });

    res.json({ message: 'Item has been deleted' });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Last Tags
export const getLastTags = async (req: Request, res: Response) => {
  try {
    const items = await Item.find().limit(5).exec();

    const tags = items
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Item Comments
export const getItemComments = async (req: Request, res: Response) => {
  try {
    const list = await Comment.find({ item: req.params.id });
    res.json(list);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};