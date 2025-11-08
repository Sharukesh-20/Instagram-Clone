import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MoreMenu from './MoreMenu';

function Sidebar() {

  const navigate = useNavigate();
  const [showMore,setShowMore] = useState(false);
  const moreRef = useRef(null);

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if(moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    };
    document.addEventListener('mousedown',handleClickOutside);
    return () => document.removeEventListener('mousedown',handleClickOutside);
  },[])

  return (
    <div className='m-4 position-fixed'>
        <div className='d-flex flex-column gap-3'>
            <img className= "logo-text" src="src/assets/instagram_text.png"/>
            <div style={{ cursor: "pointer" }}><i className="bi bi-house-door"></i>Home</div>
            <div onClick={() => {navigate('/search')}} style={{ cursor: "pointer" }}><i className="bi bi-search"></i>Search</div>
            <div onClick={() => {navigate('/explore')}} style={{ cursor: "pointer" }}><i className="bi bi-compass"></i>Explore</div>
            <div onClick={() => {navigate('/reels')}} style={{ cursor: "pointer" }}><i className="bi bi-play-btn"></i>Reels</div>
            <div onClick={() => {navigate('/message')}} style={{ cursor: "pointer" }}><i className="bi bi-chat-dots"></i>Messages</div>
            <div onClick={() => {navigate('/notifications')}} style={{ cursor: "pointer" }}><i className="bi bi-heart"></i>Notification</div>
            <div onClick={() => {navigate('/create')}} style={{ cursor: "pointer" }}><i className="bi bi-plus-square"></i>Create</div>
            <div onClick={() => {navigate('/profile')}} style={{ cursor: "pointer" }}><i className="bi bi-person-circle"></i>Profile</div>
        </div>
        
      {/* Bottom Section */}
      <div className="d-flex flex-column gap-3 mb-3 position-fixed bottom-0" ref={moreRef}>
        <div onClick={() => setShowMore(!showMore)} style={{ cursor: "pointer" }}>
          <i className="bi bi-list"></i> More
        </div>
        <div style={{ cursor: "pointer" }}><img src="src/assets/Threads.webp" alt="Threads" width="20" height="20" /> Threads </div>

        {/* ✅ Popup menu appears near the “More” button */}
        {showMore && <MoreMenu />}
      </div>
    </div>
  );
}

export default Sidebar;