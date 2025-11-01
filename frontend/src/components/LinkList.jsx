import React from 'react';
import './LinkList.css'; 

const LinkList = ({ links, selectedUser, currentUser }) => {
  const filteredLinks = selectedUser
    ? links.filter(link => link.user && link.user.id === selectedUser.id)
    : links;

  if (!filteredLinks || filteredLinks.length === 0) {
    return <p className="text-center mt-3">No links found.</p>;
  }

  return (
    <div className="row mt-3">
      {filteredLinks.map(link => (
        <div key={link.id} className="col-md-4 mb-4">
          <div className="card link-card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{link.title}</h5>
              <p className="card-text flex-grow-1">{link.description}</p>
              {link.url && (
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-url"
                >
                  Visit link
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkList;
