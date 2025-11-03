import React, { useState } from 'react';
import './UserList.css';

const roleColors = {
  ROLE_ADMIN: '#e74c3c', // rouge
  ROLE_USER: '#3498db',  // bleu
};

const UserList = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!users || users.length === 0) {
    return <p className="text-center mt-3">No users found.</p>;
  }

  // filter users based on search term
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const roles = (user.roles || []).join(' ').toLowerCase();

    return (
      email.includes(search) ||
      roles.includes(search)
    );
  });


  return (
    <div className="user-list-container">
      {/* Search bar */}
      <div className="search-bar mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row mt-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user.id} className="col-md-4 mb-4">
              <div className="user-card">
                <div className="user-name">{user.email}</div>
                <div className="user-roles">
                  {user.roles.map(role => (
                    <span
                      key={role}
                      className="user-role-badge"
                      style={{ backgroundColor: roleColors[role] || '#95a5a6' }}
                    >
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No users match your search.</p>
        )}
      </div>

    </div>
  );
};

export default UserList;
