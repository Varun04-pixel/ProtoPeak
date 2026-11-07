import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './components/pages/LandingPage';
import DiscoverPage from './components/pages/DiscoverPage';
import Feed from './components/pages/Feed';
import Msg from './components/pages/Msg';

export default function App() {
  const [user, setUser] = useState({ name: 'Varun', role: 'student' });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Navbar user={user} onLogout={() => setUser(null)} />
        
        {/* Removed max-w and px-4 from here so banner can go edge-to-edge */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/feed" element={<Feed/>} />
            <Route path="/messages" element={<Msg/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}