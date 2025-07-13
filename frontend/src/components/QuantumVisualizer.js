import React, { useState, useEffect, useRef } from 'react';

const QuantumVisualizer = ({ agents }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [visualizationMode, setVisualizationMode] = useState('quantum_state');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [isAnimating, agents, visualizationMode]);

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Fundo com gradiente quântico
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
      gradient.addColorStop(0, 'rgba(10, 26, 47, 0.8)');
      gradient.addColorStop(0.5, 'rgba(13, 59, 102, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      if (visualizationMode === 'quantum_state') {
        drawQuantumStates(ctx, width, height, time);
      } else if (visualizationMode === 'agent_network') {
        drawAgentNetwork(ctx, width, height, time);
      } else if (visualizationMode === 'performance_waves') {
        drawPerformanceWaves(ctx, width, height, time);
      }

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawQuantumStates = (ctx, width, height, time) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 3;

    // Desenhar círculos quânticos para cada agente
    agents.forEach((agent, index) => {
      const angle = (index / agents.length) * 2 * Math.PI + time;
      const radius = maxRadius * (0.7 + 0.3 * Math.sin(time * 2 + index));
      
      const x = centerX + Math.cos(angle) * radius * 0.6;
      const y = centerY + Math.sin(angle) * radius * 0.6;

      // Estado quântico do agente
      const coherence = agent.quantum_coherence || 0.5;
      const accuracy = agent.performance_metrics?.accuracy || 0.5;

      // Círculo principal do agente
      ctx.beginPath();
      ctx.arc(x, y, 30 + coherence * 20, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + coherence * 0.7})`;
      ctx.lineWidth = 2 + coherence * 3;
      ctx.stroke();

      // Partículas quânticas orbitando
      for (let i = 0; i < 4; i++) {
        const particleAngle = time * 3 + i * Math.PI / 2;
        const particleRadius = 40 + coherence * 15;
        const px = x + Math.cos(particleAngle) * particleRadius;
        const py = y + Math.sin(particleAngle) * particleRadius;

        ctx.beginPath();
        ctx.arc(px, py, 3 + accuracy * 5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(time * 4 + i) * 0.3})`;
        ctx.fill();

        // Trilha da partícula
        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(0, 255, 255, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Ondas de interferência
      if (coherence > 0.7) {
        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath();
          ctx.arc(x, y, 60 + wave * 20 + time * 30, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 0, 255, ${0.3 - wave * 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Label do agente
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(agent.agent_id.split('_').pop(), x, y - 60);
    });

    // Entrelaçamento entre agentes
    if (agents.length > 1) {
      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          const agent1 = agents[i];
          const agent2 = agents[j];
          
          const angle1 = (i / agents.length) * 2 * Math.PI + time;
          const angle2 = (j / agents.length) * 2 * Math.PI + time;
          const radius1 = maxRadius * (0.7 + 0.3 * Math.sin(time * 2 + i));
          const radius2 = maxRadius * (0.7 + 0.3 * Math.sin(time * 2 + j));
          
          const x1 = centerX + Math.cos(angle1) * radius1 * 0.6;
          const y1 = centerY + Math.sin(angle1) * radius1 * 0.6;
          const x2 = centerX + Math.cos(angle2) * radius2 * 0.6;
          const y2 = centerY + Math.sin(angle2) * radius2 * 0.6;

          // Linha de entrelaçamento
          const entanglement = Math.min(agent1.quantum_coherence || 0, agent2.quantum_coherence || 0);
          if (entanglement > 0.5) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(255, 0, 255, ${entanglement * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }
  };

  const drawAgentNetwork = (ctx, width, height, time) => {
    if (agents.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const networkRadius = Math.min(width, height) / 3;

    // Desenhar nós dos agentes
    agents.forEach((agent, index) => {
      const angle = (index / agents.length) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * networkRadius;
      const y = centerY + Math.sin(angle) * networkRadius;

      const efficiency = agent.performance_metrics?.efficiency || 0;
      const accuracy = agent.performance_metrics?.accuracy || 0;

      // Nó do agente
      ctx.beginPath();
      ctx.arc(x, y, 15 + efficiency * 25, 0, 2 * Math.PI);
      
      // Cor baseada no tipo de agente
      const agentColors = {
        'optimizer': 'rgba(255, 100, 0, 0.8)',
        'analyzer': 'rgba(0, 255, 100, 0.8)',
        'predictor': 'rgba(100, 0, 255, 0.8)',
        'simulator': 'rgba(255, 255, 0, 0.8)',
        'hybrid': 'rgba(0, 255, 255, 0.8)'
      };
      
      ctx.fillStyle = agentColors[agent.agent_type] || 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulso baseado na atividade
      const pulseRadius = 20 + efficiency * 30 + Math.sin(time * 4 + index) * 10;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * accuracy})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(agent.agent_type, x, y + 50);
    });

    // Conexões entre agentes
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const angle1 = (i / agents.length) * 2 * Math.PI;
        const angle2 = (j / agents.length) * 2 * Math.PI;
        
        const x1 = centerX + Math.cos(angle1) * networkRadius;
        const y1 = centerY + Math.sin(angle1) * networkRadius;
        const x2 = centerX + Math.cos(angle2) * networkRadius;
        const y2 = centerY + Math.sin(angle2) * networkRadius;

        // Força da conexão baseada na similaridade de performance
        const agent1 = agents[i];
        const agent2 = agents[j];
        const similarity = 1 - Math.abs(
          (agent1.performance_metrics?.accuracy || 0) - 
          (agent2.performance_metrics?.accuracy || 0)
        );

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${similarity * 0.3})`;
        ctx.lineWidth = similarity * 2;
        ctx.stroke();
      }
    }

    // Centro da rede
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.fill();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawPerformanceWaves = (ctx, width, height, time) => {
    if (agents.length === 0) return;

    const waveHeight = height / (agents.length + 1);
    
    agents.forEach((agent, index) => {
      const y = waveHeight * (index + 1);
      const accuracy = agent.performance_metrics?.accuracy || 0;
      const efficiency = agent.performance_metrics?.efficiency || 0;
      const coherence = agent.quantum_coherence || 0;

      // Onda de precisão
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const waveY = y - 30 + Math.sin((x * 0.02) + time * 3) * accuracy * 20;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();

      // Onda de eficiência
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const waveY = y + Math.sin((x * 0.015) + time * 2.5) * efficiency * 25;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();

      // Onda de coerência quântica
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 2) {
        const waveY = y + 30 + Math.sin((x * 0.01) + time * 4) * coherence * 15;
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();

      // Label do agente
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(agent.agent_id, 10, y - 40);
      
      // Métricas
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillText(`Precisão: ${(accuracy * 100).toFixed(1)}%`, 10, y - 25);
      ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.fillText(`Eficiência: ${(efficiency * 100).toFixed(1)}%`, 10, y - 15);
      ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
      ctx.fillText(`Coerência: ${(coherence * 100).toFixed(1)}%`, 10, y - 5);
    });
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Detectar clique em agente (implementação simplificada)
    if (agents.length > 0) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const networkRadius = Math.min(canvas.width, canvas.height) / 3;

      agents.forEach((agent, index) => {
        const angle = (index / agents.length) * 2 * Math.PI;
        const agentX = centerX + Math.cos(angle) * networkRadius;
        const agentY = centerY + Math.sin(angle) * networkRadius;

        const distance = Math.sqrt((x - agentX) ** 2 + (y - agentY) ** 2);
        if (distance < 40) {
          setSelectedAgent(agent);
        }
      });
    }
  };

  return (
    <div className="quantum-visualizer">
      <div className="visualizer-header">
        <h2>Visualizador Quântico</h2>
        <p>Visualização em tempo real dos estados quânticos e performance dos agentes</p>
      </div>

      <div className="visualizer-controls">
        <div className="control-group">
          <label>Modo de Visualização:</label>
          <select
            value={visualizationMode}
            onChange={(e) => setVisualizationMode(e.target.value)}
          >
            <option value="quantum_state">Estados Quânticos</option>
            <option value="agent_network">Rede de Agentes</option>
            <option value="performance_waves">Ondas de Performance</option>
          </select>
        </div>

        <div className="control-group">
          <button
            className={`btn ${isAnimating ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? (
              <>
                <i className="fas fa-pause"></i>
                Pausar
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                Animar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="visualizer-canvas-container">
        <canvas
          ref={canvasRef}
          className="visualizer-canvas"
          onClick={handleCanvasClick}
        />
        
        {agents.length === 0 && (
          <div className="no-agents-overlay">
            <i className="fas fa-robot"></i>
            <h3>Nenhum agente para visualizar</h3>
            <p>Crie agentes quânticos para ver suas visualizações</p>
          </div>
        )}
      </div>

      <div className="visualizer-legend">
        <h4>Legenda</h4>
        <div className="legend-grid">
          {visualizationMode === 'quantum_state' && (
            <>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(0, 255, 255, 0.8)' }}></div>
                <span>Estados Quânticos</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 0, 255, 0.8)' }}></div>
                <span>Entrelaçamento</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.8)' }}></div>
                <span>Partículas Quânticas</span>
              </div>
            </>
          )}
          
          {visualizationMode === 'agent_network' && (
            <>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 100, 0, 0.8)' }}></div>
                <span>Otimizador</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(0, 255, 100, 0.8)' }}></div>
                <span>Analisador</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(100, 0, 255, 0.8)' }}></div>
                <span>Preditor</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 255, 0, 0.8)' }}></div>
                <span>Simulador</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(0, 255, 255, 0.8)' }}></div>
                <span>Híbrido</span>
              </div>
            </>
          )}
          
          {visualizationMode === 'performance_waves' && (
            <>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(0, 255, 0, 0.8)' }}></div>
                <span>Precisão</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 255, 0, 0.8)' }}></div>
                <span>Eficiência</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ background: 'rgba(255, 0, 255, 0.8)' }}></div>
                <span>Coerência Quântica</span>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedAgent && (
        <div className="agent-info-panel">
          <div className="panel-header">
            <h4>Informações do Agente</h4>
            <button
              className="close-button"
              onClick={() => setSelectedAgent(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="agent-details">
            <div className="detail-row">
              <span>ID:</span>
              <span>{selectedAgent.agent_id}</span>
            </div>
            <div className="detail-row">
              <span>Tipo:</span>
              <span>{selectedAgent.agent_type}</span>
            </div>
            <div className="detail-row">
              <span>Estado:</span>
              <span>{selectedAgent.state}</span>
            </div>
            <div className="detail-row">
              <span>Precisão:</span>
              <span>{((selectedAgent.performance_metrics?.accuracy || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="detail-row">
              <span>Eficiência:</span>
              <span>{((selectedAgent.performance_metrics?.efficiency || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="detail-row">
              <span>Coerência:</span>
              <span>{((selectedAgent.quantum_coherence || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quantum-visualizer {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1rem;
        }

        .visualizer-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .visualizer-header h2 {
          color: #fff;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .visualizer-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
        }

        .visualizer-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .control-group label {
          color: #fff;
          font-weight: 500;
        }

        .control-group select {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
        }

        .visualizer-canvas-container {
          position: relative;
          width: 100%;
          height: 600px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 15px;
          border: 2px solid rgba(0, 255, 255, 0.3);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .visualizer-canvas {
          width: 100%;
          height: 100%;
          cursor: crosshair;
        }

        .no-agents-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
        }

        .no-agents-overlay i {
          font-size: 4rem;
          color: var(--fluorescent);
          margin-bottom: 1rem;
        }

        .no-agents-overlay h3 {
          margin-bottom: 0.5rem;
        }

        .visualizer-legend {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid rgba(0, 255, 255, 0.2);
        }

        .visualizer-legend h4 {
          color: var(--fluorescent);
          margin-bottom: 1rem;
          text-align: center;
        }

        .legend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .agent-info-panel {
          position: fixed;
          top: 50%;
          right: 2rem;
          transform: translateY(-50%);
          width: 300px;
          background: rgba(10, 26, 47, 0.95);
          border-radius: 10px;
          border: 1px solid var(--fluorescent);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 255, 255, 0.3);
        }

        .panel-header h4 {
          color: var(--fluorescent);
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.3s;
        }

        .close-button:hover {
          color: var(--fluorescent);
        }

        .agent-details {
          padding: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .detail-row span:first-child {
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-row span:last-child {
          color: var(--fluorescent);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .visualizer-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .visualizer-canvas-container {
            height: 400px;
          }

          .legend-grid {
            grid-template-columns: 1fr;
          }

          .agent-info-panel {
            position: fixed;
            top: auto;
            bottom: 2rem;
            right: 2rem;
            left: 2rem;
            width: auto;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default QuantumVisualizer;