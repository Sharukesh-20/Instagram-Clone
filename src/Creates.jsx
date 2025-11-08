import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

function Creates() {
    const [create,setCreate] = useState([]);
    const navigate = useNavigate();
  return (
    <div>Create</div>
  )
}

export default Creates;