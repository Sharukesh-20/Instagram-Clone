import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

function MoreMenu() {
    const navigate = useNavigate();

  return (
    <div className='position-absolute bg-dark text-light p-3 rounded-4 shadow-lg'
    style={{
        bottom:"70px",
        left:"20px",
        width:"230px",
        zIndex:"999"
    }}>
        <div>
            <div className="menu-item" onClick={() => navigate('/settings')}>
            <i className="bi bi-gear"></i> Settings
            </div>
            <div className="menu-item" onClick={() => navigate('/activity')}>
            <i className="bi bi-clock-history"></i> Your activity
            </div>
            <div className="menu-item" onClick={() => navigate('/saved')}>
            <i className="bi bi-bookmark"></i> Saved
            </div>
            <div className="menu-item">
            <i className="bi bi-moon"></i> Switch appearance
            </div>
            <div className="menu-item">
            <i className="bi bi-exclamation-circle"></i> Report a problem
            </div>
            <hr className="border-secondary" />
            <div className="menu-item">
            <i className="bi bi-person"></i> Switch accounts
            </div>
            <div className="menu-item" onClick={() => navigate('/login')}>
            <i className="bi bi-box-arrow-right"></i> Log out
            </div>
        </div>   
    </div>
  )
}

export default MoreMenu;