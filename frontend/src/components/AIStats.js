import React, { useState, useEffect } from 'react';

const AIStats = ({ stats, agents, onRefresh }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('accuracy');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedAgents = [...agents].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'accuracy':
        valueA = a.performance_metrics?.accuracy || 0;
        valueB = b.performance_metrics?.accuracy || 0;
        break;
      case 'efficiency':
        valueA = a.performance_metrics?.efficiency || 0;
        valueB = b.performance_metrics?.efficiency || 0;
        break;
      case 'coherence':
        valueA = a.quantum_coherence || 0;
        valueB = b.quantum_coherence || 0;
        break;
      case 'uptime':
        valueA = a.uptime || 0;
        valueB = b.uptime || 0;
        break;
      case 'memory':
        valueA = a.memory_size || 0;
        valueB = b.memory_size || 0;
        break;
      default:
        valueA = a.agent_id;
        valueB = b.agent_id;
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const getAgentTypeStats = () => {
    const typeStats = {};
    agents.forEach(agent => {
      const type = agent.agent_type;
      if (!typeStats[type]) {
        typeStats[type] = {
          count: 0,
          totalAccuracy: 0,
          totalEfficiency: 0,
          totalCoherence: 0
        };
      }
      typeStats[type].count++;
      typeStats[type].totalAccuracy += agent.performance_metrics?.accuracy || 0;
      typeStats[type].totalEfficiency += agent.performance_metrics?.efficiency || 0;
      typeStats[type].totalCoherence += agent.quantum_coherence || 0;
    });

    return Object.entries(typeStats).map(([type, data]) => ({
      type,
      count: data.count,
      avgAccuracy: data.totalAccuracy / data.count,
      avgEfficiency: data.totalEfficiency / data.count,
      avgCoherence: data.totalCoherence / data.count
    }));
  };

  const getPerformanceDistribution = () => {
    const ranges = [
      { min: 0, max: 0.2, label: '0-20%' },
      { min: 0.2, max: 0.4, label: '20-40%' },
      { min: 0.4, max: 0.6, label: '40-60%' },
      { min: 0.6, max: 0.8, label: '60-80%' },
      { min: 0.8, max: 1.0, label: '80-100%' }
    ];

    return ranges.map(range => {
      const count = agents.filter(agent => {
        const accuracy = agent.performance_metrics?.accuracy || 0;
        return accuracy >= range.min && accuracy < range.max;
      }).length;

      return {
        ...range,
        count,
        percentage: agents.length > 0 ? (count / agents.length) * 100 : 0
      };
    });
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
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

  const typeStats = getAgentTypeStats();
  const performanceDistribution = getPerformanceDistribution();

  return (
    <div className="ai-stats">
      <div className="stats-header">
        <h2>Estatísticas da IA Quântica</h2>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={onRefresh}>
            <i className="fas fa-sync-alt"></i>
            Atualizar
          </button>
        </div>
      </div>

      {/* Estatísticas Globais */}
      <div className="global-stats">
        <h3>Visão Geral</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-robot"></i>
            </div>
            <div className="stat-content">
              <h4>Total de Agentes</h4>
              <span className="stat-value">{stats.total_agents || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="stat-content">
              <h4>Precisão Média</h4>
              <span className="stat-value">
                {stats.average_performance?.accuracy ? 
                  `${(stats.average_performance.accuracy * 100).toFixed(1)}%` : 
                  'N/A'
                }
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            <div className="stat-content">
              <h4>Eficiência Média</h4>
              <span className="stat-value">
                {stats.average_performance?.efficiency ? 
                  `${(stats.average_performance.efficiency * 100).toFixed(1)}%` : 
                  'N/A'
                }
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-atom"></i>
            </div>
            <div className="stat-content">
              <h4>Coerência Quântica</h4>
              <span className="stat-value">
                {stats.average_performance?.quantum_coherence ? 
                  `${(stats.average_performance.quantum_coherence * 100).toFixed(1)}%` : 
                  'N/A'
                }
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-memory"></i>
            </div>
            <div className="stat-content">
              <h4>Uso de Memória</h4>
              <span className="stat-value">{stats.total_memory_usage || 0}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-content">
              <h4>Total de Experiências</h4>
              <span className="stat-value">{stats.total_experience || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas por Tipo de Agente */}
      <div className="type-stats">
        <h3>Estatísticas por Tipo de Agente</h3>
        <div className="type-stats-grid">
          {typeStats.map(typeStat => (
            <div key={typeStat.type} className="type-stat-card">
              <div className="type-header">
                <h4>{typeStat.type}</h4>
                <span className="agent-count">{typeStat.count} agentes</span>
              </div>
              
              <div className="type-metrics">
                <div className="metric">
                  <span>Precisão Média</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${typeStat.avgAccuracy * 100}%` }}
                    ></div>
                  </div>
                  <span>{(typeStat.avgAccuracy * 100).toFixed(1)}%</span>
                </div>

                <div className="metric">
                  <span>Eficiência Média</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${typeStat.avgEfficiency * 100}%` }}
                    ></div>
                  </div>
                  <span>{(typeStat.avgEfficiency * 100).toFixed(1)}%</span>
                </div>

                <div className="metric">
                  <span>Coerência Média</span>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill quantum-coherence"
                      style={{ width: `${typeStat.avgCoherence * 100}%` }}
                    ></div>
                  </div>
                  <span>{(typeStat.avgCoherence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição de Performance */}
      <div className="performance-distribution">
        <h3>Distribuição de Performance</h3>
        <div className="distribution-chart">
          {performanceDistribution.map(range => (
            <div key={range.label} className="distribution-bar">
              <div className="bar-label">{range.label}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ height: `${range.percentage}%` }}
                ></div>
              </div>
              <div className="bar-count">{range.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de Agentes */}
      <div className="agents-table">
        <div className="table-header">
          <h3>Detalhes dos Agentes</h3>
          <div className="table-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="accuracy">Precisão</option>
              <option value="efficiency">Eficiência</option>
              <option value="coherence">Coerência</option>
              <option value="uptime">Uptime</option>
              <option value="memory">Memória</option>
            </select>
            
            <button
              className="btn btn-outline small"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="agents-data-table">
            <thead>
              <tr>
                <th>ID do Agente</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Precisão</th>
                <th>Eficiência</th>
                <th>Coerência</th>
                <th>Memória</th>
                <th>Experiências</th>
                <th>Uptime</th>
              </tr>
            </thead>
            <tbody>
              {sortedAgents.map(agent => (
                <tr key={agent.agent_id}>
                  <td className="agent-id-cell">{agent.agent_id}</td>
                  <td className="agent-type-cell">{agent.agent_type}</td>
                  <td className="agent-state-cell">
                    <span 
                      className="state-indicator"
                      style={{ color: getStateColor(agent.state) }}
                    >
                      ● {agent.state}
                    </span>
                  </td>
                  <td className="metric-cell">
                    {((agent.performance_metrics?.accuracy || 0) * 100).toFixed(1)}%
                  </td>
                  <td className="metric-cell">
                    {((agent.performance_metrics?.efficiency || 0) * 100).toFixed(1)}%
                  </td>
                  <td className="metric-cell">
                    {((agent.quantum_coherence || 0) * 100).toFixed(1)}%
                  </td>
                  <td className="metric-cell">{agent.memory_size || 0}</td>
                  <td className="metric-cell">{agent.experience_count || 0}</td>
                  <td className="metric-cell">{formatUptime(agent.uptime || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .ai-stats {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .stats-header h2 {
          color: #fff;
          font-size: 2.5rem;
        }

        .global-stats {
          margin-bottom: 3rem;
        }

        .global-stats h3 {
          color: var(--fluorescent);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: var(--fluorescent);
          box-shadow: 0 10px 30px rgba(0, 255, 255, 0.2);
        }

        .stat-icon {
          font-size: 2.5rem;
          color: var(--fluorescent);
        }

        .stat-content h4 {
          color: #fff;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .stat-value {
          color: var(--fluorescent);
          font-size: 2rem;
          font-weight: 600;
        }

        .type-stats {
          margin-bottom: 3rem;
        }

        .type-stats h3 {
          color: var(--fluorescent);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .type-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .type-stat-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .type-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          padding-bottom: 0.5rem;
        }

        .type-header h4 {
          color: #fff;
          margin: 0;
          text-transform: capitalize;
        }

        .agent-count {
          color: var(--fluorescent);
          font-size: 0.9rem;
        }

        .type-metrics {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .metric span:first-child {
          color: #fff;
          min-width: 120px;
          font-size: 0.9rem;
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

        .metric span:last-child {
          color: #fff;
          min-width: 50px;
          text-align: right;
          font-size: 0.9rem;
        }

        .performance-distribution {
          margin-bottom: 3rem;
        }

        .performance-distribution h3 {
          color: var(--fluorescent);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .distribution-chart {
          display: flex;
          justify-content: space-around;
          align-items: end;
          height: 200px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 1rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .distribution-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .bar-label {
          color: #fff;
          font-size: 0.9rem;
        }

        .bar-container {
          height: 120px;
          width: 30px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          display: flex;
          align-items: end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(to top, var(--fluorescent), #00aaff);
          border-radius: 15px;
          transition: height 0.3s;
          min-height: 2px;
        }

        .bar-count {
          color: var(--fluorescent);
          font-weight: 600;
        }

        .agents-table {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .table-header h3 {
          color: var(--fluorescent);
          margin: 0;
          font-size: 1.5rem;
        }

        .table-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .table-controls select {
          padding: 0.5rem;
          border-radius: 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .btn.small {
          padding: 0.5rem;
          font-size: 0.9rem;
        }

        .table-container {
          overflow-x: auto;
        }

        .agents-data-table {
          width: 100%;
          border-collapse: collapse;
          color: #fff;
        }

        .agents-data-table th {
          background: rgba(0, 255, 255, 0.1);
          color: var(--fluorescent);
          padding: 1rem 0.5rem;
          text-align: left;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
          font-weight: 600;
        }

        .agents-data-table td {
          padding: 0.8rem 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .agents-data-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .agent-id-cell {
          font-family: monospace;
          color: var(--fluorescent);
        }

        .agent-type-cell {
          text-transform: capitalize;
        }

        .state-indicator {
          font-weight: 600;
        }

        .metric-cell {
          text-align: right;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .stats-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .type-stats-grid {
            grid-template-columns: 1fr;
          }

          .distribution-chart {
            height: 150px;
          }

          .table-header {
            flex-direction: column;
            gap: 1rem;
          }

          .agents-data-table {
            font-size: 0.8rem;
          }

          .agents-data-table th,
          .agents-data-table td {
            padding: 0.5rem 0.3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AIStats;