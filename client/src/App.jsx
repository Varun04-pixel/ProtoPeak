import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { INITIAL_STARTUPS } from './data/startupsData.js';
import { apiRequest } from './api/client.js';
import Navbar from './components/layout/Navbar.jsx';
import LandingPage from './components/pages/LandingPage.jsx';
import DiscoverPage from './components/pages/DiscoverPage.jsx';
import FeedPage from './components/pages/Feed.jsx';
import LoginPage from './components/pages/LoginPage.jsx';
import SignupPage from './components/pages/SignupPage.jsx';
import Msg from './components/pages/Msg.jsx';

function normalizeStartup(item) {
  return {
    ...item,
    id: item._id || item.id,
  };
}

export default function App() {
  const [startups, setStartups] = useState(INITIAL_STARTUPS);
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('protopeak_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let active = true;

    async function loadStartups() {
      try {
        const data = await apiRequest('/startups');
        if (active && Array.isArray(data) && data.length > 0) {
          setStartups(data.map(normalizeStartup));
        }
      } catch (err) {
        console.warn('Using local fallback startups:', err.message);
      } finally {
        if (active) setLoadingStartups(false);
      }
    }

    loadStartups();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('protopeak_token');
    if (!token) return;

    apiRequest('/auth/me')
      .then((data) => {
        if (active && data?.user) {
          setCurrentUser((prev) => {
            const merged = { ...(prev || {}), ...data.user };
            try {
              localStorage.setItem('protopeak_user', JSON.stringify(merged));
            } catch {
              // ignore storage errors
            }
            return merged;
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleCreateStartup = async (newStartup) => {
    if (!currentUser) return;
    const role = String(currentUser.role || 'startup').trim().toLowerCase();
    if (role === 'investor' || role === 'company') {
      throw new Error(
        'Investor and company accounts cannot launch a startup.'
      );
    }

    const saved = await apiRequest('/startups', {
      method: 'POST',
      body: JSON.stringify(newStartup),
    });
    setStartups((prev) => [normalizeStartup(saved), ...prev]);
  };

  const handleAuthSuccess = (authPayload) => {
    const userObj = authPayload?.user || authPayload;
    if (authPayload?.token) {
      localStorage.setItem('protopeak_token', authPayload.token);
    }
    if (userObj) {
      const role = String(userObj.role || 'startup').trim().toLowerCase();
      const cleanName = (userObj.name || userObj.startupName || '').trim();
      const normalizedUser = {
        ...userObj,
        role,
        name: cleanName,
        startupName: role === 'startup' ? (userObj.startupName || cleanName).trim() : '',
      };
      localStorage.setItem('protopeak_user', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('protopeak_token');
    localStorage.removeItem('protopeak_user');
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/discover"
          element={
            <DiscoverPage
              startups={startups}
              loading={loadingStartups}
              currentUser={currentUser}
              onCreateStartup={handleCreateStartup}
            />
          }
        />
        <Route
          path="/feed"
          element={<FeedPage startups={startups} currentUser={currentUser} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleAuthSuccess} />}
        />
        <Route
          path="/signup"
          element={<SignupPage onSignup={handleAuthSuccess} />}
        />
        <Route
          path="/messages"
          element={<Msg startups={startups} currentUser={currentUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}