import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Notifications() {

const [notification,setNotification] = useState([]);

const navigate = useNavigate();

useEffect(() => {
  fetch('http://localhost:3000/notifications')
  .then(data => data.json())
  .then(data => setNotification(data))
  .catch(err => console.log(err))
},[])

  // ✅ Add Like/Unlike Notification

   /*  const addLikeNotification = async (postId,postImage,user) => {
    await fetch('http://localhost:3000/notifications',{
      method: 'POST',
      headers: {"content-type": "application/json"},
      body: JSON.stringify({
        type:"like",
        fromUser:user.username,
        fromUserPic:user.profile_pic,
        postId,
        postImage,
        time:new Date().toISOString(),
        read:false
      })
    });
  };

  const removeLikeNotification = async (postId,username) => {
    const nofi = await fetch('http://localhost:3000/notifications');
    const notifications = await nofi.json();

    const notification = notifications.find(
      n => n.type === 'like' && n.fromUser === username && n.postId === postId
    );
    if (notification) {
      await fetch(`http://localhost:3000/notifications/${notification.id}`,{
        method:'DELETE'
      });
      setNotification(prev => prev.filter(n => n.id !== notification.id));
    }
  };  */
 
  return (
    <div>
      {notification.length > 0 ? (
       notification.map(notion => (
      <div key={notion.id} className='d-flex align-items-center my-2'>
          {/* Profile Pic */}
          {notion.fromUserPic && (
            <img src= {notion.fromUserPic} alt = 'profile' className='messages rounded-circle'/>
          )}
          {/* Notification Text */}
          <div>
            {notion.type ==='follow' && (
            <p><b>{notion.fromUser}</b>started Following You.<small>{notion.time}</small></p>
            )}
            {notion.type === 'unfollow' && (
              <p><b>{notion.fromUser}</b>UnFollowed You.<small>{notion.time}</small></p>
            )}
            {notion.type === 'like' && (
              <p><b>{notion.fromUser}</b>Liked Your Post.<small>{notion.time}</small></p>
            )}
            {notion.type === 'comment' && (
              <p><b>{notion.fromUser}</b>Commented:"{notion.comment}"{''}<small>{notion.time}</small></p>
            )}
          </div>
          {/*Showing post image for likes/comments */}
           {(notion.type === 'like' || notion.type === 'comment') &&
           notion.postImage && (
            <img 
            src = {notion.postImage} alt='post' className='rounded ms-2' style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            onClick={() => navigate(`/post/${notion.postId}`)}
            />
           )}
      </div>
       ))
      ):(
        <div>
          Loading Notifications
        </div>
    )}
    </div>
  )
}

export default Notifications;