import React from 'react';
import './UserList.css';

const roleColors = {
  ROLE_ADMIN: '#e74c3c', // rouge
  ROLE_USER: '#3498db',  // bleu
};

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-center mt-3">No users found.</p>;
  }

  return (
    <div className="row mt-3">
      {users.map(user => (
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
      ))}
    </div>
  );
};

export default UserList;
