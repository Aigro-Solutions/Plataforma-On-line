import React, { useState, useEffect } from 'react';
import { quantumAIService } from '../services/api';

const AgentManager = ({ agents, onAgentCreated, onAgentDeleted, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agentTypes, setAgentTypes] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);
  const [agentResults, setAgentResults] = useState({});
  const [loading, setLoading] = useState(false);

  const [newAgent, setNewAgent] = useState({
    agent_type: 'hybrid',
    capabilities: []
  });

  const [environmentData, setEnvironmentData] = useState({
    problem_size: 10,
    historical_data: [],
    system_size: 5,
    time_steps: 10,
    exploration_steps: 20,
    classical_data: {}
  });

  useEffect(() => {
    loadAgentTypes();
  }, []);

  const loadAgentTypes = async () => {
    try {
      const response = await quantumAIService.getAgentTypes();
      setAgentTypes(response.data.agent_types || []);
    } catch (error) {
      console.error('Erro ao carregar tipos de agentes:', error);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await quantumAIService.createAgent(newAgent);
      
      if (response.data.success) {
        onAgentCreated(response.data);
        setShowCreateForm(false);
        setNewAgent({ agent_type: 'hybrid', capabilities: [] });
      }
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      alert('Erro ao criar agente: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Tem certeza que deseja deletar este agente?')) {
      return;
    }

    setLoading(true);
    try {
      await quantumAIService.deleteAgent(agentId);
      onAgentDeleted(agentId);
    } catch (error) {
      console.error('Erro ao deletar agente:', error);
      alert('Erro ao deletar agente: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgent = async (agentId) => {
    setRunningAgent(agentId);
    
    try {
      const response = await quantumAIService.runAgent(agentId, environmentData);
      
      if (response.data.success) {
        setAgentResults(prev => ({
          ...prev,
          [agentId]: response.data.result
        }));
      }
    } catch (error) {
      console.error('Erro ao executar agente:', error);
      alert('Erro ao executar agente: ' + (error.response?.data?.detail || error.message));
    } finally {
      setRunningAgent(null);
    }
  };

  const handleCapabilityChange = (capability, checked) => {
    setNewAgent(prev => ({
      ...prev,
      capabilities: checked
        ? [...prev.capabilities, capability]
        : prev.capabilities.filter(c => c !== capability)
    }));
  };

  const getAgentTypeInfo = (type) => {
    return agentTypes.find(t => t.value === type) || { label: type, description: '' };
  };

  const getStateColor = (state) => {
    const colors = {
      'coherent': '#00ff00',
      'entangled': '#ff00ff',
      'superposition': '#ffff00',
      'collapsed': '#ff0000'
    };
    return colors[state] || '#ffffff';
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="agent-manager">
      <div className="agent-manager-header">
        <h2>Gerenciador de Agentes Quânticos</h2>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            <i className="fas fa-plus"></i>
            Criar Agente
          </button>
          <button
            className="btn btn-outline"
            onClick={onRefresh}
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i>
            Atualizar
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="create-agent-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Criar Novo Agente Quântico</h3>
              <button
                className="close-button"
                onClick={() => setShowCreateForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateAgent}>
              <div className="form-group">
                <label>Tipo de Agente</label>
                <select
                  value={newAgent.agent_type}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, agent_type: e.target.value }))}
                  required
                >
                  {agentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <small>{getAgentTypeInfo(newAgent.agent_type).description}</small>
              </div>

              <div className="form-group">
                <label>Capacidades</label>
                <div className="capabilities-grid">
                  {['optimization', 'analysis', 'prediction', 'simulation', 'learning', 'adaptation'].map(capability => (
                    <label key={capability} className="capability-checkbox">
                      <input
                        type="checkbox"
                        checked={newAgent.capabilities.includes(capability)}
                        onChange={(e) => handleCapabilityChange(capability, e.target.checked)}
                      />
                      <span>{capability}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Agente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="agents-grid">
        {agents.length === 0 ? (
          <div className="no-agents">
            <i className="fas fa-robot"></i>
            <h3>Nenhum agente criado</h3>
            <p>Crie seu primeiro agente quântico para começar</p>
          </div>
        ) : (
          agents.map(agent => (
            <div key={agent.agent_id} className="agent-card">
              <div className="agent-header">
                <div className="agent-info">
                  <h3 className="agent-id">{agent.agent_id}</h3>
                  <span className="agent-type">{getAgentTypeInfo(agent.agent_type).label}</span>
                </div>
                <div 
                  className="agent-state"
                  style={{ color: getStateColor(agent.state) }}
                >
                  <i className="fas fa-circle"></i>
                  {agent.state}
                </div>
              </div>

              <div className="agent-metrics">
                <div className="metric">
                  <span className="metric-label">Precisão</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${agent.performance_metrics.accuracy * 100}%` }}
                    ></div>
                  </div>
                  <span className="metric-value">{(agent.performance_metrics.accuracy * 100).toFixed(1)}%</span>
                </div>

                <div className="metric">
                  <span className="metric-label">Eficiência</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${agent.performance_metrics.efficiency * 100}%` }}
                    ></div>
                  </div>
                  <span className="metric-value">{(agent.performance_metrics.efficiency * 100).toFixed(1)}%</span>
                </div>

                <div className="metric">
                  <span className="metric-label">Coerência Quântica</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill quantum-coherence"
                      style={{ width: `${agent.quantum_coherence * 100}%` }}
                    ></div>
                  </div>
                  <span className="metric-value">{(agent.quantum_coherence * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="agent-stats">
                <div className="stat">
                  <i className="fas fa-memory"></i>
                  <span>Memória: {agent.memory_size}</span>
                </div>
                <div className="stat">
                  <i className="fas fa-brain"></i>
                  <span>Experiências: {agent.experience_count}</span>
                </div>
                <div className="stat">
                  <i className="fas fa-clock"></i>
                  <span>Uptime: {formatUptime(agent.uptime)}</span>
                </div>
              </div>

              <div className="agent-capabilities">
                <strong>Capacidades:</strong>
                <div className="capabilities-list">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="capability-tag">{cap}</span>
                  ))}
                </div>
              </div>

              <div className="agent-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleRunAgent(agent.agent_id)}
                  disabled={runningAgent === agent.agent_id}
                >
                  {runningAgent === agent.agent_id ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Executando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play"></i>
                      Executar
                    </>
                  )}
                </button>
                
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <i className="fas fa-info-circle"></i>
                  Detalhes
                </button>
                
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteAgent(agent.agent_id)}
                  disabled={loading}
                >
                  <i className="fas fa-trash"></i>
                  Deletar
                </button>
              </div>

              {agentResults[agent.agent_id] && (
                <div className="agent-result">
                  <h4>Último Resultado:</h4>
                  <pre>{JSON.stringify(agentResults[agent.agent_id], null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedAgent && (
        <div className="agent-details-modal">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Detalhes do Agente: {selectedAgent.agent_id}</h3>
              <button
                className="close-button"
                onClick={() => setSelectedAgent(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="agent-details">
              <div className="detail-section">
                <h4>Informações Gerais</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>ID:</strong> {selectedAgent.agent_id}
                  </div>
                  <div className="detail-item">
                    <strong>Tipo:</strong> {getAgentTypeInfo(selectedAgent.agent_type).label}
                  </div>
                  <div className="detail-item">
                    <strong>Estado:</strong> 
                    <span style={{ color: getStateColor(selectedAgent.state) }}>
                      {selectedAgent.state}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Criado em:</strong> {new Date(selectedAgent.created_at).toLocaleString()}
                  </div>
                  <div className="detail-item">
                    <strong>Última atualização:</strong> {new Date(selectedAgent.last_update).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Métricas de Performance</h4>
                <div className="metrics-detailed">
                  <div className="metric-detailed">
                    <span>Precisão</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill"
                        style={{ width: `${selectedAgent.performance_metrics.accuracy * 100}%` }}
                      ></div>
                    </div>
                    <span>{(selectedAgent.performance_metrics.accuracy * 100).toFixed(2)}%</span>
                  </div>
                  <div className="metric-detailed">
                    <span>Eficiência</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill"
                        style={{ width: `${selectedAgent.performance_metrics.efficiency * 100}%` }}
                      ></div>
                    </div>
                    <span>{(selectedAgent.performance_metrics.efficiency * 100).toFixed(2)}%</span>
                  </div>
                  <div className="metric-detailed">
                    <span>Coerência Quântica</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill quantum-coherence"
                        style={{ width: `${selectedAgent.quantum_coherence * 100}%` }}
                      ></div>
                    </div>
                    <span>{(selectedAgent.quantum_coherence * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Capacidades</h4>
                <div className="capabilities-detailed">
                  {selectedAgent.capabilities.map(cap => (
                    <span key={cap} className="capability-tag large">{cap}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .agent-manager {
          max-width: 1400px;
          margin: 0 auto;
        }

        .agent-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .agent-manager-header h2 {
          color: #fff;
          font-size: 2rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .create-agent-modal,
        .agent-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--primary-dark);
          border-radius: 10px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--fluorescent);
        }

        .modal-content.large {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          padding-bottom: 1rem;
        }

        .modal-header h3 {
          color: #fff;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s;
        }

        .close-button:hover {
          color: var(--fluorescent);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #fff;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group select {
          width: 100%;
          padding: 0.8rem;
          border-radius: 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
        }

        .form-group small {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-top: 0.5rem;
          display: block;
        }

        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .capability-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          cursor: pointer;
        }

        .capability-checkbox input {
          accent-color: var(--fluorescent);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .no-agents {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .no-agents i {
          font-size: 4rem;
          color: var(--fluorescent);
          margin-bottom: 1rem;
        }

        .agent-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
          transition: all 0.3s;
        }

        .agent-card:hover {
          transform: translateY(-5px);
          border-color: var(--fluorescent);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .agent-id {
          color: #fff;
          font-size: 1.2rem;
          margin: 0;
        }

        .agent-type {
          color: var(--fluorescent);
          font-size: 0.9rem;
          background: rgba(0, 255, 255, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
        }

        .agent-state {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .agent-metrics {
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: #fff;
          font-size: 0.9rem;
          min-width: 120px;
        }

        .metric-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--fluorescent), #00aaff);
          transition: width 0.3s;
        }

        .metric-fill.quantum-coherence {
          background: linear-gradient(90deg, #ff00ff, var(--fluorescent));
        }

        .metric-value {
          color: #fff;
          font-size: 0.9rem;
          min-width: 50px;
          text-align: right;
        }

        .agent-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .stat i {
          color: var(--fluorescent);
        }

        .agent-capabilities {
          margin-bottom: 1rem;
          color: #fff;
        }

        .capabilities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .capability-tag {
          background: rgba(0, 255, 255, 0.2);
          color: var(--fluorescent);
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.8rem;
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .capability-tag.large {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }

        .agent-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .agent-actions .btn {
          flex: 1;
          min-width: 80px;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }

        .btn-danger {
          background: rgba(255, 0, 0, 0.2);
          border-color: #ff4444;
          color: #ff4444;
        }

        .btn-danger:hover {
          background: #ff4444;
          color: #fff;
        }

        .agent-result {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .agent-result h4 {
          color: var(--fluorescent);
          margin-bottom: 0.5rem;
        }

        .agent-result pre {
          color: #fff;
          font-size: 0.8rem;
          max-height: 200px;
          overflow-y: auto;
          white-space: pre-wrap;
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .detail-section h4 {
          color: var(--fluorescent);
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          padding-bottom: 0.5rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          color: #fff;
        }

        .detail-item strong {
          color: var(--fluorescent);
          margin-right: 0.5rem;
        }

        .metrics-detailed {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .metric-detailed {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .metric-detailed span:first-child {
          color: #fff;
          min-width: 150px;
        }

        .metric-detailed span:last-child {
          color: #fff;
          min-width: 60px;
          text-align: right;
        }

        .capabilities-detailed {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .agent-manager-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .agents-grid {
            grid-template-columns: 1fr;
          }

          .agent-actions {
            flex-direction: column;
          }

          .agent-actions .btn {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentManager;