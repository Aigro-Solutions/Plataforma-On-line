import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <i className="fas fa-atom"></i>
          QuantumOS
        </Link>
        
        {/* Menu para desktop */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <i className="fas fa-home"></i> Início
            </Link>
          </li>
          
          {isAuthenticated() ? (
            <>
              <li>
                <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/projects" className={isActive('/projects') ? 'active' : ''}>
                  <i className="fas fa-project-diagram"></i> Projetos
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
                  <i className="fas fa-user"></i> Perfil
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/#features" className={isActive('/#features') ? 'active' : ''}>
                  <i className="fas fa-cogs"></i> Tecnologia
                </Link>
              </li>
              <li>
                <Link to="/#documentation" className={isActive('/#documentation') ? 'active' : ''}>
                  <i className="fas fa-book"></i> Documentação
                </Link>
              </li>
              <li>
                <Link to="/#contact" className={isActive('/#contact') ? 'active' : ''}>
                  <i className="fas fa-envelope"></i> Contato
                </Link>
              </li>
            </>
          )}
        </ul>
        
        {isAuthenticated() ? (
          <button onClick={handleLogout} className="nav-btn">
            <i className="fas fa-sign-out-alt"></i> Sair
          </button>
        ) : (
          <Link to="/login" className="nav-btn">
            <i className="fas fa-sign-in-alt"></i> Entrar
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;