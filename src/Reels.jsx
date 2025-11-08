import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Reels() {
  const navigate = useNavigate();
  const [reels, setReels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/reels")
      .then((res) => res.json())
      .then((data) => setReels(data))
      .catch((err) => console.log("Error fetching reels:", err));
  }, []);

  return (
    <div
      className="reels-container"
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        backgroundColor: "black",
        cursor: "pointer",
      }}
    >
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  );
}

function ReelCard({ reel }) {
  const videoRef = useRef();
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(reel.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(reel.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showSharePopup,setShowSharePopup] = useState(false);
  const [following,setFollowing] = useState([]);

  // 🎥 Auto play/pause when reel is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) videoRef.current.play();
          else videoRef.current.pause();
        });
      },
      { threshold: 0.8 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/following')
    .then(data => data.json())
    .then(data => setFollowing(data))
    .catch(err => console.log(err))
  },[])

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

  // ❤️ Handle like
  const handleLike = async () => {
    const updatedLikes = liked ? likes - 1 : likes + 1;
    setLiked(!liked);
    setLikes(updatedLikes);

    try {
      await fetch(`http://localhost:3000/reels/${reel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikes }),
      });
    } catch (err) {
      console.log("Error updating Likes:", err);
    }
  };

  // 💬 Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentData = {
      id: crypto.randomUUID(),
      username: "you",
      profile_pic: "src/assets/Sharu.Photo1.jpeg",
      text: newComment,
      time: getFormattedTime()
    };

    const updatedComments = [...comments, newCommentData];
    setComments(updatedComments);
    setNewComment("");

    try {
      await fetch(`http://localhost:3000/reels/${reel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: updatedComments }),
      });
    } catch (err) {
      console.log("Error updating comments:", err);
    }
  };

  return (
    <div
      className="reel-card d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        position: "relative",
        scrollSnapAlign: "start",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      {/* 🎥 Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted={isMuted}
        style={{
          width: "38%",
          height: "90%",
          objectFit: "cover",
          objectPosition: "center center",
          borderRadius: "10px",
        }}
      />

      {/* ⚙️ Right-side buttons */}
      <div
        className="reel-actions d-flex flex-column align-items-center"
        style={{
          position: "absolute",
          right: "32%",
          bottom: "120px",
          color: "white",
          gap: "18px",
          paddingBottom: "50px",
        }}
      >
        {/* ❤️ Like */}
        <div
          className="text-center"
          onClick={handleLike}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`bi ${
              liked ? "bi-heart-fill text-danger" : "bi-heart"
            } fs-3`}
            style={{ transition: "0.2s" }}
          ></i>
          <div style={{ fontSize: "13px" }}>{likes}K</div>
        </div>

        {/* 💬 Comment */}
        <div
          className="text-center"
          style={{ cursor: "pointer" }}
          onClick={() => setShowComments(true)}
        >
          <i className="bi bi-chat fs-3"></i>
          <div style={{ fontSize: "13px" }}>{comments.length}</div>
        </div>

        {/* 📤 Share */}
        <div
          className="text-center"
          style={{ cursor: "pointer" }}
          onClick={() => setShowSharePopup(true)}
        >
          <i className="bi bi-send fs-3"></i>
        </div>

        {/* 💾 Save */}
        <div
          className="text-center"
          onClick={() => setSaved(!saved)}
          style={{ cursor: "pointer" }}
        >
          <i
            className={`bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"} fs-3`}
          ></i>
        </div>
      </div>

      {/* 🧾 Bottom Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "38%",
          color: "white",
          padding: "10px 15px",
          boxSizing: "border-box",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={"src/assets/ReelProfile.jpeg"}
            alt="profile"
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span style={{ fontWeight: "300" }}>chennaiipl</span>
          <span
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "2px 10px",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            Following
          </span>

          {/* 🔊 Volume toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              backgroundColor: "rgba(255, 254, 254, 0.26)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "black",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {isMuted ? (
              <i className="bi bi-volume-mute fs-6"></i>
            ) : (
              <i className="bi bi-volume-up fs-6"></i>
            )}
          </button>
        </div>

        {/* Caption */}
        <div style={{ paddingBottom: "10px" }}>
          <p
            style={{
              marginTop: "8px",
              marginBottom: "6px",
              fontSize: "15px",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {reel.caption}
          </p>

          {/* 🎵 Original Audio */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "13px",
              opacity: "0.9",
            }}
          >
            <i className="bi bi-music-note-beamed"></i>
            <span>
              <button
                style={{
                  backgroundColor: "rgba(255, 254, 254, 0.26)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                Original audio
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* 💬 Comment Popup */}
      {showComments && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:"transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "400px",
              maxHeight: "500px",
              backgroundColor: "white",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h6 style={{ margin: 0 }}>Comments</h6>
              <button
                onClick={() => setShowComments(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            {/* Comments List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <img
                      src={comment.profile_pic || "src/assets/Profile1.png"}
                      alt="user"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: "13px" }}>
                        {comment.username}
                      </strong>
                      <p style={{ margin: 0, fontSize: "13px" }}>
                        {comment.text}
                      </p>
                      <small style={{ color: "#000000e8" }}>
                          {comment.time || comment.timestamp || ""}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "#555" }}>
                  No comments yet
                </p>
              )}
            </div>

            {/* Add Comment Input */}
            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  border: "1px solid #ccc",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  fontSize: "13px",
                }}
              />
              <button
                onClick={handleAddComment}
                style={{
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "20px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}{/* 📤 Share Popup */}
      {showSharePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "320px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 15px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#f8f8f8",
              }}
            >
              <h6 style={{ margin: 0 }}>Share Reel</h6>
              <button
                onClick={() => setShowSharePopup(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            {/* Following list */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {following.length > 0 ? (
                following.map((person) => (
                  <div
                    key={person.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 0",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={person.profile_pic}
                      alt={person.username}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {person.username}
                    </span>
                    <button
                      style={{
                        marginLeft: "auto",
                        backgroundColor: "#0095f6",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        padding: "4px 10px",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      Send
                    </button>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#888",
                  }}
                >
                  No following users found
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #eee", marginTop: "10px" }} />

            {/* Share Options */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "10px 0",
              }}
            >
            {[
  { icon: "bi-link-45deg", label: "Copy Link" },
  { icon: "bi-facebook", label: "Facebook" },
  { icon: "bi-whatsapp", label: "WhatsApp" },
  { icon: "bi-messenger", label: "Messenger" },
  { icon: "bi-envelope", label: "Email" },
  { icon: null, label: "Threads", img: "src/assets/Threads.webp" },
              ].map((opt, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#333",
                    cursor: "pointer",
                  }}
                >
                  {opt.icon ? (
                    <i className={`bi ${opt.icon} fs-5`}></i>
                  ) : (
                    <img
                      src={opt.img}
                      alt={opt.label}
                      style={{ width: "30px", height: "27px", objectFit: "contain" }}
                    />
                  )}
                  <span>{opt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Reels;
