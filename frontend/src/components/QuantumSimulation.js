import React, { useState, useEffect } from 'react';
import { quantumAIService } from '../services/api';

const QuantumSimulation = ({ agents, onRefresh }) => {
  const [simulation, setSimulation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);

  const [simulationConfig, setSimulationConfig] = useState({
    duration: 10,
    environment_data: {
      problem_size: 15,
      system_size: 8,
      time_steps: 12,
      exploration_steps: 25,
      classical_data: {
        temperature: 0.1,
        noise_level: 0.05,
        field_strength: 1.0
      },
      quantum_state: {
        amplitudes: [0.7071, 0, 0, 0.7071],
        phases: [0, 0.5, 1.0, 1.5]
      }
    }
  });

  const runSimulation = async () => {
    if (agents.length === 0) {
      alert('Crie pelo menos um agente antes de executar a simulação');
      return;
    }

    setIsRunning(true);
    setSimulation(null);

    try {
      const response = await quantumAIService.runSimulation(simulationConfig);
      
      if (response.data.success) {
        const newSimulation = response.data.simulation;
        setSimulation(newSimulation);
        setSimulationHistory(prev => [newSimulation, ...prev.slice(0, 9)]); // Manter últimas 10
        onRefresh(); // Atualizar dados dos agentes
      }
    } catch (error) {
      console.error('Erro na simulação:', error);
      alert('Erro ao executar simulação: ' + (error.response?.data?.detail || error.message));
    } finally {
      setIsRunning(false);
    }
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / 1000;
    return `${duration.toFixed(2)}s`;
  };

  const getSuccessRate = (cycles) => {
    if (!cycles || cycles.length === 0) return 0;
    
    const totalResults = cycles.reduce((sum, cycle) => sum + cycle.results.length, 0);
    const totalPossible = cycles.length * agents.length;
    
    return totalPossible > 0 ? (totalResults / totalPossible) * 100 : 0;
  };

  const renderSimulationResults = (sim) => {
    if (!sim) return null;

    return (
      <div className="simulation-results">
        <div className="results-header">
          <h3>Resultados da Simulação</h3>
          <div className="simulation-meta">
            <span>Duração: {formatDuration(sim.start_time, sim.end_time)}</span>
            <span>Ciclos: {sim.cycles.length}</span>
            <span>Agentes: {sim.agents.length}</span>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-content">
              <h4>Taxa de Sucesso</h4>
              <span className="metric-large">{getSuccessRate(sim.cycles).toFixed(1)}%</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="card-content">
              <h4>Precisão Média</h4>
              <span className="metric-large">
                {(sim.summary.average_accuracy * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="card-content">
              <h4>Eficiência Média</h4>
              <span className="metric-large">
                {(sim.summary.average_efficiency * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon">
              <i className="fas fa-atom"></i>
            </div>
            <div className="card-content">
              <h4>Coerência Quântica</h4>
              <span className="metric-large">
                {(sim.summary.average_quantum_coherence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="cycles-timeline">
          <h4>Timeline dos Ciclos</h4>
          <div className="timeline">
            {sim.cycles.map((cycle, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <span>{cycle.cycle + 1}</span>
                </div>
                <div className="timeline-content">
                  <div className="cycle-info">
                    <strong>Ciclo {cycle.cycle + 1}</strong>
                    <span>{cycle.results.length} ações executadas</span>
                    {cycle.errors.length > 0 && (
                      <span className="error-count">{cycle.errors.length} erros</span>
                    )}
                  </div>
                  
                  <div className="cycle-results">
                    {cycle.results.slice(0, 3).map((result, resultIndex) => (
                      <div key={resultIndex} className="result-preview">
                        <span className="agent-id">{result.agent_id}</span>
                        <span className="action-type">
                          {result.cycle_result?.action?.action || 'N/A'}
                        </span>
                        <span className={`status ${result.cycle_result?.action?.success ? 'success' : 'failed'}`}>
                          {result.cycle_result?.action?.success ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                    {cycle.results.length > 3 && (
                      <span className="more-results">+{cycle.results.length - 3} mais</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detailed-results">
          <h4>Resultados Detalhados</h4>
          <div className="results-table">
            <div className="table-header">
              <span>Ciclo</span>
              <span>Agente</span>
              <span>Ação</span>
              <span>Status</span>
              <span>Performance</span>
            </div>
            {sim.cycles.slice(0, 10).map((cycle) =>
              cycle.results.map((result, resultIndex) => (
                <div key={`${cycle.cycle}-${resultIndex}`} className="table-row">
                  <span>{cycle.cycle + 1}</span>
                  <span className="agent-cell">{result.agent_id}</span>
                  <span>{result.cycle_result?.action?.action || 'N/A'}</span>
                  <span className={`status-cell ${result.cycle_result?.action?.success ? 'success' : 'failed'}`}>
                    {result.cycle_result?.action?.success ? 'Sucesso' : 'Falha'}
                  </span>
                  <span className="performance-cell">
                    {result.cycle_result?.performance ? 
                      `${(result.cycle_result.performance.accuracy * 100).toFixed(1)}%` : 
                      'N/A'
                    }
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="quantum-simulation">
      <div className="simulation-header">
        <h2>Simulação Multi-Agente Quântica</h2>
        <p>Execute simulações complexas com múltiplos agentes quânticos interagindo</p>
      </div>

      <div className="simulation-config">
        <h3>Configuração da Simulação</h3>
        
        <div className="config-grid">
          <div className="config-group">
            <label>Duração (ciclos)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={simulationConfig.duration}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                duration: parseInt(e.target.value)
              }))}
            />
          </div>

          <div className="config-group">
            <label>Tamanho do Problema</label>
            <input
              type="number"
              min="5"
              max="50"
              value={simulationConfig.environment_data.problem_size}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                environment_data: {
                  ...prev.environment_data,
                  problem_size: parseInt(e.target.value)
                }
              }))}
            />
          </div>

          <div className="config-group">
            <label>Tamanho do Sistema</label>
            <input
              type="number"
              min="3"
              max="20"
              value={simulationConfig.environment_data.system_size}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                environment_data: {
                  ...prev.environment_data,
                  system_size: parseInt(e.target.value)
                }
              }))}
            />
          </div>

          <div className="config-group">
            <label>Passos de Tempo</label>
            <input
              type="number"
              min="5"
              max="50"
              value={simulationConfig.environment_data.time_steps}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                environment_data: {
                  ...prev.environment_data,
                  time_steps: parseInt(e.target.value)
                }
              }))}
            />
          </div>

          <div className="config-group">
            <label>Temperatura</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={simulationConfig.environment_data.classical_data.temperature}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                environment_data: {
                  ...prev.environment_data,
                  classical_data: {
                    ...prev.environment_data.classical_data,
                    temperature: parseFloat(e.target.value)
                  }
                }
              }))}
            />
          </div>

          <div className="config-group">
            <label>Nível de Ruído</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="0.5"
              value={simulationConfig.environment_data.classical_data.noise_level}
              onChange={(e) => setSimulationConfig(prev => ({
                ...prev,
                environment_data: {
                  ...prev.environment_data,
                  classical_data: {
                    ...prev.environment_data.classical_data,
                    noise_level: parseFloat(e.target.value)
                  }
                }
              }))}
            />
          </div>
        </div>

        <div className="simulation-actions">
          <button
            className="btn btn-primary large"
            onClick={runSimulation}
            disabled={isRunning || agents.length === 0}
          >
            {isRunning ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Executando Simulação...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Iniciar Simulação
              </>
            )}
          </button>

          {agents.length === 0 && (
            <p className="warning">
              <i className="fas fa-exclamation-triangle"></i>
              Crie pelo menos um agente para executar a simulação
            </p>
          )}
        </div>
      </div>

      {simulation && renderSimulationResults(simulation)}

      {simulationHistory.length > 0 && (
        <div className="simulation-history">
          <h3>Histórico de Simulações</h3>
          <div className="history-grid">
            {simulationHistory.map((sim, index) => (
              <div 
                key={index} 
                className="history-card"
                onClick={() => setSelectedSimulation(sim)}
              >
                <div className="history-header">
                  <span className="history-date">
                    {new Date(sim.start_time).toLocaleString()}
                  </span>
                  <span className="history-duration">
                    {formatDuration(sim.start_time, sim.end_time)}
                  </span>
                </div>
                <div className="history-stats">
                  <div className="stat">
                    <span>Ciclos:</span>
                    <span>{sim.cycles.length}</span>
                  </div>
                  <div className="stat">
                    <span>Sucesso:</span>
                    <span>{getSuccessRate(sim.cycles).toFixed(1)}%</span>
                  </div>
                  <div className="stat">
                    <span>Agentes:</span>
                    <span>{sim.agents.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSimulation && (
        <div className="simulation-modal">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Simulação - {new Date(selectedSimulation.start_time).toLocaleString()}</h3>
              <button
                className="close-button"
                onClick={() => setSelectedSimulation(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {renderSimulationResults(selectedSimulation)}
          </div>
        </div>
      )}

      <style jsx>{`
        .quantum-simulation {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .simulation-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .simulation-header h2 {
          color: #fff;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .simulation-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
        }

        .simulation-config {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .simulation-config h3 {
          color: var(--fluorescent);
          margin-bottom: 2rem;
          text-align: center;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .config-group {
          display: flex;
          flex-direction: column;
        }

        .config-group label {
          color: #fff;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .config-group input {
          padding: 0.8rem;
          border-radius: 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
        }

        .config-group input:focus {
          outline: none;
          border-color: var(--fluorescent);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .simulation-actions {
          text-align: center;
        }

        .btn.large {
          padding: 1rem 3rem;
          font-size: 1.2rem;
        }

        .warning {
          color: #ffaa00;
          margin-top: 1rem;
          font-size: 1rem;
        }

        .warning i {
          margin-right: 0.5rem;
        }

        .simulation-results {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          padding-bottom: 1rem;
        }

        .results-header h3 {
          color: #fff;
          margin: 0;
        }

        .simulation-meta {
          display: flex;
          gap: 2rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .summary-card {
          background: rgba(0, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.3);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-icon {
          font-size: 2rem;
          color: var(--fluorescent);
        }

        .card-content h4 {
          color: #fff;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .metric-large {
          color: var(--fluorescent);
          font-size: 1.8rem;
          font-weight: bold;
        }

        .cycles-timeline {
          margin-bottom: 3rem;
        }

        .cycles-timeline h4 {
          color: var(--fluorescent);
          margin-bottom: 1.5rem;
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--fluorescent), transparent);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }

        .timeline-marker {
          position: absolute;
          left: -2rem;
          top: 0;
          width: 2rem;
          height: 2rem;
          background: var(--fluorescent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-dark);
          font-weight: bold;
          font-size: 0.8rem;
        }

        .timeline-content {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .cycle-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: #fff;
        }

        .error-count {
          color: #ff6b6b;
          font-size: 0.9rem;
        }

        .cycle-results {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .result-preview {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .agent-id {
          color: var(--fluorescent);
          font-weight: 500;
        }

        .action-type {
          color: rgba(255, 255, 255, 0.8);
        }

        .status.success {
          color: #00ff00;
        }

        .status.failed {
          color: #ff6b6b;
        }

        .more-results {
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }

        .detailed-results h4 {
          color: var(--fluorescent);
          margin-bottom: 1.5rem;
        }

        .results-table {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px 120px;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 255, 255, 0.1);
          color: var(--fluorescent);
          font-weight: bold;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 1fr 120px 100px 120px;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          align-items: center;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .agent-cell {
          color: var(--fluorescent);
          font-family: monospace;
        }

        .status-cell.success {
          color: #00ff00;
        }

        .status-cell.failed {
          color: #ff6b6b;
        }

        .performance-cell {
          text-align: right;
        }

        .simulation-history {
          margin-bottom: 3rem;
        }

        .simulation-history h3 {
          color: var(--fluorescent);
          margin-bottom: 2rem;
          text-align: center;
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .history-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .history-card:hover {
          transform: translateY(-5px);
          border-color: var(--fluorescent);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: #fff;
        }

        .history-date {
          font-weight: 500;
        }

        .history-duration {
          color: var(--fluorescent);
          font-family: monospace;
        }

        .history-stats {
          display: flex;
          justify-content: space-between;
        }

        .history-stats .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .history-stats .stat span:last-child {
          color: var(--fluorescent);
          font-weight: bold;
        }

        .simulation-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
        }

        .modal-content.large {
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .config-grid {
            grid-template-columns: 1fr;
          }

          .simulation-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .history-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantumSimulation;