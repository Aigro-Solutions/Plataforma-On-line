import React from 'react';

const Projects = () => {
  return (
    <div className="projects-page">
      <div className="projects-container">
        <h1>Projetos Quânticos</h1>
        <p>Gerencie seus projetos de computação quântica</p>
        
        <div className="coming-soon">
          <i className="fas fa-project-diagram"></i>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve</p>
        </div>
      </div>

      <style jsx>{`
        .projects-page {
          min-height: 100vh;
          padding-top: 100px;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
        }

        .projects-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        .projects-container h1 {
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

export default Projects;