import { useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data.posts);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/posts', { title, description });
      setPosts([res.data.post, ...posts]);
      setTitle('');
      setDescription('');
      toast.success('Post created!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create post';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
      toast.success('Post deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete post';
      toast.error(msg);
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/posts/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      setPosts(posts.map((p) => (p._id === id ? res.data.post : p)));
      cancelEdit();
      toast.success('Post updated!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update post';
      toast.error(msg);
    }
  };

  return (
    <div className="page-container">
      <h1>Manager Dashboard</h1>

      {/* Create Post Form */}
      <div className="card">
        <h3>Create New Post</h3>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Post title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="post-description">Description</label>
            <textarea
              id="post-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Post description"
              rows={4}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>

      {/* Post List */}
      <div className="card">
        <h3>My Posts</h3>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted">No posts yet. Create your first post above.</p>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <div key={post._id} className="post-item">
                {editingId === post._id ? (
                  // Edit mode
                  <div className="post-edit">
                    <div className="form-group">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="post-actions">
                      <button
                        onClick={() => handleUpdate(post._id)}
                        className="btn btn-success btn-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="post-content">
                      <h4>{post.title}</h4>
                      <p>{post.description}</p>
                      <p className="text-muted text-sm">
                        By {post.author?.name} ·{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="post-actions">
                      <button
                        onClick={() => startEdit(post)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
