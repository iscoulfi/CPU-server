import { Request, Response } from 'express';
import Item from '../models/Item.js';
import Comment from '../models/Comment.js';
import Collection from '../models/Collection.js';

// Create Item
export const createItem = async (req: Request, res: Response) => {
  const data = req.body;
  data.checkbox1 = data.checkbox1 ? '+' : '-';
  data.checkbox2 = data.checkbox2 ? '+' : '-';
  data.checkbox3 = data.checkbox3 ? '+' : '-';
  try {
    const newItem = new Item({
      ...data,
      tags: req.body.tags.split(' '),
      coll: req.params.collId,
    });

    await newItem.save();

    await Collection.findByIdAndUpdate(req.params.collId, {
      $push: { items: newItem },
    });

    return res.json(newItem);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

export interface IItem {
  _id: string;
  title: string;
  coll: string;
  createdAt: string;
}

// Get All Items
export const getAll = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    let autoSearch = new Array();
    ['title', 'tags', 'string1', 'string2', 'string3', 'text1', 'text2', 'text3'].forEach((el) =>
      autoSearch.push({
        autocomplete: {
          query: search,
          path: el,
        },
      }),
    );

    let items;
    let coll;
    let comments;
    if (search) {
      items = await Item.aggregate([
        {
          $search: {
            index: 'autocomplete',
            compound: {
              should: autoSearch,
            },
          },
        },
      ]);
      coll = await Collection.aggregate([
        {
          $search: {
            index: 'collections',
            compound: {
              should: [
                {
                  autocomplete: {
                    query: search,
                    path: 'title',
                  },
                },
                {
                  autocomplete: {
                    query: search,
                    path: 'text',
                  },
                },
              ],
            },
          },
        },
        {
          $project: { items: 1 },
        },
      ]);
      for (const c of coll) {
        for (const i of c.items) {
          const a = await Item.findById(i.toString());
          items.push(a);
        }
      }
      comments = await Comment.aggregate([
        {
          $search: {
            index: 'comments',
            compound: {
              should: [
                {
                  autocomplete: {
                    query: search,
                    path: 'comment',
                  },
                },
              ],
            },
          },
        },
        {
          $project: { item: 1 },
        },
      ]);

      for (const c of comments) {
        const a = await Item.findById(c.item.toString());
        if (a) items.push(a);
      }
    } else {
      items = await Item.find().sort('-createdAt').limit(7);
    }

    items = items.reduce((i, el) => {
      if (!i.find((v: IItem) => v._id.toString() == el._id.toString())) {
        i.push(el);
      }
      return i;
    }, []);

    res.json(items);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Item By Id
export const getById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.itemId);
    res.json(item);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

//Get collection Items
export const getCollectionItems = async (req: Request, res: Response) => {
  try {
    const list = await Item.find({ coll: req.params.collId });
    res.json(list);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Update Item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const item = await Item.findById(req.params.itemId);
    if (item) {
      item.title = data.title;
      item.tags = data.tags.split(' ');
      item.number1 = data.number1;
      item.number2 = data.number2;
      item.number3 = data.number3;
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
    const item = await Item.findByIdAndDelete(req.params.itemId);
    if (!item) return res.json({ message: "This Item doesn't exist" });

    await Collection.findByIdAndUpdate(req.params.collId, {
      $pull: { items: req.params.itemId },
    });

    res.json(item.coll);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Last Tags
export const getLastTags = async (req: Request, res: Response) => {
  try {
    const items = await Item.find().limit(15);

    const tags = items.map((obj) => obj.tags).flat();
    const filterTags = tags.filter((el, ind) => ind === tags.indexOf(el)).slice(0, 20);

    res.json(filterTags);
  } catch (err) {
    res.json({ message: 'Something went wrong' });
  }
};

// Get Item Comments
export const getItemComments = async (req: Request, res: Response) => {
  try {
    const list = await Comment.find({ item: req.params.itemId }).sort('-createdAt');
    res.json(list);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

//Like
export const likePost = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (item) {
      const isLiked = item.likes.get(req.user.id);
      if (isLiked) {
        item.likes.delete(req.user.id);
      } else {
        item.likes.set(req.user.id, true);
      }
      const updatedItem = await Item.findByIdAndUpdate(itemId, { likes: item.likes }, { new: true });
      res.json(updatedItem);
    }
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
