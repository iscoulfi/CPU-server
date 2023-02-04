import Comment from '../models/Comment.js';
import Item from '../models/Item.js';
export const createComment = async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment)
            return;
        const newComment = new Comment({ comment, author: req.user.id, item: req.params.id });
        await newComment.save();
        try {
            await Item.findByIdAndUpdate(req.params.id, {
                $push: { comments: newComment._id },
            });
        }
        catch (error) {
            console.log(error);
        }
        res.json(newComment);
    }
    catch (error) {
        res.json({ message: 'Something went wrong' });
    }
};
//# sourceMappingURL=comments.js.map