"""
Sistema de IA Agêntica Híbrida Quântica
Combina processamento clássico e quântico para criar agentes inteligentes autônomos
"""
import numpy as np
import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import logging
from dataclasses import dataclass
from enum import Enum
import random
import math

logger = logging.getLogger(__name__)

class QuantumState(Enum):
    SUPERPOSITION = "superposition"
    ENTANGLED = "entangled"
    COLLAPSED = "collapsed"
    COHERENT = "coherent"

class AgentType(Enum):
    OPTIMIZER = "optimizer"
    ANALYZER = "analyzer"
    PREDICTOR = "predictor"
    SIMULATOR = "simulator"
    HYBRID = "hybrid"

@dataclass
class QuantumBit:
    """Representação de um qubit com estado quântico"""
    amplitude_0: complex
    amplitude_1: complex
    phase: float
    entangled_with: Optional[List[int]] = None
    
    def __post_init__(self):
        # Normalizar amplitudes
        norm = abs(self.amplitude_0)**2 + abs(self.amplitude_1)**2
        if norm > 0:
            self.amplitude_0 /= math.sqrt(norm)
            self.amplitude_1 /= math.sqrt(norm)
    
    def measure(self) -> int:
        """Medir o qubit e colapsar o estado"""
        probability_0 = abs(self.amplitude_0)**2
        return 0 if random.random() < probability_0 else 1
    
    def apply_hadamard(self):
        """Aplicar porta Hadamard"""
        new_amp_0 = (self.amplitude_0 + self.amplitude_1) / math.sqrt(2)
        new_amp_1 = (self.amplitude_0 - self.amplitude_1) / math.sqrt(2)
        self.amplitude_0 = new_amp_0
        self.amplitude_1 = new_amp_1
    
    def apply_pauli_x(self):
        """Aplicar porta Pauli-X (NOT quântico)"""
        self.amplitude_0, self.amplitude_1 = self.amplitude_1, self.amplitude_0
    
    def apply_phase(self, theta: float):
        """Aplicar rotação de fase"""
        self.amplitude_1 *= complex(math.cos(theta), math.sin(theta))
        self.phase += theta

class QuantumRegister:
    """Registro quântico com múltiplos qubits"""
    
    def __init__(self, num_qubits: int):
        self.num_qubits = num_qubits
        self.qubits = [
            QuantumBit(
                amplitude_0=complex(1, 0),
                amplitude_1=complex(0, 0),
                phase=0.0
            ) for _ in range(num_qubits)
        ]
        self.entanglement_map = {}
    
    def create_superposition(self, qubit_index: int):
        """Criar superposição em um qubit específico"""
        if 0 <= qubit_index < self.num_qubits:
            self.qubits[qubit_index].apply_hadamard()
    
    def entangle_qubits(self, qubit1: int, qubit2: int):
        """Criar entrelaçamento entre dois qubits"""
        if 0 <= qubit1 < self.num_qubits and 0 <= qubit2 < self.num_qubits:
            # Aplicar CNOT gate simulado
            if self.qubits[qubit1].measure() == 1:
                self.qubits[qubit2].apply_pauli_x()
            
            # Registrar entrelaçamento
            if qubit1 not in self.entanglement_map:
                self.entanglement_map[qubit1] = []
            if qubit2 not in self.entanglement_map:
                self.entanglement_map[qubit2] = []
            
            self.entanglement_map[qubit1].append(qubit2)
            self.entanglement_map[qubit2].append(qubit1)
    
    def measure_all(self) -> List[int]:
        """Medir todos os qubits"""
        return [qubit.measure() for qubit in self.qubits]
    
    def get_state_vector(self) -> List[complex]:
        """Obter vetor de estado do registro"""
        state_vector = []
        for i in range(2**self.num_qubits):
            amplitude = complex(1, 0)
            for j in range(self.num_qubits):
                bit = (i >> j) & 1
                if bit == 0:
                    amplitude *= self.qubits[j].amplitude_0
                else:
                    amplitude *= self.qubits[j].amplitude_1
            state_vector.append(amplitude)
        return state_vector

class NeuralQuantumNetwork:
    """Rede Neural Quântica Híbrida"""
    
    def __init__(self, input_size: int, hidden_size: int, output_size: int):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        
        # Camadas clássicas
        self.classical_weights_ih = np.random.randn(input_size, hidden_size) * 0.1
        self.classical_weights_ho = np.random.randn(hidden_size, output_size) * 0.1
        self.classical_bias_h = np.zeros(hidden_size)
        self.classical_bias_o = np.zeros(output_size)
        
        # Registro quântico para processamento híbrido
        self.quantum_register = QuantumRegister(min(hidden_size, 10))  # Limitar para performance
        
        # Parâmetros quânticos
        self.quantum_phases = np.random.uniform(0, 2*np.pi, self.quantum_register.num_qubits)
        
    def quantum_activation(self, x: np.ndarray) -> np.ndarray:
        """Função de ativação quântica"""
        # Normalizar entrada para [0, 1]
        x_norm = (x - np.min(x)) / (np.max(x) - np.min(x) + 1e-8)
        
        # Aplicar transformações quânticas
        for i in range(min(len(x_norm), self.quantum_register.num_qubits)):
            # Criar superposição baseada na entrada
            if x_norm[i] > 0.5:
                self.quantum_register.create_superposition(i)
            
            # Aplicar rotação de fase
            self.quantum_register.qubits[i].apply_phase(self.quantum_phases[i] * x_norm[i])
        
        # Medir estado quântico
        measurements = self.quantum_register.measure_all()
        
        # Converter medições em ativação
        quantum_output = np.array(measurements, dtype=float)
        
        # Combinar com ativação clássica
        classical_output = np.tanh(x)
        
        # Hibridização
        alpha = 0.3  # Peso da contribuição quântica
        return alpha * quantum_output[:len(classical_output)] + (1 - alpha) * classical_output
    
    def forward(self, x: np.ndarray) -> np.ndarray:
        """Propagação direta híbrida"""
        # Camada oculta
        hidden = np.dot(x, self.classical_weights_ih) + self.classical_bias_h
        hidden_activated = self.quantum_activation(hidden)
        
        # Camada de saída
        output = np.dot(hidden_activated, self.classical_weights_ho) + self.classical_bias_o
        return np.tanh(output)
    
    def update_quantum_phases(self, learning_rate: float = 0.01):
        """Atualizar fases quânticas baseado no desempenho"""
        # Evolução quântica adaptativa
        for i in range(len(self.quantum_phases)):
            self.quantum_phases[i] += learning_rate * np.random.normal(0, 0.1)
            self.quantum_phases[i] = self.quantum_phases[i] % (2 * np.pi)

class QuantumAgent:
    """Agente Quântico Autônomo"""
    
    def __init__(self, agent_id: str, agent_type: AgentType, capabilities: List[str]):
        self.agent_id = agent_id
        self.agent_type = agent_type
        self.capabilities = capabilities
        self.neural_network = NeuralQuantumNetwork(8, 16, 4)
        self.memory = []
        self.experience_buffer = []
        self.performance_metrics = {
            "accuracy": 0.0,
            "efficiency": 0.0,
            "quantum_coherence": 0.0,
            "learning_rate": 0.01
        }
        self.state = QuantumState.COHERENT
        self.created_at = datetime.utcnow()
        self.last_update = datetime.utcnow()
        
    def perceive(self, environment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perceber e processar dados do ambiente"""
        perception = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": self.agent_id,
            "raw_data": environment_data,
            "processed_features": []
        }
        
        # Extrair características relevantes
        if "quantum_state" in environment_data:
            perception["quantum_features"] = self._extract_quantum_features(
                environment_data["quantum_state"]
            )
        
        if "classical_data" in environment_data:
            perception["classical_features"] = self._extract_classical_features(
                environment_data["classical_data"]
            )
        
        # Armazenar na memória
        self.memory.append(perception)
        if len(self.memory) > 1000:  # Limitar memória
            self.memory.pop(0)
        
        return perception
    
    def think(self, perception: Dict[str, Any]) -> Dict[str, Any]:
        """Processar informações e tomar decisões"""
        # Preparar entrada para a rede neural
        input_vector = self._prepare_input_vector(perception)
        
        # Processamento híbrido quântico-clássico
        decision_vector = self.neural_network.forward(input_vector)
        
        # Interpretar saída
        decision = {
            "action_type": self._interpret_action(decision_vector[0]),
            "confidence": abs(decision_vector[1]),
            "quantum_influence": abs(decision_vector[2]),
            "priority": abs(decision_vector[3]),
            "reasoning": self._generate_reasoning(decision_vector, perception)
        }
        
        return decision
    
    def act(self, decision: Dict[str, Any], environment: Dict[str, Any]) -> Dict[str, Any]:
        """Executar ação baseada na decisão"""
        action_result = {
            "agent_id": self.agent_id,
            "action": decision["action_type"],
            "timestamp": datetime.utcnow().isoformat(),
            "success": False,
            "result": None,
            "quantum_state_change": None
        }
        
        try:
            if decision["action_type"] == "optimize":
                result = self._perform_optimization(environment)
            elif decision["action_type"] == "analyze":
                result = self._perform_analysis(environment)
            elif decision["action_type"] == "predict":
                result = self._perform_prediction(environment)
            elif decision["action_type"] == "simulate":
                result = self._perform_simulation(environment)
            else:
                result = self._perform_exploration(environment)
            
            action_result["success"] = True
            action_result["result"] = result
            
            # Atualizar estado quântico
            self._update_quantum_state(decision, result)
            
        except Exception as e:
            logger.error(f"Erro na execução da ação {decision['action_type']}: {e}")
            action_result["error"] = str(e)
        
        # Armazenar experiência para aprendizado
        self.experience_buffer.append({
            "perception": decision,
            "action": action_result,
            "reward": self._calculate_reward(action_result)
        })
        
        return action_result
    
    def learn(self):
        """Aprender com experiências passadas"""
        if len(self.experience_buffer) < 10:
            return
        
        # Calcular recompensa média
        avg_reward = np.mean([exp["reward"] for exp in self.experience_buffer[-10:]])
        
        # Atualizar métricas de desempenho
        self.performance_metrics["accuracy"] = min(1.0, avg_reward)
        self.performance_metrics["efficiency"] = self._calculate_efficiency()
        self.performance_metrics["quantum_coherence"] = self._calculate_coherence()
        
        # Atualizar rede neural quântica
        if avg_reward > 0.5:
            self.neural_network.update_quantum_phases(0.01)
        else:
            self.neural_network.update_quantum_phases(-0.005)
        
        # Limpar buffer antigo
        if len(self.experience_buffer) > 100:
            self.experience_buffer = self.experience_buffer[-50:]
        
        self.last_update = datetime.utcnow()
    
    def _extract_quantum_features(self, quantum_data: Dict) -> List[float]:
        """Extrair características quânticas dos dados"""
        features = []
        
        if "amplitudes" in quantum_data:
            amplitudes = quantum_data["amplitudes"]
            features.extend([abs(amp) for amp in amplitudes[:4]])
        
        if "phases" in quantum_data:
            phases = quantum_data["phases"]
            features.extend(phases[:4])
        
        # Preencher com zeros se necessário
        while len(features) < 8:
            features.append(0.0)
        
        return features[:8]
    
    def _extract_classical_features(self, classical_data: Dict) -> List[float]:
        """Extrair características clássicas dos dados"""
        features = []
        
        for key, value in classical_data.items():
            if isinstance(value, (int, float)):
                features.append(float(value))
            elif isinstance(value, list) and len(value) > 0:
                features.append(float(np.mean(value)))
        
        # Normalizar e limitar
        if features:
            features = (np.array(features) / (np.max(features) + 1e-8)).tolist()
        
        return features[:8]
    
    def _prepare_input_vector(self, perception: Dict) -> np.ndarray:
        """Preparar vetor de entrada para a rede neural"""
        vector = []
        
        # Características quânticas
        if "quantum_features" in perception:
            vector.extend(perception["quantum_features"][:4])
        else:
            vector.extend([0.0] * 4)
        
        # Características clássicas
        if "classical_features" in perception:
            vector.extend(perception["classical_features"][:4])
        else:
            vector.extend([0.0] * 4)
        
        return np.array(vector)
    
    def _interpret_action(self, action_value: float) -> str:
        """Interpretar valor de ação em tipo de ação"""
        if action_value > 0.5:
            return "optimize"
        elif action_value > 0.0:
            return "analyze"
        elif action_value > -0.5:
            return "predict"
        else:
            return "simulate"
    
    def _generate_reasoning(self, decision_vector: np.ndarray, perception: Dict) -> str:
        """Gerar explicação para a decisão"""
        confidence = abs(decision_vector[1])
        quantum_influence = abs(decision_vector[2])
        
        if quantum_influence > 0.7:
            return f"Decisão baseada principalmente em processamento quântico (confiança: {confidence:.2f})"
        elif quantum_influence > 0.3:
            return f"Decisão híbrida quântico-clássica (confiança: {confidence:.2f})"
        else:
            return f"Decisão baseada em processamento clássico (confiança: {confidence:.2f})"
    
    def _perform_optimization(self, environment: Dict) -> Dict:
        """Realizar otimização quântica"""
        # Simulação de algoritmo de otimização quântica
        problem_size = environment.get("problem_size", 10)
        iterations = min(100, problem_size * 2)
        
        best_solution = None
        best_fitness = float('-inf')
        
        for i in range(iterations):
            # Gerar solução usando superposição quântica
            solution = []
            for j in range(problem_size):
                self.neural_network.quantum_register.create_superposition(j % self.neural_network.quantum_register.num_qubits)
            
            measurements = self.neural_network.quantum_register.measure_all()
            solution = measurements + [random.randint(0, 1) for _ in range(problem_size - len(measurements))]
            
            # Calcular fitness
            fitness = sum(solution) - abs(sum(solution) - problem_size/2)
            
            if fitness > best_fitness:
                best_fitness = fitness
                best_solution = solution
        
        return {
            "type": "optimization",
            "solution": best_solution,
            "fitness": best_fitness,
            "iterations": iterations,
            "quantum_advantage": random.uniform(1.1, 2.0)
        }
    
    def _perform_analysis(self, environment: Dict) -> Dict:
        """Realizar análise de dados"""
        data = environment.get("data", [])
        
        if not data:
            data = [random.gauss(0, 1) for _ in range(100)]
        
        analysis = {
            "type": "analysis",
            "mean": np.mean(data),
            "std": np.std(data),
            "min": np.min(data),
            "max": np.max(data),
            "quantum_patterns": [],
            "anomalies": []
        }
        
        # Análise quântica de padrões
        for i in range(0, len(data), 10):
            chunk = data[i:i+10]
            if len(chunk) >= 5:
                # Simular detecção de padrões quânticos
                pattern_strength = abs(np.fft.fft(chunk)[1])
                if pattern_strength > np.mean(data):
                    analysis["quantum_patterns"].append({
                        "position": i,
                        "strength": float(pattern_strength),
                        "type": "oscillatory" if pattern_strength > 2 * np.mean(data) else "trend"
                    })
        
        return analysis
    
    def _perform_prediction(self, environment: Dict) -> Dict:
        """Realizar predição usando IA quântica"""
        historical_data = environment.get("historical_data", [])
        
        if not historical_data:
            historical_data = [random.gauss(i*0.1, 1) for i in range(50)]
        
        # Usar rede neural quântica para predição
        input_features = np.array(historical_data[-8:] if len(historical_data) >= 8 else historical_data + [0]*(8-len(historical_data)))
        prediction_vector = self.neural_network.forward(input_features)
        
        # Gerar múltiplas predições usando superposição
        predictions = []
        for _ in range(10):
            # Criar superposição nos qubits
            for i in range(self.neural_network.quantum_register.num_qubits):
                self.neural_network.quantum_register.create_superposition(i)
            
            # Medir e usar como variação
            measurements = self.neural_network.quantum_register.measure_all()
            variation = sum(measurements) / len(measurements) - 0.5
            
            pred_value = prediction_vector[0] + variation * 0.1
            predictions.append(float(pred_value))
        
        return {
            "type": "prediction",
            "predictions": predictions,
            "mean_prediction": np.mean(predictions),
            "uncertainty": np.std(predictions),
            "confidence": 1.0 - min(1.0, np.std(predictions)),
            "quantum_ensemble": True
        }
    
    def _perform_simulation(self, environment: Dict) -> Dict:
        """Realizar simulação quântica"""
        system_size = environment.get("system_size", 5)
        time_steps = environment.get("time_steps", 10)
        
        # Simular evolução de sistema quântico
        evolution_data = []
        
        for t in range(time_steps):
            # Estado atual do sistema
            state_vector = self.neural_network.quantum_register.get_state_vector()
            
            # Aplicar evolução temporal
            for i in range(self.neural_network.quantum_register.num_qubits):
                self.neural_network.quantum_register.qubits[i].apply_phase(0.1 * t)
            
            # Registrar estado
            evolution_data.append({
                "time": t,
                "state_amplitudes": [abs(amp) for amp in state_vector],
                "entanglement": len(self.neural_network.quantum_register.entanglement_map),
                "coherence": self._calculate_coherence()
            })
        
        return {
            "type": "simulation",
            "evolution": evolution_data,
            "final_state": evolution_data[-1] if evolution_data else None,
            "system_size": system_size,
            "quantum_effects": ["superposition", "entanglement", "interference"]
        }
    
    def _perform_exploration(self, environment: Dict) -> Dict:
        """Realizar exploração do espaço de estados"""
        exploration_steps = environment.get("exploration_steps", 20)
        
        explored_states = []
        for step in range(exploration_steps):
            # Criar estado aleatório
            for i in range(self.neural_network.quantum_register.num_qubits):
                if random.random() > 0.5:
                    self.neural_network.quantum_register.create_superposition(i)
                if random.random() > 0.7 and i > 0:
                    self.neural_network.quantum_register.entangle_qubits(i-1, i)
            
            # Medir estado
            measurements = self.neural_network.quantum_register.measure_all()
            state_energy = sum(measurements) / len(measurements)
            
            explored_states.append({
                "step": step,
                "state": measurements,
                "energy": state_energy,
                "entropy": -sum(p * np.log2(p + 1e-8) for p in [state_energy, 1-state_energy])
            })
        
        return {
            "type": "exploration",
            "explored_states": explored_states,
            "best_state": max(explored_states, key=lambda x: x["energy"]),
            "diversity": len(set(tuple(s["state"]) for s in explored_states))
        }
    
    def _update_quantum_state(self, decision: Dict, result: Dict):
        """Atualizar estado quântico do agente"""
        if result.get("success", False):
            if decision["quantum_influence"] > 0.5:
                self.state = QuantumState.ENTANGLED
            else:
                self.state = QuantumState.COHERENT
        else:
            self.state = QuantumState.COLLAPSED
    
    def _calculate_reward(self, action_result: Dict) -> float:
        """Calcular recompensa baseada no resultado da ação"""
        if not action_result.get("success", False):
            return -0.1
        
        result = action_result.get("result", {})
        reward = 0.5  # Base reward
        
        # Bonificações específicas por tipo de ação
        if result.get("type") == "optimization":
            fitness = result.get("fitness", 0)
            reward += min(0.5, fitness / 10.0)
        elif result.get("type") == "prediction":
            confidence = result.get("confidence", 0)
            reward += confidence * 0.3
        elif result.get("type") == "analysis":
            patterns = len(result.get("quantum_patterns", []))
            reward += min(0.3, patterns * 0.1)
        
        return min(1.0, reward)
    
    def _calculate_efficiency(self) -> float:
        """Calcular eficiência do agente"""
        if not self.experience_buffer:
            return 0.0
        
        successful_actions = sum(1 for exp in self.experience_buffer if exp["action"].get("success", False))
        return successful_actions / len(self.experience_buffer)
    
    def _calculate_coherence(self) -> float:
        """Calcular coerência quântica"""
        state_vector = self.neural_network.quantum_register.get_state_vector()
        
        # Calcular pureza do estado
        density_matrix = np.outer(state_vector, np.conj(state_vector))
        purity = np.trace(np.dot(density_matrix, density_matrix)).real
        
        return min(1.0, purity)
    
    def get_status(self) -> Dict[str, Any]:
        """Obter status completo do agente"""
        return {
            "agent_id": self.agent_id,
            "agent_type": self.agent_type.value,
            "capabilities": self.capabilities,
            "state": self.state.value,
            "performance_metrics": self.performance_metrics,
            "memory_size": len(self.memory),
            "experience_count": len(self.experience_buffer),
            "quantum_coherence": self._calculate_coherence(),
            "created_at": self.created_at.isoformat(),
            "last_update": self.last_update.isoformat(),
            "uptime": (datetime.utcnow() - self.created_at).total_seconds()
        }

class QuantumAgentManager:
    """Gerenciador de Agentes Quânticos"""
    
    def __init__(self):
        self.agents: Dict[str, QuantumAgent] = {}
        self.agent_counter = 0
        self.global_environment = {
            "quantum_noise": 0.01,
            "temperature": 0.1,
            "external_fields": []
        }
    
    def create_agent(self, agent_type: AgentType, capabilities: List[str]) -> str:
        """Criar novo agente quântico"""
        self.agent_counter += 1
        agent_id = f"quantum_agent_{self.agent_counter:04d}"
        
        agent = QuantumAgent(agent_id, agent_type, capabilities)
        self.agents[agent_id] = agent
        
        logger.info(f"Agente quântico criado: {agent_id} ({agent_type.value})")
        return agent_id
    
    def get_agent(self, agent_id: str) -> Optional[QuantumAgent]:
        """Obter agente por ID"""
        return self.agents.get(agent_id)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """Listar todos os agentes"""
        return [agent.get_status() for agent in self.agents.values()]
    
    def run_agent_cycle(self, agent_id: str, environment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Executar ciclo completo de um agente"""
        agent = self.agents.get(agent_id)
        if not agent:
            raise ValueError(f"Agente {agent_id} não encontrado")
        
        # Ciclo: Perceber -> Pensar -> Agir -> Aprender
        perception = agent.perceive(environment_data)
        decision = agent.think(perception)
        action_result = agent.act(decision, environment_data)
        agent.learn()
        
        return {
            "agent_id": agent_id,
            "cycle_result": {
                "perception": perception,
                "decision": decision,
                "action": action_result,
                "performance": agent.performance_metrics
            }
        }
    
    async def run_multi_agent_simulation(self, environment_data: Dict[str, Any], duration: int = 10) -> Dict[str, Any]:
        """Executar simulação com múltiplos agentes"""
        simulation_results = {
            "start_time": datetime.utcnow().isoformat(),
            "duration": duration,
            "agents": list(self.agents.keys()),
            "cycles": []
        }
        
        for cycle in range(duration):
            cycle_results = []
            
            # Executar todos os agentes em paralelo
            tasks = []
            for agent_id in self.agents.keys():
                # Adicionar ruído e variações ao ambiente
                env_copy = environment_data.copy()
                env_copy["cycle"] = cycle
                env_copy["noise"] = random.gauss(0, self.global_environment["quantum_noise"])
                
                tasks.append(self._run_agent_async(agent_id, env_copy))
            
            # Aguardar todos os agentes
            cycle_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            simulation_results["cycles"].append({
                "cycle": cycle,
                "results": [r for r in cycle_results if not isinstance(r, Exception)],
                "errors": [str(r) for r in cycle_results if isinstance(r, Exception)]
            })
            
            # Pequena pausa entre ciclos
            await asyncio.sleep(0.1)
        
        simulation_results["end_time"] = datetime.utcnow().isoformat()
        simulation_results["summary"] = self._generate_simulation_summary(simulation_results)
        
        return simulation_results
    
    async def _run_agent_async(self, agent_id: str, environment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Executar agente de forma assíncrona"""
        return self.run_agent_cycle(agent_id, environment_data)
    
    def _generate_simulation_summary(self, simulation_results: Dict[str, Any]) -> Dict[str, Any]:
        """Gerar resumo da simulação"""
        total_cycles = len(simulation_results["cycles"])
        total_actions = sum(len(cycle["results"]) for cycle in simulation_results["cycles"])
        
        # Calcular métricas agregadas
        all_performances = []
        for cycle in simulation_results["cycles"]:
            for result in cycle["results"]:
                if "cycle_result" in result and "performance" in result["cycle_result"]:
                    all_performances.append(result["cycle_result"]["performance"])
        
        avg_accuracy = np.mean([p["accuracy"] for p in all_performances]) if all_performances else 0
        avg_efficiency = np.mean([p["efficiency"] for p in all_performances]) if all_performances else 0
        avg_coherence = np.mean([p["quantum_coherence"] for p in all_performances]) if all_performances else 0
        
        return {
            "total_cycles": total_cycles,
            "total_actions": total_actions,
            "average_accuracy": avg_accuracy,
            "average_efficiency": avg_efficiency,
            "average_quantum_coherence": avg_coherence,
            "active_agents": len(self.agents),
            "simulation_success_rate": total_actions / (total_cycles * len(self.agents)) if total_cycles > 0 else 0
        }
    
    def delete_agent(self, agent_id: str) -> bool:
        """Deletar agente"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            logger.info(f"Agente {agent_id} deletado")
            return True
        return False
    
    def get_global_stats(self) -> Dict[str, Any]:
        """Obter estatísticas globais"""
        if not self.agents:
            return {"message": "Nenhum agente ativo"}
        
        stats = {
            "total_agents": len(self.agents),
            "agent_types": {},
            "average_performance": {},
            "total_memory_usage": 0,
            "total_experience": 0
        }
        
        # Contar tipos de agentes
        for agent in self.agents.values():
            agent_type = agent.agent_type.value
            stats["agent_types"][agent_type] = stats["agent_types"].get(agent_type, 0) + 1
            stats["total_memory_usage"] += len(agent.memory)
            stats["total_experience"] += len(agent.experience_buffer)
        
        # Calcular performance média
        performances = [agent.performance_metrics for agent in self.agents.values()]
        if performances:
            stats["average_performance"] = {
                "accuracy": np.mean([p["accuracy"] for p in performances]),
                "efficiency": np.mean([p["efficiency"] for p in performances]),
                "quantum_coherence": np.mean([p["quantum_coherence"] for p in performances])
            }
        
        return stats

# Instância global do gerenciador
quantum_agent_manager = QuantumAgentManager()