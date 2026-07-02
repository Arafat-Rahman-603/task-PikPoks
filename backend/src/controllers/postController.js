import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * GET /api/posts
 * Managers see their own posts and admins' posts. Admins see all posts.
 */
export const getPosts = async (req, res, next) => {
  try {
    let filter = {};

    // Managers see their own posts and admins' posts; admins see all
    if (req.user.role === 'manager') {
      const admins = await User.find({ role: 'admin' }).select('_id');
      const adminIds = admins.map((admin) => admin._id);
      filter.author = { $in: [req.user._id, ...adminIds] };
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/posts
 * Create a new post. Author is the authenticated user.
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const post = await Post.create({
      title,
      description,
      author: req.user._id,
    });

    await post.populate('author', 'name email');

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/posts/:id
 * Update a post. Only the author can update their own post.
 */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check: only the author can edit
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    const { title, description } = req.body;

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;

    await post.save();
    await post.populate('author', 'name email');

    res.json({ post });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/posts/:id
 * Delete a post. Only the author can delete their own post.
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check: only the author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};
