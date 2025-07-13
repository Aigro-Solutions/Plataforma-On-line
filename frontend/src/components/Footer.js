import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/" className="logo">
            <i className="fas fa-atom"></i>
            QuantumOS
          </Link>
          <p className="footer-description">
            Uma revolução na computação que combina o poder da física quântica com inteligência artificial avançada.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h3 className="footer-title">Navegação</h3>
            <ul className="footer-menu">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/#features">Tecnologia</Link></li>
              <li><Link to="/#documentation">Documentação</Link></li>
              <li><Link to="/#contact">Contato</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Recursos</h3>
            <ul className="footer-menu">
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Registrar</Link></li>
              <li><a href="https://github.com/quantumos" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://docs.aigronovatech.com.br" target="_blank" rel="noopener noreferrer">Documentação API</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contato</h3>
            <ul className="footer-menu">
              <li><a href="mailto:contato@aigronovatech.com.br"><i className="fas fa-envelope"></i> contato@aigronovatech.com.br</a></li>
              <li><a href="tel:+5511999999999"><i className="fas fa-phone"></i> +55 (11) 99999-9999</a></li>
              <li><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"><i className="fas fa-map-marker-alt"></i> São Paulo, SP - Brasil</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} QuantumOS. Todos os direitos reservados.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, rgba(10, 26, 47, 0.95) 0%, rgba(13, 59, 102, 0.95) 100%);
          color: #fff;
          padding-top: 4rem;
          border-top: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        
        .footer-logo {
          flex: 0 0 100%;
          max-width: 300px;
          margin-bottom: 2rem;
        }
        
        .footer-description {
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .footer-links {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        
        .footer-section {
          flex: 0 0 30%;
          margin-bottom: 2rem;
        }
        
        .footer-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--fluorescent);
        }
        
        .footer-menu {
          list-style: none;
        }
        
        .footer-menu li {
          margin-bottom: 0.5rem;
        }
        
        .footer-menu a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.3s;
        }
        
        .footer-menu a:hover {
          color: var(--fluorescent);
        }
        
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 0;
        }
        
        .footer-bottom .footer-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-copyright {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        .footer-social {
          display: flex;
          gap: 1rem;
        }
        
        .footer-social a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          transition: all 0.3s;
        }
        
        .footer-social a:hover {
          color: var(--fluorescent);
        }
        
        @media (max-width: 768px) {
          .footer-container {
            flex-direction: column;
          }
          
          .footer-logo {
            max-width: 100%;
            margin-bottom: 2rem;
          }
          
          .footer-section {
            flex: 0 0 100%;
          }
          
          .footer-bottom .footer-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;