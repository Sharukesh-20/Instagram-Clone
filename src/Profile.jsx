import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Posts from './Posts'; // adjust the path according to your folder structure
import ProfileTabs from "./ProfileTabs";
import Footer from "./Footer";
import PostModal from "./PostModal";



function Profile() {

  const [profile,setProfile] = useState(null);
  const [followers,setFollowers] = useState([]);
  const [following,setFollowing] = useState([]);
  const [unfollowed,setUnFollowed] = useState(0);
  const [isEditing,setIsEditing] = useState(false);
  const [activeTab,setActiveTab] = useState("posts");
  const [selectedPost,setSelectedPost] = useState(null);
  const [showSettings,setShowSettings] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/profile')
    .then(data => {setProfile(data.data); console.log(data)})
    .catch(err => console.log(err))

    axios.get('http://localhost:3000/followers')
    .then(data => setFollowers(data.data))
    .catch(err => console.log(err))

    axios.get('http://localhost:3000/following')
    .then(data => setFollowing(data.data))
    .catch(err => console.log(err))

  },[unfollowed])

  function HandleOnChange (e) {
    setProfile(prev => ({
      ...prev,
      [e.target.name] : e.target.value,
    }));
  };

     const handleUpdate = async () => {
     axios.put('http://localhost:3000/profile', profile)
    .then(() => console.log("Updated"))
    .catch(err => console.log(err));
  }
  
  /* const handleUnFollow = async (id) => {
    axios.delete(`http://localhost:3000/followers/${id}`)
    .then(alert('UnFollwed'))
    .then(setUnFollowed(!unfollowed))
    .catch(err => console.log(err))
  } */

    const handleUnFollow = async (id,username,profilepic) => {
      try {
        await axios.delete(`http://localhost:3000/followers/${id}`);

        await axios.post('http://localhost:3000/notifications', {
          type:"unfollow",
          fromUser:username,
          fromUserPic:profilepic,
          time:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read:false
        });
        alert('UnFollowed');
        setUnFollowed(!unfollowed);
      } catch (err){
        console.log(err);
      }
    };

  return (
      <div className="container py-4">
      {profile ? (
        <>
          {/* 👤 Profile Info Section */}
          <div className="d-flex align-items-center justify-content-start mb-4">
            {/* Profile Picture */}
            <img
              src={profile.profile_pic}
              className="rounded-circle me-4"
              alt="Profile"
              style={{
                width: "110px",
                height: "110px",
                objectFit: "cover",
                border: "2px solid #ccc",
              }}
            />

            {/* Username + Stats */}
            <div>
              <div className="d-flex align-items-center gap-2">
              <h4 className="fw-semibold mb-2">{profile.username}</h4>
              <i
                className="bi bi-gear-wide fs-5"
                style={{ cursor: "pointer" }}
                onClick={() => setShowSettings(true)}
              ></i>
            </div>
              <div className="d-flex gap-4 text-muted">
                <span>
                  <strong>{profile.posts?.length || 0}</strong> posts
                </span>
                <span>
                  <strong>{followers.length}</strong> followers
                </span>
                <span>
                  <strong>{following.length}</strong> following
                </span>
              </div>
            </div>
          </div>

          {/* ✏️ Edit Profile Button */}
          <div className="text">
            <button
              className="btn btn-primary my-3"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <i className="bi bi-caret-left-fill"></i>
              ) : (
                "Edit Profile"
              )}
            </button>
          </div>

          {/* Editing Fields */}
          {isEditing && (
            <div className="my-3">
              <input
                type="text"
                value={profile.username}
                name="username"
                className="form-control mb-3"
                onChange={HandleOnChange}
              />

              <input
                type="text"
                value={profile.profile_pic}
                name="profile_pic"
                className="form-control mb-3"
                onChange={HandleOnChange}
              />
              <button className="btn btn-success" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          )}

          {/* ➕ Story Section */}
           <div className="d-flex flex-column align-items-start text-center mb-4">
            <div className="d-flex align-items-start justify-content-center gap-4">
              {/* New Story Circle */}
              <div className="d-flex flex-column align-items-center">
               <div>
                  <i className="bi bi-plus-circle fs-1"></i> 
              </div>
                <span className="text-muted mt-1">New</span>
              </div>
              </div>
          </div>


          {/* 🔹 Bottom Tab Navigation */}
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
          {/* 🔹 Tab Content */}
          <div className="mt-4 text-center">
            {/* POSTS */}
            {activeTab === "posts" && (
              (!profile.posts || profile.posts.length === 0) ? (
                <p className="text-muted">No posts yet</p>
              ) : (
                <div className="row g-1">
                  {profile.posts.map((post, index) => (
                    <div
                      className="col-2"
                      key={index}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          height: "130%", 
                          overflow: "hidden",
                          borderRadius: "2px",
                        }}
                      >
                        <img
                          src={post.image}
                          alt={`Post ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* SAVED */}
            {activeTab === "saved" && (
              <div className="text-center py-5">
                <i className="bi bi-bookmark fs-1 mb-3"></i>
                <h4 className="fw-bold">Save</h4>
                <p className="text-muted">
                  Save photos and videos that you want to see again. <br />
                  Only you can see what you've saved.
                </p>
              </div>
            )}

            {/* TAGGED */}
            {activeTab === "tagged" && (
              <div className="text-center py-5">
                <i className="bi bi-person fs-1 mb-3"></i>
                <h4 className="fw-bold">Photos of you</h4>
                <p className="text-muted">
                  When people tag you in photos, they’ll appear here.
                </p>
              </div>
            )}
          </div>

          {/* 👥 Followers Section */}
          <div style={{marginTop:"100px"}}>
          <h5 className="mt-5 mb-3">Followers</h5>
          {followers.length > 0 ? (
            followers.map((follower) => (
              <div key={follower.id} className="d-flex align-items-center my-2">
                <img
                  src={follower.profile_pic}
                  alt={follower.username}
                  className="rounded-circle me-3"
                  style={{
                    width: "45px",
                    height: "45px",
                    objectFit: "cover",
                  }}
                />
                <span>{follower.username}</span>
                <button
                  className="btn btn-secondary ms-auto"
                  onClick={() =>
                    handleUnFollow(
                      follower.id,
                      follower.username,
                      follower.profile_pic
                    )
                  }
                >
                  Unfollow
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted">No followers yet</p>
          )}
        </div>
        </>
      ) : (
        <p>Loading Profile...</p>
      )}
       {selectedPost && (
          <PostModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
          />
        )}
        {/* ⚙️ Settings Modal */}
          {showSettings && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
              style={{ zIndex: 1050 }}
              onClick={() => setShowSettings(false)}
            >
              <div
                className="bg-white rounded shadow p-3"
                style={{ width: "350px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <h6 className="text-center fw-bold mb-3">Settings</h6>
                <ul className="list-unstyled mb-0">
                  <li className="py-2 border-bottom text-center">Apps and Websites</li>
                  <li className="py-2 border-bottom text-center">QR Code</li>
                  <li className="py-2 border-bottom text-center">Notifications</li>
                  <li className="py-2 border-bottom text-center">Settings and Privacy</li>
                  <li className="py-2 border-bottom text-center">Supervision</li>
                  <li className="py-2 border-bottom text-center">Login Activity</li>
                  <li className="py-2 border-bottom text-center text-danger">Log Out</li>
                  <li
                    className="py-2 text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowSettings(false)}
                  >
                    Cancel
                  </li>
                </ul>
              </div>
            </div>
          )}
      <Footer />
    </div>
  )
}

export default Profile;