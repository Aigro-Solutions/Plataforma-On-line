import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="profile-info">
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Nome de Usuário:</span>
              <span className="detail-value">{user?.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tipo de Conta:</span>
              <span className="detail-value">{user?.is_admin ? 'Administrador' : 'Usuário'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Membro desde:</span>
              <span className="detail-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-outline">
              <i className="fas fa-edit"></i>
              Editar Perfil
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-key"></i>
              Alterar Senha
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          padding-top: 100px;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .profile-container h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-align: center;
          color: var(--fluorescent);
        }

        .profile-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: var(--fluorescent);
          border: 2px solid var(--fluorescent);
        }

        .profile-info h2 {
          color: #fff;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .profile-info p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }

        .profile-details {
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .detail-value {
          color: var(--fluorescent);
          font-weight: 600;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .profile-actions {
            flex-direction: column;
          }

          .detail-item {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;