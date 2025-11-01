import React from 'react';
import './Home.css';

const Home = ({ isAdmin, users, allLinks, myLinks }) => {
  return (
    <div className="home-container">
      {isAdmin && (
        <div className="home-card">
          <h4>Users</h4>
          <p className="stat-number">{users.length}</p>
        </div>
      )}

      <div className="home-card">
        <h4>{isAdmin ? 'All Links' : 'Your Links'}</h4>
        <p className="stat-number">{isAdmin ? allLinks.length : myLinks.length}</p>
      </div>
    </div>
  );
};

export default Home;
