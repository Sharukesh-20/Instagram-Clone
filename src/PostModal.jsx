import axios from 'axios';
import React, { useEffect, useState } from 'react';

function PostModal({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (post?.id) {
      fetch(`http://localhost:3000/comments?postId=${post.id}`)
        .then(res => res.json())
        .then(data => setComments(data))
        .catch(err => console.log(err));
    }
  }, [post]);

 const handleAddComment = async () => {
  if (!newComment.trim()) return;

  const newCommentData = {
    id: crypto.randomUUID(),
    postId: post.id,
    username: "you", // ✅ just use your name for now
    profile_pic: "src\\assets\\Sharu.Photo1.jpeg", // ✅ use your profile pic path
    text: newComment,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
  };

  try {
    await axios.post('http://localhost:3000/comments', newCommentData);
    setComments(prev => [...prev, newCommentData]);
    setNewComment("");
  } catch (err) {
    console.error("Error adding comment:", err);
  }
};

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
      style={{ zIndex: 1050 }}
      onClick={onClose} // click outside to close
    >
      <div
        className="bg-white rounded d-flex shadow-lg"
        style={{ width: "80%", height: "80%" }}
        onClick={e => e.stopPropagation()} // prevent closing when clicking inside
      >
       {/* Left: Post Image */}
      <div className="w-50 h-100">
        <img
          src={post.image}
          alt="Post"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "0.5rem",
            borderBottomLeftRadius: "0.5rem",
            outline: "none",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            display: "block",
          }}
        />
      </div>

        {/* Right: Comments Section */}
        <div className="w-50 d-flex flex-column justify-content-between">
          {/* Header */}
          <div className="d-flex align-items-center border-bottom p-3">
            <img
              src={post.profile_pic}
              alt=""
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <strong>{post.username}</strong>
            <button className="btn-close ms-auto" onClick={onClose}></button>
          </div>

          {/* Comments List */}
          <div className="p-3 overflow-auto" style={{ flex: 1 }}>
            {comments.length > 0 ? (
              comments.map((c, i) => (
                <div key={i} className="d-flex align-items-start mb-2">
                  <img
                    src={c.profile_pic} // make sure every comment has this
                    alt={c.username}
                    className="rounded-circle me-2"
                    style={{ width: "35px", height: "35px", objectFit: "cover" }}
                  />
                  <div>
                    <strong>{c.username}</strong> {c.text}
                    <div className="small text-muted">{c.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No comments yet</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="d-flex border-top p-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddComment}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;