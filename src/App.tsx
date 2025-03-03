import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ResumeFormWizard from './components/ResumeFormWizard.tsx';
import Auth from './pages/Auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume-builder" element={<ResumeFormWizard />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;