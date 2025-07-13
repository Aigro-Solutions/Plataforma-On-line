import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-subtitle">O FUTURO DA COMPUTAÇÃO</div>
            <h1 className="hero-title">Sistema Operacional Quântico Integrado com IA</h1>
            <p className="hero-description">
              Uma revolução na computação que combina o poder da física quântica com inteligência artificial avançada para resolver problemas complexos em tempo recorde.
            </p>
            <div className="hero-buttons">
              {isAuthenticated() ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Acessar Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Começar Agora
                </Link>
              )}
              <a href="#features" className="btn btn-outline">
                Saiba Mais
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="quantum-circle">
              <div className="quantum-particle particle-1"></div>
              <div className="quantum-particle particle-2"></div>
              <div className="quantum-particle particle-3"></div>
              <div className="quantum-particle particle-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tecnologia Revolucionária</h2>
            <p className="section-subtitle">Descubra os recursos avançados do QuantumOS</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h3 className="feature-title">Processamento Quântico</h3>
              <p className="feature-description">
                Utilize o poder da superposição e do entrelaçamento quântico para resolver problemas complexos em paralelo.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3 className="feature-title">IA Avançada</h3>
              <p className="feature-description">
                Algoritmos de inteligência artificial que aprendem e evoluem continuamente para otimizar seus processos.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="feature-title">Criptografia Quântica</h3>
              <p className="feature-description">
                Segurança de dados inviolável baseada nos princípios fundamentais da física quântica.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-project-diagram"></i>
              </div>
              <h3 className="feature-title">Simulação Molecular</h3>
              <p className="feature-description">
                Simule sistemas moleculares complexos para descobertas científicas e desenvolvimento de novos materiais.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="feature-title">Otimização Financeira</h3>
              <p className="feature-description">
                Algoritmos quânticos para otimização de portfólios e análise de riscos em tempo real.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <h3 className="feature-title">Computação em Nuvem</h3>
              <p className="feature-description">
                Acesse o poder da computação quântica de qualquer lugar, sem necessidade de hardware especializado.
              </p>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .features {
            padding: 6rem 0;
            background: #fff;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          
          .section-header {
            text-align: center;
            margin-bottom: 4rem;
          }
          
          .section-title {
            font-size: 2.5rem;
            color: var(--primary-dark);
            margin-bottom: 1rem;
          }
          
          .section-subtitle {
            font-size: 1.2rem;
            color: var(--primary-blue);
            max-width: 700px;
            margin: 0 auto;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
          }
          
          .feature-card {
            background: #fff;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
            border: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
            border-color: var(--fluorescent);
          }
          
          .feature-icon {
            font-size: 2.5rem;
            color: var(--fluorescent);
            margin-bottom: 1.5rem;
            background: rgba(0, 255, 255, 0.1);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .feature-title {
            font-size: 1.5rem;
            color: var(--primary-dark);
            margin-bottom: 1rem;
          }
          
          .feature-description {
            color: var(--dark-gray);
            line-height: 1.6;
          }
          
          @media (max-width: 768px) {
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="documentation">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Documentação Completa</h2>
            <p className="section-subtitle">Tudo o que você precisa para começar a usar o QuantumOS</p>
          </div>
          
          <div className="documentation-grid">
            <div className="documentation-card">
              <div className="documentation-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3 className="documentation-title">Guia de Início Rápido</h3>
              <p className="documentation-description">
                Aprenda os conceitos básicos e comece a usar o QuantumOS em minutos.
              </p>
              <a href="#" className="documentation-link">Ler Guia <i className="fas fa-arrow-right"></i></a>
            </div>
            
            <div className="documentation-card">
              <div className="documentation-icon">
                <i className="fas fa-code"></i>
              </div>
              <h3 className="documentation-title">API Reference</h3>
              <p className="documentation-description">
                Documentação detalhada de todas as APIs e endpoints disponíveis.
              </p>
              <a href="#" className="documentation-link">Ver Documentação <i className="fas fa-arrow-right"></i></a>
            </div>
            
            <div className="documentation-card">
              <div className="documentation-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="documentation-title">Tutoriais</h3>
              <p className="documentation-description">
                Tutoriais passo a passo para implementar soluções com QuantumOS.
              </p>
              <a href="#" className="documentation-link">Ver Tutoriais <i className="fas fa-arrow-right"></i></a>
            </div>
            
            <div className="documentation-card">
              <div className="documentation-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3 className="documentation-title">FAQ</h3>
              <p className="documentation-description">
                Respostas para as perguntas mais frequentes sobre o QuantumOS.
              </p>
              <a href="#" className="documentation-link">Ver FAQ <i className="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .documentation {
            padding: 6rem 0;
            background: linear-gradient(rgba(10, 26, 47, 0.95), rgba(13, 59, 102, 0.9));
            color: #fff;
          }
          
          .section-title {
            color: #fff;
          }
          
          .section-subtitle {
            color: rgba(255, 255, 255, 0.8);
          }
          
          .documentation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
          }
          
          .documentation-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 2rem;
            transition: all 0.3s;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .documentation-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.15);
            border-color: var(--fluorescent);
          }
          
          .documentation-icon {
            font-size: 2rem;
            color: var(--fluorescent);
            margin-bottom: 1.5rem;
          }
          
          .documentation-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .documentation-description {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 1.5rem;
          }
          
          .documentation-link {
            color: var(--fluorescent);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s;
          }
          
          .documentation-link:hover {
            text-decoration: underline;
          }
          
          @media (max-width: 768px) {
            .documentation-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>

      {/* CTA Section */}
      <section id="contact" className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Pronto para o Futuro da Computação?</h2>
            <p className="cta-description">
              Junte-se a milhares de cientistas, pesquisadores e empresas que já estão utilizando o QuantumOS para resolver problemas complexos e criar o futuro.
            </p>
            <div className="cta-buttons">
              {isAuthenticated() ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Acessar Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Criar Conta Gratuita
                </Link>
              )}
              <a href="mailto:contato@aigronovatech.com.br" className="btn btn-outline">
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .cta {
            padding: 6rem 0;
            background: #fff;
            text-align: center;
          }
          
          .cta-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .cta-title {
            font-size: 2.5rem;
            color: var(--primary-dark);
            margin-bottom: 1.5rem;
          }
          
          .cta-description {
            font-size: 1.2rem;
            color: var(--dark-gray);
            margin-bottom: 2rem;
          }
          
          .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
          
          @media (max-width: 576px) {
            .cta-buttons {
              flex-direction: column;
              align-items: center;
            }
          }
        `}</style>
      </section>
    </>
  );
};

export default Home;