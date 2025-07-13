import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="error-animation">
          <div className="quantum-circle">
            <div className="quantum-particle particle-1"></div>
            <div className="quantum-particle particle-2"></div>
            <div className="quantum-particle particle-3"></div>
            <div className="quantum-particle particle-4"></div>
          </div>
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Página Não Encontrada</h2>
        <p className="error-description">
          A página que você está procurando não existe no espaço quântico.
          Ela pode ter colapsado para outro estado ou nunca ter existido.
        </p>
        
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home"></i>
            Voltar ao Início
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
          text-align: center;
          padding: 2rem;
        }

        .not-found-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .error-animation {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .error-code {
          font-size: 8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, var(--fluorescent), #00aaff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
        }

        .error-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .error-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .error-code {
            font-size: 6rem;
          }

          .error-title {
            font-size: 2rem;
          }

          .error-description {
            font-size: 1rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .error-actions .btn {
            width: 100%;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;