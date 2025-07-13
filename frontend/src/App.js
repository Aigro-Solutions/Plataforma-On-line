import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import QuantumJobs from './pages/QuantumJobs';
import QuantumJobDetail from './pages/QuantumJobDetail';
import Profile from './pages/Profile';
import QuantumAI from './pages/QuantumAI';
import NotFound from './pages/NotFound';

// Rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Rota de administrador
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <>
      <Navbar />
      <div className="fluorescent-bar"></div>
      
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/projects/:projectId/quantum-jobs" element={
          <ProtectedRoute>
            <QuantumJobs />
          </ProtectedRoute>
        } />
        
        <Route path="/quantum-jobs/:id" element={
          <ProtectedRoute>
            <QuantumJobDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/quantum-ai" element={
          <ProtectedRoute>
            <QuantumAI />
          </ProtectedRoute>
        } />
        
        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;