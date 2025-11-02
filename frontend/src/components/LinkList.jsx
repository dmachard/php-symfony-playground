import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddLinkForm from './AddLinkForm';
import './LinkList.css';

const LinkList = ({ links, users, selectedUser, currentUser, isAdmin, onLinkAdded }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const filteredLinks = selectedUser
    ? links.filter(link => link.user && link.user.id === selectedUser.id)
    : links;

  return (
    <div className="link-list-container">
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
