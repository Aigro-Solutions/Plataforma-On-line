import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectService } from '../services/api';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carregar projetos do usuário
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjects();
        setProjects(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        setError('Não foi possível carregar seus projetos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-actions">
            <Link to="/projects" className="btn btn-primary">
              <i className="fas fa-project-diagram"></i> Ver Todos os Projetos
            </Link>
            <Link to="/profile" className="btn btn-outline">
              <i className="fas fa-user"></i> Meu Perfil
            </Link>
          </div>
        </div>
        
        <div className="dashboard-welcome">
          <h2>Bem-vindo, {user?.username}!</h2>
          <p>Este é o seu painel de controle do QuantumOS. Aqui você pode gerenciar seus projetos quânticos e acessar recursos avançados.</p>
        </div>
        
        {error && (
          <div className="dashboard-error">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
        )}
        
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">
              <i className="fas fa-project-diagram"></i> Projetos Recentes
            </h3>
            <Link to="/projects" className="dashboard-section-link">
              Ver Todos <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="dashboard-empty">
              <i className="fas fa-folder-open"></i>
              <p>Você ainda não tem projetos.</p>
              <Link to="/projects" className="btn btn-primary">
                Criar Primeiro Projeto
              </Link>
            </div>
          ) : (
            <div className="dashboard-grid">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h4 className="dashboard-card-title">{project.title}</h4>
                    <span className="dashboard-card-badge">
                      {project.is_public ? 'Público' : 'Privado'}
                    </span>
                  </div>
                  <p className="dashboard-card-content">
                    {project.description || 'Sem descrição'}
                  </p>
                  <div className="dashboard-card-footer">
                    <span className="dashboard-card-date">
                      Criado em: {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <Link to={`/projects/${project.id}`} className="dashboard-card-link">
                      Detalhes <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">
              <i className="fas fa-atom"></i> Recursos Quânticos
            </h3>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h4 className="dashboard-card-title">Simulador Quântico</h4>
              <p className="dashboard-card-content">
                Execute simulações quânticas em diferentes backends.
              </p>
              <Link to="/projects" className="dashboard-card-link">
                Criar Simulação <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <i className="fas fa-code"></i>
              </div>
              <h4 className="dashboard-card-title">Editor de Circuitos</h4>
              <p className="dashboard-card-content">
                Crie e edite circuitos quânticos com interface visual.
              </p>
              <Link to="/projects" className="dashboard-card-link">
                Abrir Editor <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            
            <div className="dashboard-card">
              <div className="dashboard-card-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h4 className="dashboard-card-title">Tutoriais</h4>
              <p className="dashboard-card-content">
                Aprenda a usar o QuantumOS com tutoriais interativos.
              </p>
              <a href="#" className="dashboard-card-link">
                Ver Tutoriais <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .dashboard-welcome {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }
        
        .dashboard-welcome h2 {
          color: var(--fluorescent);
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        
        .dashboard-welcome p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }
        
        .dashboard-error {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .dashboard-section {
          margin-bottom: 3rem;
        }
        
        .dashboard-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .dashboard-section-title {
          font-size: 1.5rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .dashboard-section-link {
          color: var(--fluorescent);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        
        .dashboard-section-link:hover {
          text-decoration: underline;
        }
        
        .dashboard-empty {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 3rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .dashboard-empty i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.3);
        }
        
        .dashboard-empty p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        
        .dashboard-card-icon {
          font-size: 2rem;
          color: var(--fluorescent);
          margin-bottom: 1rem;
          background: rgba(0, 255, 255, 0.1);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dashboard-card-badge {
          background: rgba(0, 255, 255, 0.2);
          color: var(--fluorescent);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
        }
        
        .dashboard-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dashboard-card-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }
        
        .dashboard-card-link {
          color: var(--fluorescent);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        
        .dashboard-card-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;