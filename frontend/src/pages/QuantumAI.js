import React, { useState, useEffect } from 'react';
import { quantumAIService } from '../services/api';
import AgentManager from '../components/AgentManager';
import QuantumSimulation from '../components/QuantumSimulation';
import AIStats from '../components/AIStats';
import QuantumVisualizer from '../components/QuantumVisualizer';

const QuantumAI = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [agentsResponse, statsResponse] = await Promise.all([
        quantumAIService.getAgents(),
        quantumAIService.getStats()
      ]);
      
      setAgents(agentsResponse.data.agents || []);
      setStats(statsResponse.data.stats || {});
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados da IA Quântica');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentCreated = (newAgent) => {
    setAgents(prev => [...prev, newAgent]);
    loadData(); // Recarregar estatísticas
  };

  const handleAgentDeleted = (agentId) => {
    setAgents(prev => prev.filter(agent => agent.agent_id !== agentId));
    loadData(); // Recarregar estatísticas
  };

  if (loading) {
    return (
      <div className="quantum-ai-loading">
        <div className="quantum-loader">
          <div className="quantum-circle">
            <div className="quantum-particle particle-1"></div>
            <div className="quantum-particle particle-2"></div>
            <div className="quantum-particle particle-3"></div>
            <div className="quantum-particle particle-4"></div>
          </div>
        </div>
        <p>Inicializando IA Quântica...</p>
      </div>
    );
  }

  return (
    <div className="quantum-ai-page">
      <div className="quantum-ai-header">
        <h1 className="quantum-ai-title">
          <i className="fas fa-brain"></i>
          IA Agêntica Híbrida Quântica
        </h1>
        <p className="quantum-ai-subtitle">
          Sistema avançado de inteligência artificial que combina processamento clássico e quântico
        </p>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <div className="quantum-ai-tabs">
        <button
          className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`}
          onClick={() => setActiveTab('agents')}
        >
          <i className="fas fa-robot"></i>
          Agentes Quânticos
        </button>
        <button
          className={`tab-button ${activeTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulation')}
        >
          <i className="fas fa-play-circle"></i>
          Simulação Multi-Agente
        </button>
        <button
          className={`tab-button ${activeTab === 'visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          <i className="fas fa-eye"></i>
          Visualizador Quântico
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <i className="fas fa-chart-bar"></i>
          Estatísticas
        </button>
      </div>

      <div className="quantum-ai-content">
        {activeTab === 'agents' && (
          <AgentManager
            agents={agents}
            onAgentCreated={handleAgentCreated}
            onAgentDeleted={handleAgentDeleted}
            onRefresh={loadData}
          />
        )}
        
        {activeTab === 'simulation' && (
          <QuantumSimulation
            agents={agents}
            onRefresh={loadData}
          />
        )}
        
        {activeTab === 'visualizer' && (
          <QuantumVisualizer
            agents={agents}
          />
        )}
        
        {activeTab === 'stats' && (
          <AIStats
            stats={stats}
            agents={agents}
            onRefresh={loadData}
          />
        )}
      </div>

      <style jsx>{`
        .quantum-ai-page {
          min-height: 100vh;
          padding-top: 100px;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
        }

        .quantum-ai-header {
          text-align: center;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .quantum-ai-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #fff, var(--fluorescent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .quantum-ai-title i {
          color: var(--fluorescent);
          margin-right: 1rem;
        }

        .quantum-ai-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 800px;
          margin: 0 auto;
        }

        .quantum-ai-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
          color: #fff;
        }

        .quantum-ai-loading p {
          margin-top: 2rem;
          font-size: 1.2rem;
          color: var(--fluorescent);
        }

        .error-banner {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 1rem;
          margin: 0 2rem 2rem;
          border-radius: 5px;
          text-align: center;
        }

        .error-banner i {
          margin-right: 0.5rem;
        }

        .quantum-ai-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          padding: 0 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tab-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: #fff;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-button:hover {
          background: rgba(0, 255, 255, 0.1);
          border-color: var(--fluorescent);
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: var(--fluorescent);
          color: var(--primary-dark);
          border-color: var(--fluorescent);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .quantum-ai-content {
          padding: 0 2rem 2rem;
        }

        @media (max-width: 768px) {
          .quantum-ai-title {
            font-size: 2rem;
          }

          .quantum-ai-tabs {
            flex-direction: column;
            align-items: center;
          }

          .tab-button {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantumAI;