import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const { register } = useAuth();
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();
  
  // Esquema de validação
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
      .max(30, 'Nome de usuário deve ter no máximo 30 caracteres')
      .matches(/^[a-zA-Z0-9_.-]+$/, 'Nome de usuário pode conter apenas letras, números, underscores, pontos e hífens')
      .required('Nome de usuário é obrigatório'),
    email: Yup.string()
      .email('Email inválido')
      .required('Email é obrigatório'),
    password: Yup.string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
      .required('Senha é obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Senhas não conferem')
      .required('Confirmação de senha é obrigatória'),
    fullName: Yup.string()
      .max(100, 'Nome completo deve ter no máximo 100 caracteres')
  });
  
  // Valores iniciais
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  };
  
  // Função de submissão
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setRegisterError('');
    setRegisterSuccess('');
    
    try {
      const { confirmPassword, ...userData } = values;
      const result = await register(userData);
      
      if (result.success) {
        setRegisterSuccess('Registro realizado com sucesso! Redirecionando para o login...');
        resetForm();
        
        // Redirecionar para o login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setRegisterError(result.error || 'Erro ao registrar. Tente novamente.');
      }
    } catch (error) {
      setRegisterError('Erro ao registrar. Tente novamente.');
      console.error('Erro de registro:', error);
    }
    
    setSubmitting(false);
  };
  
  return (
    <div className="register-page">
      <div className="form-container">
        <h2 className="form-title">Criar Conta no QuantumOS</h2>
        
        {registerError && (
          <div className="error-message">
            {registerError}
          </div>
        )}
        
        {registerSuccess && (
          <div className="success-message">
            {registerSuccess}
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
                  placeholder="Escolha um nome de usuário"
                />
                <ErrorMessage name="username" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Seu email"
                />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Nome Completo (opcional)</label>
                <Field
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-input"
                  placeholder="Seu nome completo"
                />
                <ErrorMessage name="fullName" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Crie uma senha forte"
                />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirme sua senha"
                />
                <ErrorMessage name="confirmPassword" component="div" className="form-error" />
              </div>
              
              <button
                type="submit"
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </button>
              
              <div className="form-footer">
                Já tem uma conta? <Link to="/login" className="form-link">Faça login</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      
      <style jsx>{`
        .register-page {
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
        
        .success-message {
          background: rgba(0, 255, 0, 0.1);
          border: 1px solid rgba(0, 255, 0, 0.3);
          color: #00ff00;
          padding: 0.8rem;
          border-radius: 5px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Register;