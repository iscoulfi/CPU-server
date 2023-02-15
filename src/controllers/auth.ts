import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Collection from '../models/Collection.js';
import { Types } from 'mongoose';
import Item from '../models/Item.js';

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const nameIsUsed = await User.findOne({ username });
    const emailIsUsed = await User.findOne({ email });

    if (nameIsUsed) {
      return res.json({
        message: 'This username is already taken',
      });
    }
    if (emailIsUsed) {
      return res.json({
        message: 'This email is already taken',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userRole = await Role.findOne({ value: 'user' });
    const newUser = new User({
      username,
      email,
      password: hash,
      roles: [
        (
          userRole as {
            value: string;
          }
        ).value,
      ],
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        roles: newUser.roles,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '10d' },
    );

    await newUser.save();

    res.json({
      newUser,
      token,
      message: 'Registration completed successfully',
    });
  } catch (error) {
    res.json({ message: 'Error creating user' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        message: 'This user does not exist',
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        message: 'Wrong password',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '10d' },
    );

    res.json({
      token,
      user,
      message: 'You are logged in',
    });
  } catch (error) {
    res.json({ message: 'Authorization error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({
        message: 'This user does not exist',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '10d' },
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.json({ message: 'No access' });
  }
};

// Get All
export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});

    res.json({
      users,
    });
  } catch (error) {
    res.json('No access');
  }
};

// Remove user

export const removeUser = async (req: Request, res: Response) => {
  try {
    const collections = new Array();
    const itemsId = new Array();
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      const collectionsId = user.collections.map((el) => el.toString());
      for (let collId of collectionsId) {
        collections.push(await Collection.findById(collId));
        await Collection.findByIdAndDelete(collId);
      }
    }

    collections.forEach((coll) => coll.items.forEach((item: Types.ObjectId) => itemsId.push(item.toString())));

    for (let id of itemsId) {
      await Item.findByIdAndDelete(id);
    }

    res.json({ id: req.params.id });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Update user
export const updateUser = (req: Request, res: Response) => {
  try {
    User.findOneAndUpdate({ username: req.params.username }, req.body).then(function () {
      User.findOne({ username: req.params.username }).then(function (user) {
        res.json(user);
      });
    });
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
