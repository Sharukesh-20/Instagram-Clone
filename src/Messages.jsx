import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Messages() {
    const [profile,setProfile] = useState(null);
    const [followers,setFollowers] = useState([]);
    const [message,setMessage] = useState([]);
    const [newMessage,setNewMessage] = useState("");
    const [selectedUser,setSelectedUser] = useState(null); //WITH WHOM WE ARE CHATTING WITH
    const navigate = useNavigate();

    useEffect(() => {

      fetch('http://localhost:3000/profile')
      .then(data => data.json())
      .then(data => setProfile(data))
      .catch(err => console.log(err))

      fetch('http://localhost:3000/followers')
      .then(data => data.json())
      .then(data => setFollowers(data))
      .catch(err => console.log(err))

      fetch('http://localhost:3000/message')
      .then(data => data.json())
      .then(data => setMessage(data))
      .catch(err => console.log(err))
    },[]);

    const getChatMessages = () => {
      if(!selectedUser || !profile) return[];
      return message.filter(
        (m) => 
        (m.senderId === profile.id && m.receiverId === selectedUser.id) ||
        (m.receiverId === profile.id && m.senderId === selectedUser.id)
      );
    };

    const handleSend = async () => {
  if (!newMessage.trim() || !profile || !selectedUser) return;

  const newMsg = {
    id: Date.now(),
    senderId: profile.id,
    receiverId: selectedUser.id,
    text: newMessage,
    time: new Date().toISOString(),
  };

  try {
    await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });

    setMessage((prev) => [...prev, newMsg]);
    setNewMessage("");

 // 🕒 Simulate a reply after 1.5 seconds
    setTimeout(() => {
      const reply = {
        id:Date.now() + 1,
        senderId: selectedUser.id,
        receiverId: profile.id,
        text: "Got it!",
        time: new Date().toISOString(),
      };
      setMessage((prev) => [...prev,reply]);

 // ✅ After reply is received, mark last sent message as seen

    setTimeout(() => {
      setMessage((prev) =>
       prev.map((msg) =>
        msg.id === newMsg.id ? {...msg,seen:true} : message
      )
      );
    },1000);
    },1500);
  } catch (err) {
    console.error("Error sending message:",err);
  }
};

  return (
    <div className='d-flex' style={{height:"100vh"}}>
      {/* Left panel - followers list */}
      <div className='border-end p-3' style={{width:"30%",overflowY:"auto"}}>
        <h5 className='mb-3'>Chats</h5>
        {followers.map((user) => (
          <div key={user.id} className='d-flex align-items-center mb-2 p-2 rounded hover-bg-light' style={{cursor:'pointer'}} onClick={() => setSelectedUser(user)}>
            <img
             src={user.profile_pic}
             alt ={user.username}
             className='rounded-circle me-2'
             width="40"
             height="40"
            />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
       {/* Right panel - chat area */}
       <div className='flex-grow-1 p-3'>
       {selectedUser ? (
          <>
            <h5 className="mb-3 border-bottom pb-2">
              Chat with {selectedUser.username}
            </h5>
            <div style={{ height: "75vh", overflowY: "auto" }}>
              {/* Message input */}
              <div className='d-flex mt-3'>
                <input 
                type='text'
                className='form-control me-2'
                placeholder='Type a message...'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className='btn btn-primary' onClick={handleSend}>
                  Send
                </button>
              </div>
              {getChatMessages().map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${
                    msg.senderId === profile.id ? "justify-content-end" : "justify-content-start"
                  } mb-2`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.senderId === profile.id ? "bg-primary text-white" : "bg-light"
                    }`}
                    style={{ maxWidth: "60%" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-5 text-muted">
            <b>Select a user to start chatting</b>
          </div>
        )}

       </div>
    </div>
  );
}

export default Messages;