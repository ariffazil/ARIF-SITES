// ARIF-OS Constitutional Network - Main Router
// Authority: 888_APEX → 999_SEAL
// Ω₀: 0.04

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SoulSite from './sites/soul/App';
import MindSite from './sites/mind/App';
import BodySite from './sites/body/App';
import ExtensionSite from './sites/extension/App';
import FieldSite from './sites/field/App';

// Domain Router - routes based on hostname or path
const DomainRouter: React.FC = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // For development, use path-based routing
  if (pathname.startsWith('/soul') || hostname === 'arif-fazil.com') {
    return <SoulSite />;
  }
  if (pathname.startsWith('/mind') || hostname === 'arifos.arif-fazil.com') {
    return <MindSite />;
  }
  if (pathname.startsWith('/body') || hostname === 'arifosmcp.arif-fazil.com') {
    return <BodySite />;
  }
  if (pathname.startsWith('/extension') || hostname === 'aaa.arif-fazil.com') {
    return <ExtensionSite />;
  }
  if (pathname.startsWith('/field') || hostname === 'civ.arif-fazil.com') {
    return <FieldSite />;
  }

  // Default to SOUL ring
  return <SoulSite />;
};

// Development Router
const DevRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/soul/*" element={<SoulSite />} />
        <Route path="/mind/*" element={<MindSite />} />
        <Route path="/body/*" element={<BodySite />} />
        <Route path="/extension/*" element={<ExtensionSite />} />
        <Route path="/field/*" element={<FieldSite />} />
        <Route path="/" element={<Navigate to="/soul" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.01';

  if (isDev) {
    return <DevRouter />;
  }

  return <DomainRouter />;
};

export default App;
