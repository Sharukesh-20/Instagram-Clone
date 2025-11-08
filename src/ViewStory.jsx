import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaLaugh,
  FaSurprise,
  FaSadTear,
  FaFire,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

function ViewStory() {
  const { id, tot } = useParams();
  const [story, setStory] = useState(null);
  const [message, setMessage] = useState("");
  const [reaction, setReaction] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const navigate = useNavigate();

  // Fetch story
  useEffect(() => {
    fetch(`http://localhost:3000/story/${id}`)
      .then((data) => data.json())
      .then((data) => setStory(data))
      .catch((err) => console.error(err));
  }, [id]);

  // Redirect invalid id
  useEffect(() => {
    if (!tot) return;
    if (Number(id) > Number(tot) || Number(id) <= 0) navigate("/");
  }, [id, tot, navigate]);

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

  const handleReaction = async (emoji) => {
    try {
      setReaction(emoji);
      await axios.post("http://localhost:3000/storyReactions", {
        storyId: story.id,
        userId: story.user?.id || "unknown",
        reaction: emoji,
        timestamp: getFormattedTime(),
      });
    } catch (err) {
      console.error("Error saving reaction:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post("http://localhost:3000/storyReplies", {
        storyId: story.id,
        userId: story.user?.id || "unknown",
        message,
        timestamp: getFormattedTime(),
      });
      setMessage("");
      setShowQuickReactions(false);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      await axios.post("http://localhost:3000/storyLikes", {
        storyId: story.id,
        userId: story.user?.id || "unknown",
        liked: newLiked,
        timestamp: getFormattedTime(),
      });
    } catch (err) {
      console.error("Error saving like:", err);
    }
  };

  if (!story) {
    return (
      <div className="text-center text-white bg-black vh-100 d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
  }

  /* Styles used inline for portability (feel free to move to CSS file) */
  const pageStyle = {
    background: "#000",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  /* Story card: responsive width/height (like mobile story within center column) */
  const cardStyle = {
    width: "min(420px, 86vw)",
    height: "min(820px, 92vh)",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    background: "#000",
    boxShadow: "0 6px 30px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const topBarGradient = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 6,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0))",
  };

  const navArrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 6,
    cursor: "pointer",
    userSelect: "none",
  };

  const replyBoxWrapper = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    display: "flex",
    justifyContent: "center",
    zIndex: 8,
    pointerEvents: "none", // wrapper doesn't block clicks; inner does
  };

  const replyBox = {
    pointerEvents: "auto",
    width: "90%",
    maxWidth: "360px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "40px",
    background: "rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(6px)",
    transition: "transform 220ms ease, opacity 220ms ease",
    transform: message || showQuickReactions ? "translateY(0)" : "translateY(8px)",
    opacity: 1,
  };

  const quickOverlayStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.55)",
  };

  return (
    <div style={pageStyle}>
      {/* CENTERED STORY CARD */}
      <div style={cardStyle}>
        {/* Story image (keeps full card size) */}
        <img
          src={story.image}
          alt="story"
          style={imgStyle}
          onClick={() => {
            /* optional: hide quick reactions when tapping the card */
            if (showQuickReactions) setShowQuickReactions(false);
          }}
        />

        {/* Top bar inside card */}
        <div style={topBarGradient}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={story.user?.profile_pic || "/assetss/default.png"}
              onError={(e) => (e.target.src = "/assetss/default.png")}
              alt="dp"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.12)",
                background: "#fff",
              }}
            />
            <div style={{ color: "#fff", fontWeight: 700 }}>{story.user?.username}</div>
          </div>

          <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <FaTimes size={20} />
          </div>
        </div>

        {/* Left Nav */}
        {Number(id) > 1 && (
          <Link
            to={`/story/${Number(id) - 1}/${tot}`}
            style={{ ...navArrowStyle, left: 8, color: "#fff", zIndex: 7 }}
          >
            <i className="bi bi-chevron-left" style={{ fontSize: "28px" }} />
          </Link>
        )}

        {/* Right Nav */}
        {Number(id) < Number(tot) && (
          <Link
            to={`/story/${Number(id) + 1}/${tot}`}
            style={{ ...navArrowStyle, right: 8, color: "#fff", zIndex: 7 }}
          >
            <i className="bi bi-chevron-right" style={{ fontSize: "28px" }} />
          </Link>
        )}

        {/* Quick Reactions overlay (centered over card) */}
        {showQuickReactions && (
          <div style={quickOverlayStyle} onClick={() => setShowQuickReactions(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: "20px",
                borderRadius: 20,
                // background: "rgba(0,0,0,0.65)",
                background:"transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                gap: 14,
                alignItems: "center",
                zIndex: 11,
              }}
            >
              {["😂", "😍", "😮", "😢", "👏", "🔥", "🎉", "💯"].map((emoji) => (
                <span
                  key={emoji}
                  onClick={() => {
                    handleReaction(emoji);
                    setShowQuickReactions(false);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: 26,
                    transition: "transform 140ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reply box (inside card at bottom center) */}
        <div style={replyBoxWrapper}>
          <div style={replyBox}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setShowQuickReactions(true)}
              placeholder={`Reply to ${story.user?.username}...`}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#fff",
                fontSize: 15,
              }}
            />

            <button
              onClick={handleLike}
              style={{
                height: 36,
                width: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: liked ? "dodgerblue" : "#fff",
              }}
              aria-label="like"
            >
              <FaHeart />
            </button>

            <button
              onClick={handleSendMessage}
              style={{
                padding: "6px 12px",
                borderRadius: 18,
                border: "none",
                background: "#fff",
                color: "#000",
                fontWeight: 600,
                cursor: "pointer",
                marginLeft: 4,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStory;
