import React, { useState, useEffect } from 'react';

const AddLinkForm = ({ isAdmin, users = [], currentUser, existingLink, onAddLink }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUser, setSelectedUser] = useState(currentUser?.id || '');

  // prefill form if editing an existing link
  useEffect(() => {
    if (existingLink) {
      setTitle(existingLink.title || '');
      setUrl(existingLink.url || '');
      setDescription(existingLink.description || '');
      setSelectedUser(existingLink.user ? existingLink.user.split('/').pop() : currentUser?.id);
    }
  }, [existingLink, currentUser]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) return alert('Title and URL are required');

    onAddLink({
      id: existingLink?.id, // add id if editing
      title,
      url,
      description,
      user: `/api/v1/users/${selectedUser}`,
    });

    // Reset form
    if (!existingLink) {
      setTitle('');
      setUrl('');
      setDescription('');
    }
  };

  return (
    <form className="card p-4 shadow-sm mb-4" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">URL</label>
        <input
          type="url"
          className="form-control"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      {isAdmin && (
        <div className="mb-3">
          <label className="form-label">User</label>
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        {existingLink ? 'Update Link' : 'Add Link'}
      </button>
    </form>
  );
};

export default AddLinkForm;
