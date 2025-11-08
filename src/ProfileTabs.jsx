import React from "react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="d-flex justify-content-around border-top pt-3 mt-4 fs-4 text-muted">
      <button
        className={`btn border-0 ${
          activeTab === "posts"
            ? "text-white border-top border-2 border-white"
            : "text-secondary"
        }`}
        onClick={() => setActiveTab("posts")}
      >
        <i className="bi bi-grid-3x3 fs-4"></i>
      </button>

      <button
        className={`btn border-0 ${
          activeTab === "saved"
            ? "text-white border-top border-2 border-white"
            : "text-secondary"
        }`}
        onClick={() => setActiveTab("saved")}
      >
        <i className="bi bi-bookmark fs-4"></i>
      </button>

      <button
        className={`btn border-0 ${
          activeTab === "tagged"
            ? "text-white border-top border-2 border-white"
            : "text-secondary"
        }`}
        onClick={() => setActiveTab("tagged")}
      >
        <i className="bi bi-person-square fs-4"></i>
      </button>
    </div>
  );
};

export default ProfileTabs;
