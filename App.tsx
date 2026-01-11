
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './src/components/Layout';

// Pages
const Dashboard = lazy(() => import('./src/pages/Dashboard'));
const Login = lazy(() => import('./src/pages/Login'));
const Services = lazy(() => import('./src/pages/Services'));
const Register = lazy(() => import('./src/pages/Register'));
const Finance = lazy(() => import('./src/pages/Finance'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="register" element={<Register />} />
            <Route path="finance" element={<Finance />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
