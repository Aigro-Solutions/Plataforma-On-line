import React from 'react';

const QuantumJobDetail = () => {
  return (
    <div className="quantum-job-detail-page">
      <div className="quantum-job-detail-container">
        <h1>Detalhes do Job Quântico</h1>
        <p>Visualize resultados e métricas do job quântico</p>
        
        <div className="coming-soon">
          <i className="fas fa-chart-bar"></i>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve</p>
        </div>
      </div>

      <style jsx>{`
        .quantum-job-detail-page {
          min-height: 100vh;
          padding-top: 100px;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
        }

        .quantum-job-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        .quantum-job-detail-container h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--fluorescent);
        }

        .coming-soon {
          margin-top: 4rem;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .coming-soon i {
          font-size: 4rem;
          color: var(--fluorescent);
          margin-bottom: 1rem;
        }

        .coming-soon h2 {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default QuantumJobDetail;