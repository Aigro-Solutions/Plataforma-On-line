import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login, error } = useAuth();
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  
  // Esquema de validação
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Nome de usuário é obrigatório'),
    password: Yup.string()
      .required('Senha é obrigatória')
  });
  
  // Valores iniciais
  const initialValues = {
    username: '',
    password: ''
  };
  
  // Função de submissão
  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError('');
    
    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Nome de usuário ou senha incorretos');
      }
    } catch (error) {
      setLoginError('Erro ao fazer login. Tente novamente.');
      console.error('Erro de login:', error);
    }
    
    setSubmitting(false);
  };
  
  return (
    <div className="login-page">
      <div className="form-container">
        <h2 className="form-title">Entrar no QuantumOS</h2>
        
        {(loginError || error) && (
          <div className="error-message">
            {loginError || error}
          </div>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Nome de Usuário</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Seu nome de usuário"
                />
                <ErrorMessage name="username" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Sua senha"
                />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>
              
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
              
              <div className="form-footer">
                Não tem uma conta? <Link to="/register" className="form-link">Registre-se</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
        }
        
        .error-message {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 0.8rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Login;