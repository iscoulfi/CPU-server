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

    if (user.statusUser === 'blocked') {
      return res.json({
        message: 'You are blocked!',
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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({
      user,
    });
  } catch (error) {
    res.json(null);
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
    await User.findByIdAndDelete(req.params.id);
    const urls = new Array();
    const collections = await Collection.find({ author: req.params.id });
    collections.forEach((coll) => urls.push(coll.imgUrl));

    res.json(urls);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (typeof req.body.prop === 'string') {
      await User.findByIdAndUpdate(req.params.userId, { statusUser: req.body.prop });
    } else {
      await User.findByIdAndUpdate(req.params.userId, { roles: req.body.prop });
    }
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: 'Something went wrong' });
  }
};
