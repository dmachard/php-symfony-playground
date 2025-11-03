import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddLinkForm from './AddLinkForm';
import './LinkList.css';

const LinkList = ({ links, users, selectedUser, currentUser, isAdmin, onLinkAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // filter links based on selected user
  const visibleLinks = selectedUser
    ? links.filter(link => link.user && link.user.id === selectedUser.id)
    : links;

  // filter links based on search term
  const filteredLinks = visibleLinks.filter(link => {
    const linkText = `${link.title || ''} ${link.description || ''} ${link.url || ''}`.toLowerCase();

    let userText = '';
    if (isAdmin && link.user) {
      const user = users.find(u => `/api/v1/users/${u.id}` === link.user);
      if (user) {
        userText = `${user.email || ''} ${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
      }
    }

    const search = searchTerm.toLowerCase();
    return linkText.includes(search) || userText.includes(search);
  });

  return (
    <div className="link-list-container">
            {/* Search bar */}
      <div className="search-bar mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row mt-3">
        {/* Card Add Link */}
        <div className="col-md-4 mb-4">
          <div 
            className="link-card add-link-card d-flex flex-column justify-content-center align-items-center"
            onClick={handleOpenModal}
          >
            <span className="add-link-plus">+</span>
            <p className="add-link-text">Add Link</p>
          </div>
        </div>

        {/* Existing Links */}
        {filteredLinks && filteredLinks.map(link => (
          <div key={link.id} className="col-md-4 mb-4">
            <div className="link-card d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">{link.title}</h5>
                {isAdmin && link.user && (
                    <p className="link-user">
                      by {users.find(u => `/api/v1/users/${u.id}` === link.user)?.email || 'Unknown'}
                    </p>
                )}
                <p className="card-text">{link.description}</p>
                {link.url && (
                  <p className="link-url-text">{link.url}</p>
                )}
              </div>
              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-url-button"
                >
                  ➔
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Link */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddLinkForm
            isAdmin={isAdmin}
            users={users}
            currentUser={currentUser}
            onAddLink={(newLink) => {
              onLinkAdded(newLink);
              handleCloseModal();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LinkList;
