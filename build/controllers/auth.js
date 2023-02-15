import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Collection from '../models/Collection.js';
import Item from '../models/Item.js';
export const register = async (req, res) => {
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
                userRole.value,
            ],
        });
        const token = jwt.sign({
            id: newUser._id,
            roles: newUser.roles,
        }, process.env.JWT_SECRET, { expiresIn: '10d' });
        await newUser.save();
        res.json({
            newUser,
            token,
            message: 'Registration completed successfully',
        });
    }
    catch (error) {
        res.json({ message: 'Error creating user' });
    }
};
export const login = async (req, res) => {
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
        const token = jwt.sign({
            id: user._id,
            roles: user.roles,
        }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.json({
            token,
            user,
            message: 'You are logged in',
        });
    }
    catch (error) {
        res.json({ message: 'Authorization error' });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.json({
                message: 'This user does not exist',
            });
        }
        const token = jwt.sign({
            id: user._id,
            roles: user.roles,
        }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.json({
            user,
            token,
        });
    }
    catch (error) {
        res.json({ message: 'No access' });
    }
};
export const getAll = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({
            users,
        });
    }
    catch (error) {
        res.json('No access');
    }
};
export const removeUser = async (req, res) => {
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
        collections.forEach((coll) => coll.items.forEach((item) => itemsId.push(item.toString())));
        for (let id of itemsId) {
            await Item.findByIdAndDelete(id);
        }
        res.json({ id: req.params.id });
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
export const updateUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, req.body);
        const users = await User.find();
        res.json(users);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
//# sourceMappingURL=auth.js.map