import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../services/api';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Verificar se o token está expirado
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return true;
    }
  };

  // Configurar o token no cabeçalho das requisições
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Carregar usuário a partir do token
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      
      if (token && !isTokenExpired(token)) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          logout();
        }
      } else if (token) {
        // Token expirado
        logout();
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  // Função de login
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/login', { username, password });
      
      const { access_token, user_id, username: userName, is_admin } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser({ id: user_id, username: userName, is_admin });
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError(error.response?.data?.detail || 'Erro ao fazer login');
      return false;
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setError(error.response?.data?.detail || 'Erro ao registrar');
      return { success: false, error: error.response?.data?.detail || 'Erro ao registrar' };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!token && !isTokenExpired(token);
  };

  // Verificar se o usuário é administrador
  const isAdmin = () => {
    return user?.is_admin === true;
  };

  // Atualizar perfil do usuário
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await api.put('/api/auth/me', userData);
      setUser(prev => ({ ...prev, ...response.data }));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error.response?.data?.detail || 'Erro ao atualizar perfil');
      return { success: false, error: error.response?.data?.detail || 'Erro ao atualizar perfil' };
    }
  };

  // Atualizar foto de perfil
  const updateProfilePicture = async (file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/api/auth/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(prev => ({ ...prev, profile_picture: response.data.profile_picture }));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar foto de perfil:', error);
      setError(error.response?.data?.detail || 'Erro ao atualizar foto de perfil');
      return { success: false, error: error.response?.data?.detail || 'Erro ao atualizar foto de perfil' };
    }
  };

  // Valor do contexto
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    updateProfile,
    updateProfilePicture
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;