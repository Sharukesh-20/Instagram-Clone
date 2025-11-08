import React, { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom';

function Explores() {
  const [explore,setExplore] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/explore')
    .then(data => data.json())
    .then(data => setExplore(data))
    .catch(err => console.log(err))
  },[])
 
    const trendingPosts = explore.filter((item) => item.type === "trending_post");
    const suggestedUsers = explore.filter((item) => item.type === "suggested_user");
    const trendingReels = explore.filter((item) => item.type === "trending_reel");
  return (
    <div className="container mt-3">
      <h3 className="fw-bold mb-4 text-center">Explore</h3>

      {/* 🔥 Trending Posts Section */}
      <h5 className="fw-semibold mb-3">🔥 Trending Posts</h5>
      <div className="row">
        {trendingPosts.length > 0 ? (
          trendingPosts.map((item) => (
            <div key={item.id} className="col-4 mb-3">
              <div className="position-relative">
                <img
                  src={item.image}
                  alt={item.caption}
                  className="img-fluid rounded"
                  style={{
                    objectFit: "cover",
                    height: "200px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                />
                <div
                  className="position-absolute bottom-0 start-0 w-100 text-white px-2 py-1"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)",
                    fontSize: "0.85rem",
                  }}
                >
                  ❤️ {item.likes} • {item.postedBy}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No trending posts found.</p>
        )}
      </div>

      <hr className="my-4" />

      {/* 👥 Suggested Users Section */}
      <h5 className="fw-semibold mb-3">👥 Suggested Users</h5>
      <div className="row">
        {suggestedUsers.length > 0 ? (
          suggestedUsers.map((user) => (
            <div
              key={user.id}
              className="col-md-4 mb-3 d-flex align-items-center border rounded p-2 shadow-sm"
            >
              <img
                src={user.profile_pic}
                alt={user.username}
                className="rounded-circle me-3"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <div>
                <strong>{user.username}</strong>
                <br />
                <small className="text-muted">{user.reason}</small>
              </div>
              <button className="btn btn-sm btn-primary ms-auto">Follow</button>
            </div>
          ))
        ) : (
          <p className="text-muted">No suggested users right now.</p>
        )}
      </div>

      <hr className="my-4" />

      {/* 🎥 Trending Reels Section */}
      <h5 className="fw-semibold mb-3">🎥 Trending Reels</h5>
      <div className="row">
        {trendingReels.length > 0 ? (
          trendingReels.map((reel) => (
            <div key={reel.id} className="col-4 mb-3">
              <video
                src={reel.videoUrl}
                className="rounded w-100"
                height="220"
                controls
              />
              <p className="mt-1 small text-muted">{reel.caption}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No trending reels available.</p>
        )}
      </div>
    </div>
  );
}

export default Explores;