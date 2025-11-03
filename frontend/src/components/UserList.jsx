import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import './UserList.css';

const roleColors = {
  ROLE_ADMIN: '#e74c3c', // rouge
  ROLE_USER: '#3498db',  // bleu
};

const UserList = ({ users, isAdmin, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

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
              <div className="user-card position-relative">
                <div>
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

              {/* Delete icon*/}
              <div className="d-flex justify-content-end gap-2 mt-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Delete user"
                  onClick={() => openDeleteModal(user)}
                >
                  <Trash size={16} />
                </Button>
              </div>

            </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-3">No users match your search.</p>
        )}
      </div>

     {/* Delete confirmation modal */}
      <Modal show={showModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{userToDelete?.email}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default UserList;
