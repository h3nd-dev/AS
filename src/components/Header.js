import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import { AffinidiLoginButton, useAffinidiProfile } from '@affinidi/affinidi-react-auth';
import Modal from 'react-modal';
import Avatar from './Avatar'; // Import the Avatar component
import './Header.css';

Modal.setAppElement('#root');

const Header = () => {
  const { setProfile } = useContext(UserContext);
  const { isLoading, error, profile, handleLogout } = useAffinidiProfile({
    authCompleteUrl: '/api/affinidi-auth/complete'
  });

  const [localProfile, setLocalProfile] = useState(null);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  React.useEffect(() => {
    const currentProfileStr = JSON.stringify(profile);
    const localProfileStr = JSON.stringify(localProfile);

    if (currentProfileStr !== localProfileStr) {
      setLocalProfile(profile);
      setProfile(profile);
    }
  }, [profile, localProfile, setProfile, setLocalProfile]);

  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  const logout = () => {
    closeLogoutModal();
    handleLogout();
    window.location.href = "/";
  };

  const renderLoginState = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      handleLogout();
      return (
        <div>
          <p>Unable to load user data. Please try again later.</p>
        </div>
      );
    }

    if (profile) {
      return (
        <div>
      
          <Avatar src={profile.picture} alt="User Avatar" size="40px" />
          <span>Welcome, {profile.givenName}</span>
          <button onClick={openLogoutModal}>Logout</button>
    
          <Modal
            isOpen={isLogoutModalOpen}
            onRequestClose={closeLogoutModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
              content: {
                width: '300px',
                height: '100px',
                margin: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <div>
              <p>Are you sure you want to logout?</p>
              <button onClick={logout}>Yes</button>
              <button onClick={closeLogoutModal}>No</button>
            </div>
          </Modal>
        </div>
      );
    }

    return <AffinidiLoginButton />;
  };

  return (
    <header className="Header">
      <Link to="/">
        <h1>StackShop</h1>
      </Link>
      <nav>
        {renderLoginState()}
        <Link to="/cart" className="CartIcon">
          <img src="/cart.png" alt="Cart"/>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
