import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="quantum-loader">
        <div className="quantum-circle">
          <div className="quantum-particle particle-1"></div>
          <div className="quantum-particle particle-2"></div>
          <div className="quantum-particle particle-3"></div>
          <div className="quantum-particle particle-4"></div>
        </div>
      </div>
      <p className="loading-text">Carregando...</p>
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
        }
        
        .quantum-loader {
          width: 150px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .loading-text {
          color: var(--fluorescent);
          font-size: 1.5rem;
          letter-spacing: 2px;
          animation: pulse 1.5s infinite alternate;
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;