import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Trash, Edit3 } from 'lucide-react';

import AddLinkForm from './AddLinkForm';
import './LinkList.css';

const LinkList = ({ links, users, currentUser, isAdmin, onAddLink, onDeleteLink, onUpdateLink }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setShowDeleteModal(true);
  };

  const handleEditClick = (link) => {
    setEditingLink(link);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (linkToDelete) {
      onDeleteLink(linkToDelete.id);
      setShowDeleteModal(false);
      setLinkToDelete(null);
    }
  };

  // filter links based on search term
  const filteredLinks = links.filter(link => {
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
            <div 
              className="link-card d-flex flex-column justify-content-between clickable-card"
              onClick={() => link.url && window.open(link.url, '_blank', 'noopener,noreferrer')}
              style={{ cursor: link.url ? 'pointer' : 'default' }}
            >
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

              <div className="d-flex justify-content-end gap-2 mt-2">
                {/* Edit button */}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleEditClick(link); }}
                  title="Edit link"
                >
                  <Edit3 size={16} />
                </Button>

                {/* Delete button */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(link); }}
                  title="Delete link"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Link */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddLinkForm
            isAdmin={isAdmin}
            users={users}
            currentUser={currentUser}
            existingLink={editingLink}
            onAddLink={(link) => {
              if (editingLink) {
                onUpdateLink(link);
              } else {
                onAddLink(link);
              }
              handleCloseModal();
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Modal Delete Link */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the link "{linkToDelete?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default LinkList;
