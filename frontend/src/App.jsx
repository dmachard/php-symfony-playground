import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { fetchUsers, fetchLinks, setAuthToken, fetchMe } from './services/api';
import UserList from './components/UserList';
import LinkList from './components/LinkList';
import AppNavbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const auth = useAuth();

  const [users, setUsers] = useState([]);
  const [allLinks, setAllLinks] = useState([]);
  const [myLinks, setMyLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
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
        if (admin) {
          const linksRes = await fetchLinks();
          setAllLinks(linksRes.data.member || []);
          const usersRes = await fetchUsers();
          setUsers(usersRes.data.member || []);
        } else {
          setMyLinks(meRes.data.links || []);
        }

      } catch (e) {
        console.error('Error loading data', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth.isAuthenticated]);

  if (auth.isLoading) return <p className="text-center mt-5">Loading authentication...</p>;
  if (auth.error) return <p className="text-danger text-center mt-5">Auth error: {auth.error.message}</p>;
  if (!auth.isAuthenticated) {
    return <Login onLogin={() => auth.signinRedirect()} />;
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'home':
        return <Home isAdmin={isAdmin} users={users} allLinks={allLinks} myLinks={myLinks} />;
      case 'users':
        return <UserList users={users} onSelectUser={setSelectedUser} selectedUser={selectedUser} />;
      case 'links':
        return <LinkList links={isAdmin ? allLinks : myLinks} selectedUser={isAdmin ? selectedUser : null} currentUser={currentUser} />;
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
      />

      <div className="container mt-4">
        {loading ? <p>Loading data...</p> : renderContent()}
      </div>
    </div>
  );
}

export default App;
