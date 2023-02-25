import { Request, Response } from 'express';
import Comment from '../models/Comment.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

export const createComment = async (req: Request, res: Response) => {
  try {
    const { comment } = req.body;
    if (!comment) return;
    const person = await User.findById(req.user.id);
    const newComment = new Comment({
      comment,
      authorId: req.user.id,
      author: person?.username,
      item: req.params.itemId,
    });

    await newComment.save();
    await Item.findByIdAndUpdate(req.params.itemId, {
      $push: { comments: newComment._id },
    });

    const list = await Comment.find({ item: req.params.itemId }).sort('-createdAt');

    res.json(list);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
