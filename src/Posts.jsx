import axios from "axios";
import React, { useEffect, useState } from "react";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState(null); // for comment modal

  // ✅ 1. Profile picture lookup helper
  const getProfilePic = (username) => {
    const pics = {
      alice_wonder: "src/assets/Profile2.png",
      mark_92: "src/assets/Profile3.png",
      "Sharu-20": "src/assets/Sharu.Photo1.jpeg",
      john_doe: "src/assets/Profile1.png",
      mia_travels: "src/assets/Profile2.png",
      foodie_ron: "src/assets/Profile3.png",
      tech_sam: "src/assets/Profile4.png",
      nature_lisa: "src/assets/Profile5.png",
    };
    return pics[username] || "src/assets/defaultUser.png";
  };

  // ✅ 2. Fetch posts & add profile pics to comments dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRes = await fetch("http://localhost:3000/posts");
        const postsData = await postsRes.json();

        const updatedPosts = postsData.map((post) => ({
          ...post,
          comments: post.comments.map((comment) => ({
            ...comment,
            profile_pic: comment.profile_pic || getProfilePic(comment.user),
          })),
        }));
        setPosts(updatedPosts);

        const profileRes = await fetch("http://localhost:3000/profile");
        const profileData = await profileRes.json();
        setProfile(profileData);
      } catch (err) {
        console.log("Error fetching:", err);
      }
    };
    fetchData();
  }, []);

  const getFormattedTime = () =>
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // ✅ 3. Add new comment (auto adds profile pic)
    const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    const post = posts.find((p) => p.id == postId);
    if (!post) return;

    const newCommentData = {
      user: profile?.username || "you",
      profile_pic: getProfilePic(profile?.username),
      comment: newComment,
      time: getFormattedTime(),
    };

    const updatedComments = [...(post.comments || []), newCommentData];

    try {
      // ✅ Save to backend (JSON server)
      await axios.patch(`http://localhost:3000/posts/${postId}`, {
        comments: updatedComments,
      });

      // ✅ Update local post list
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id == postId ? { ...p, comments: updatedComments } : p
        )
      );

      // ✅ Update modal post immediately
      setSelectedPost((prev) =>
        prev && prev.id == postId ? { ...prev, comments: updatedComments } : prev
      );

      // ✅ Clear input
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ✅ Like notification logic stays same
  const addLikeNotification = async (postId, postImage, user) => {
    await fetch("http://localhost:3000/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "like",
        fromUser: user.username,
        fromUserPic: user.profile_pic,
        postId,
        postImage,
        time: new Date().toISOString(),
        read: false,
      }),
    });
  };

  const removeLikeNotification = async (postId, postImage, username) => {
    const res = await fetch("http://localhost:3000/notifications");
    const notifications = await res.json();

    const notification = notifications.find(
      (n) => n.type === "like" && n.fromUser === username && n.postId === postId
    );

    if (notification) {
      await fetch(`http://localhost:3000/notifications/${notification.id}`, {
        method: "DELETE",
      });
    }
  };

  const handleLike = async (postId) => {
    if (!profile) return;

    const post = posts.find((post) => post.id === postId);
    if (!post) return;

    let likedBefore = post.likes.includes(profile.id);
    let updatedLikes;

    if (likedBefore) {
      updatedLikes = post.likes.filter((id) => id !== profile.id);
      await removeLikeNotification(postId, post.image, profile.username);
    } else {
      updatedLikes = [...post.likes, profile.id];
      await addLikeNotification(postId, post.image, profile);
    }

    await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: updatedLikes }),
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: updatedLikes } : p
      )
    );
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setNewComment("");
  };

  // ✅ 4. Render UI
  return (
    <div className="d-flex justify-content-center flex-column align-items-center">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            className="my-3 p-3 border rounded shadow-sm bg-white"
            key={post.id}
            style={{ width: "420px" }}
          >
            <div className="d-flex align-items-center mb-2">
              <img
                className="rounded-circle"
                src={post.user.profile_pic}
                alt="Profile Pic"
                width="40"
                height="40"
              />
              <h6 className="ms-2 mt-2">{post.user.username}</h6>
            </div>

            <img
              src={post.image}
              alt="post"
              className="w-100 rounded"
              style={{ height: "auto" }}
            />

            <div className="post-icons mt-2">
              <i
                className={`bi ${
                  post.likes.includes(profile?.id)
                    ? "bi-heart-fill text-danger"
                    : "bi-heart"
                } me-3 fs-5`}
                onClick={() => handleLike(post.id)}
                style={{ cursor: "pointer" }}
              ></i>

              <i
                className="bi bi-chat fs-5"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedPost(post)}
              ></i>
              <i className="bi bi-send fs-5 ms-1"></i>
            </div>

            <div className="mt-1 fw-bold">{post.likes.length} likes</div>
            <p className="mb-1">
              <b>{post.user.username}</b> {post.caption}
            </p>
          </div>
        ))
      ) : (
        <div>Loading Posts...</div>
      )}

      {/* ✅ Comment Modal */}
      {selectedPost && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#000",
              borderRadius: "10px",
              overflow: "hidden",
              width: "70%",
              height: "80%",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* LEFT IMAGE */}
            <div
              style={{
                flex: 1.2,
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedPost.image}
                alt="post"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* RIGHT COMMENTS */}
            <div
              style={{
                flex: 0.8,
                backgroundColor: "#000",
                color: "white",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  borderBottom: "1px solid #262626",
                  flexShrink: 0,
                }}
              >
                <img
                  src={selectedPost.user.profile_pic}
                  alt="profile"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <strong>{selectedPost.user.username}</strong>
                <i
                  className="bi bi-x-lg"
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "20px",
                    cursor: "pointer",
                    color: "#999",
                  }}
                  onClick={handleCloseModal}
                ></i>
              </div>

              <div
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedPost.comments?.length ? (
                  selectedPost.comments.map((comment, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: "15px",
                      }}
                    >
                      <img
                        src={comment.profile_pic}
                        alt="user"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <p style={{ margin: 0 }}>
                          <strong>{comment.user}</strong>{" "}
                          <span style={{ color: "#e0e0e0" }}>
                            {comment.comment}
                          </span>
                        </p>
                        <small style={{ color: "#888" }}>
                          {comment.time || comment.timestamp || ""}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#888" }}>No comments yet.</p>
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid #262626",
                  padding: "10px 15px",
                  flexShrink: 0,
                  backgroundColor: "#000",
                }}
              >
                <p style={{ margin: "5px 0", color: "#ddd" }}>
                  ❤️ {selectedPost.likes.length} likes
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid #333",
                      color: "white",
                      outline: "none",
                      padding: "8px 5px",
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0095f6",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;
