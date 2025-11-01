import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const AppNavbar = ({ auth, isAdmin, onLogout, onMenuClick, viewMode }) => {
  const username = auth.user?.profile?.email || 'Guest';

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>LinkHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link active={viewMode === 'home'} onClick={() => onMenuClick('home')}>
              Home
            </Nav.Link>
            {isAdmin && (
              <Nav.Link active={viewMode === 'users'} onClick={() => onMenuClick('users')}>
                Users
              </Nav.Link>
            )}
            <Nav.Link active={viewMode === 'links'} onClick={() => onMenuClick('links')}>
              Links
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <NavDropdown title={username} id="user-dropdown" align="end">
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
