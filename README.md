# QuantumOS - Sistema Operacional Quântico Integrado com IA

QuantumOS é uma plataforma revolucionária que combina o poder da computação quântica com inteligência artificial avançada para resolver problemas complexos em tempo recorde.

## Visão Geral

O QuantumOS foi desenvolvido para o domínio www.aigronovatech.com.br e oferece uma interface intuitiva para acessar recursos de computação quântica e inteligência artificial.

## Estrutura do Projeto

O projeto QuantumOS é uma aplicação full-stack com a seguinte estrutura:

- **Backend**: API RESTful desenvolvida com FastAPI e PostgreSQL
- **Frontend**: Interface de usuário desenvolvida com React
- **Banco de Dados**: PostgreSQL para armazenamento persistente
- **Nginx**: Servidor web para proxy reverso e SSL

## Requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local do frontend)
- Python 3.11+ (para desenvolvimento local do backend)

## Configuração e Instalação

### Usando Docker (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/aigronovatech/quantumos.git
   cd quantumos
   ```

2. Execute o script de inicialização:
   ```bash
   ./start.sh
   ```

3. Acesse a aplicação:
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/api/docs

### Desenvolvimento Local

#### Backend

1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```

2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend

1. Navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## Funcionalidades

- **Autenticação de Usuários**: Sistema completo de registro, login e gerenciamento de perfil
- **Projetos Quânticos**: Crie e gerencie projetos de computação quântica
- **Jobs Quânticos**: Execute simulações quânticas em diferentes backends
- **Dashboard Interativo**: Visualize e gerencie seus projetos e jobs
- **API RESTful**: Acesse todas as funcionalidades programaticamente

## Tecnologias Utilizadas

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT para autenticação
- Pydantic para validação de dados

### Frontend
- React
- React Router
- Axios
- Formik e Yup para formulários e validação
- CSS personalizado

### Infraestrutura
- Docker e Docker Compose
- Nginx
- SSL/TLS

## Configuração para Produção

Para configurar o QuantumOS em um ambiente de produção:

1. Atualize o arquivo `.env` com configurações seguras
2. Substitua os certificados SSL auto-assinados por certificados válidos
3. Configure o domínio `aigronovatech.com.br` para apontar para o seu servidor
4. Ajuste as configurações do Nginx conforme necessário

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar pull requests ou abrir issues para melhorar o projeto.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.