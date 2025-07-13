import axios from 'axios';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratar erros de autenticação (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Serviços de autenticação
export const authService = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (userData) => api.put('/api/auth/me', userData),
  updateProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/auth/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Serviços de projetos
export const projectService = {
  getProjects: () => api.get('/api/projects'),
  getProject: (id) => api.get(`/api/projects/${id}`),
  createProject: (projectData) => api.post('/api/projects', projectData),
  updateProject: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/api/projects/${id}`),
};

// Serviços de jobs quânticos
export const quantumJobService = {
  getJobs: (projectId) => api.get(`/api/projects/${projectId}/quantum-jobs`),
  getJob: (jobId) => api.get(`/api/quantum-jobs/${jobId}`),
  createJob: (projectId, jobData) => api.post(`/api/projects/${projectId}/quantum-jobs`, jobData),
  updateJob: (jobId, jobData) => api.put(`/api/quantum-jobs/${jobId}`, jobData),
  deleteJob: (jobId) => api.delete(`/api/quantum-jobs/${jobId}`),
};

// Serviços de IA Agêntica Quântica
export const quantumAIService = {
  // Agentes
  createAgent: (agentData) => api.post('/api/quantum-ai/agents', agentData),
  getAgents: () => api.get('/api/quantum-ai/agents'),
  getAgent: (agentId) => api.get(`/api/quantum-ai/agents/${agentId}`),
  runAgent: (agentId, environmentData) => api.post(`/api/quantum-ai/agents/${agentId}/run`, environmentData),
  deleteAgent: (agentId) => api.delete(`/api/quantum-ai/agents/${agentId}`),
  
  // Simulações
  runSimulation: (simulationData) => api.post('/api/quantum-ai/simulation', simulationData),
  
  // Estatísticas e tipos
  getStats: () => api.get('/api/quantum-ai/stats'),
  getAgentTypes: () => api.get('/api/quantum-ai/agent-types'),
};