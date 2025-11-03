import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

import { fetchUsers, fetchLinks, setAuthToken, fetchMe, addLink, deleteUser, deleteLink } from './services/api';

import UserList from './components/UserList';
import LinkList from './components/LinkList';
import AppNavbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import LoadingScreen from './components/LoadingScreen';
import AuthErrorScreen from './components/AuthErrorScreen';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const auth = useAuth();

  const [users, setUsers] = useState([]);
  const [allLinks, setAllLinks] = useState([]);
  const [myLinks, setMyLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('home');

  useEffect(() => {
    document.title = 'LinkHub';
    if (!auth.isAuthenticated) return;

    setAuthToken(auth.user?.access_token);

    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch current user info
        const meRes = await fetchMe();
        setCurrentUser(meRes.data);

        const admin = meRes.data.roles.includes('ROLE_ADMIN');
        setIsAdmin(admin);

        // Fetch links and users based on role
        const linksRes = await fetchLinks();
        if (admin) {
          setAllLinks(linksRes.data.member || []);
          const usersRes = await fetchUsers();
          setUsers(usersRes.data.member || []);
        } else {
          setMyLinks(linksRes.data.member || []);
        }

      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth.isAuthenticated, auth.user?.access_token]);

  // Handle authentication states
  if (auth.isLoading) return <LoadingScreen />;
  if (auth.error) {
    return <AuthErrorScreen error={auth.error} onRetry={() => auth.signinRedirect()} />;
  }
  if (!auth.isAuthenticated) {
    return <Login onLogin={() => auth.signinRedirect()} />;
  }

  // Handle adding a new link
  const handleAddLink = async (linkData) => {
    try {
      const res = await addLink(linkData);
      const newLink = res.data;

      if (isAdmin) {
        setAllLinks((prev) => [...prev, newLink]);
      } else {
        setMyLinks((prev) => [...prev, newLink]);
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Failed to add link');
    }
  };

  // handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle delete link
  const handleDeleteLink = async (linkId) => {
    try {
      await deleteLink(linkId);
      if (isAdmin) {
        setAllLinks(prev => prev.filter(l => l.id !== linkId));
      } else {
        setMyLinks(prev => prev.filter(l => l.id !== linkId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete link: " + (err.response?.data?.message || err.message));
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'home':
        return <Home isAdmin={isAdmin} users={users} allLinks={allLinks} myLinks={myLinks} />;
      case 'users':
        return <UserList
                  users={users}
                  isAdmin={isAdmin}
                  onDeleteUser={handleDeleteUser}
                />;
      case 'links':
        return <LinkList 
                  links={isAdmin ? allLinks : myLinks}
                  users={users}
                  currentUser={currentUser}
                  isAdmin={isAdmin}
                  onLinkAdded={handleAddLink}
                  onDeleteLink={handleDeleteLink} 
                />;
      default:
        return <Home isAdmin={isAdmin} users={users} allLinks={allLinks} myLinks={myLinks} />;
    }
  };

  return (
    <div className="App">
      <AppNavbar
        auth={auth}
        isAdmin={isAdmin}
        onLogout={() => auth.signoutRedirect()}
        onMenuClick={setViewMode}
        viewMode={viewMode}
      />

      <div className="container mt-4">
        {loading ? <p>Loading data...</p> : renderContent()}
      </div>
    </div>
  );
}

export default App;
