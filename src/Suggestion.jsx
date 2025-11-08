import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Suggestion() {
const [profile,setProfile] = useState(null);
const [suggestions,setSuggestions] = useState([]);

  useEffect(() => {

    fetch('http://localhost:3000/profile')
    .then(data => data.json())
    .then(data => setProfile(data))
    .catch(err => console.log(err))

     fetch('http://localhost:3000/suggestions')
    .then(data => data.json())
    .then(data => setSuggestions(data))
    .catch(err => console.log(err))

  },[]);

  /* const handleFollow = async (id,username) => {
    axios.post('http://localhost:3000/followers',{"id" : id,"username" : username})
    .then(alert('Followed'))
    .catch(err => console.log(err))
  } */

    const handleFollow = async(id,username,profilepic) => {
      try {
        await axios.post('http://localhost:3000/followers',{
          id:id,
          username:username,
          profile_pic:profilepic,
        });

        await axios.post('http://localhost:3000/notifications',{
          type:"follow",
          fromUser:username,
          fromUserPic:profilepic,
          time:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read:false
        });
        alert('Followed');
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div>
      <div className='suggestions m-4'>
        {profile ?
       <div className='d-flex'>
         <img className ="dp rounded-circle" src = {profile.profile_pic} alt ="Profile Pic"/>
         <h5>{profile.username}</h5>
         <small className='sug ms-auto text-primary'>Switch</small>
        </div>
        : <p>Loading</p> }
        <div className='d-flex'>
          <p>Suggested for you</p>
          <b className='sug ms-auto'>See All</b>
        </div>

           {suggestions.length > 0 ? (
        <div>
          {suggestions.map((suggestion) =>(
            <div key={suggestion.id}>
                <div className='d-flex'>
                  <img className ="dp rounded-circle" src = {suggestion.profile_pic} alt ="Profile Pic"/>
                  <h5>{suggestion.username}</h5>
                  <a className='text-primary ms-auto' onClick={() => {handleFollow(suggestion.id,suggestion.username,suggestion.profile_pic)}}>Follow</a>
                </div>
              </div>
          ))}
        </div>
      ):(
        <div>
          Loading
        </div>
      )}

      </div>
    </div>
  )
}

export default Suggestion