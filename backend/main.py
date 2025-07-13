"""
QuantumOS - Backend principal (FastAPI)
"""
import sys, logging, jwt, os
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, status, Request, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, BaseSettings, constr, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship
from passlib.hash import bcrypt
from uuid import uuid4
import json
from pathlib import Path
from quantum_ai_agent import quantum_agent_manager, AgentType, QuantumAgent

# Configuração
class Settings(BaseSettings):
    SECRET_KEY: str = "sua-chave-secreta-muito-segura"
    DB_URI: str = "postgresql://quantumos:quantumos@db:5432/quantumos"
    JWT_EXPIRE_MINUTES: int = 60
    LOG_LEVEL: str = "INFO"
    ALLOW_ORIGINS: str = "http://localhost:3000,https://www.aigronovatech.com.br"
    DOMAIN: str = "aigronovatech.com.br"
    UPLOAD_DIR: str = "/app/uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()
logging.basicConfig(stream=sys.stdout, level=settings.LOG_LEVEL, 
                   format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("quantumos")

# Garantir que o diretório de uploads exista
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Banco de dados e modelos
Base = declarative_base()
engine = create_engine(settings.DB_URI, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    full_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    profile_picture = Column(String(255), nullable=True)
    
    # Relacionamentos
    projects = relationship("Project", back_populates="owner")
    
class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_public = Column(Boolean, default=False)
    
    # Relacionamentos
    owner = relationship("User", back_populates="projects")
    quantum_jobs = relationship("QuantumJob", back_populates="project")

class QuantumJob(Base):
    __tablename__ = "quantum_jobs"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    code = Column(Text, nullable=False)
    backend = Column(String(64), nullable=False)
    result = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relacionamentos
    project = relationship("Project", back_populates="quantum_jobs")

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Segurança e autenticação
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)

def create_access_token(data: Dict[str, Any]) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception as ex:
        logger.warning(f"Token decode failed: {ex}")
        return None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Usuário não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Usuário inativo",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user

def get_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissão de administrador necessária"
        )
    return current_user

# App
app = FastAPI(
    title="QuantumOS API",
    description="API para o sistema QuantumOS - Computação Quântica & IA",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid4())
    logger.info(f"REQUEST {request_id} - {request.method} {request.url}")
    
    try:
        response = await call_next(request)
        logger.info(f"RESPONSE {request_id} - status: {response.status_code}")
        return response
    except Exception as ex:
        logger.error(f"ERROR {request_id} - {ex}")
        return JSONResponse(
            content={"error": "Erro interno do servidor"},
            status_code=500
        )

# Modelos Pydantic
class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=30, regex="^[a-zA-Z0-9_.-]+$")
    email: EmailStr
    password: constr(min_length=8, max_length=64)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: int
    username: str
    is_admin: bool

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    is_admin: bool
    profile_picture: Optional[str] = None
    
    class Config:
        orm_mode = True

class ProjectCreate(BaseModel):
    title: constr(min_length=3, max_length=100)
    description: Optional[str] = None
    is_public: bool = False

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    owner_id: int
    owner_username: str
    is_public: bool
    
    class Config:
        orm_mode = True

class QuantumJobCreate(BaseModel):
    name: constr(min_length=3, max_length=100)
    description: Optional[str] = None
    code: str
    backend: str = "simulator"

class QuantumJobResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str] = None
    code: str
    backend: str
    result: Optional[str] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Rotas de autenticação
@app.post("/api/auth/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    # Verificar se o usuário já existe
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=409, detail="Nome de usuário já existe")
    
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail="Email já está em uso")
    
    # Criar novo usuário
    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"Novo usuário registrado: {data.username}")
    return user

@app.post("/api/auth/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    # Buscar usuário pelo nome de usuário
    user = db.query(User).filter(User.username == data.username).first()
    
    # Verificar se o usuário existe e a senha está correta
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome de usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar se o usuário está ativo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário inativo",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Criar token de acesso
    access_token = create_access_token({"sub": user.id})
    
    logger.info(f"Usuário logado: {data.username}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.JWT_EXPIRE_MINUTES * 60,
        "user_id": user.id,
        "username": user.username,
        "is_admin": user.is_admin
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/api/auth/me", response_model=UserResponse)
def update_user_info(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Atualizar informações do usuário
    if data.email is not None:
        # Verificar se o email já está em uso
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=409, detail="Email já está em uso")
        current_user.email = data.email
    
    if data.full_name is not None:
        current_user.full_name = data.full_name
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@app.post("/api/auth/me/profile-picture")
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar tipo de arquivo
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Apenas imagens são permitidas")
    
    # Gerar nome de arquivo único
    file_ext = file.filename.split(".")[-1]
    filename = f"profile_{current_user.id}_{uuid4()}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Salvar arquivo
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    # Atualizar caminho da imagem no banco de dados
    current_user.profile_picture = f"/uploads/{filename}"
    db.commit()
    
    return {"filename": filename, "profile_picture": current_user.profile_picture}

# Rotas de projetos
@app.post("/api/projects", response_model=ProjectResponse)
def create_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Criar novo projeto
    project = Project(
        title=data.title,
        description=data.description,
        owner_id=current_user.id,
        is_public=data.is_public
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Adicionar informações do proprietário para a resposta
    setattr(project, "owner_username", current_user.username)
    
    return project

@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar projetos do usuário atual
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    
    # Adicionar informações do proprietário para cada projeto
    for project in projects:
        setattr(project, "owner_username", current_user.username)
    
    return projects

@app.get("/api/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar projeto pelo ID
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    # Verificar se o usuário tem permissão para acessar o projeto
    if project.owner_id != current_user.id and not project.is_public and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Buscar informações do proprietário
    owner = db.query(User).filter(User.id == project.owner_id).first()
    setattr(project, "owner_username", owner.username if owner else "Desconhecido")
    
    return project

# Rotas de jobs quânticos
@app.post("/api/projects/{project_id}/quantum-jobs", response_model=QuantumJobResponse)
def create_quantum_job(
    project_id: int,
    data: QuantumJobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar se o projeto existe
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    # Verificar se o usuário tem permissão para adicionar jobs ao projeto
    if project.owner_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Criar novo job quântico
    job = QuantumJob(
        project_id=project_id,
        name=data.name,
        description=data.description,
        code=data.code,
        backend=data.backend
    )
    
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Iniciar processamento do job em background (simulado)
    # Em uma implementação real, isso seria feito com uma tarefa assíncrona
    try:
        # Simulação de processamento quântico
        import random
        from time import sleep
        
        # Atualizar status para "running"
        job.status = "running"
        db.commit()
        
        # Simulação de processamento (em produção, isso seria feito em um worker separado)
        sleep(2)
        
        # Gerar resultado simulado
        result = {
            "counts": {"00": random.randint(400, 600), "11": random.randint(400, 600)},
            "quantum_state": [0.7071, 0, 0, 0.7071],
            "execution_time": random.uniform(0.5, 2.0)
        }
        
        # Atualizar job com resultado
        job.result = json.dumps(result)
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(job)
        
    except Exception as e:
        logger.error(f"Erro ao processar job quântico: {e}")
        job.status = "failed"
        job.result = json.dumps({"error": str(e)})
        db.commit()
    
    return job

@app.get("/api/projects/{project_id}/quantum-jobs", response_model=List[QuantumJobResponse])
def get_quantum_jobs(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verificar se o projeto existe
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    # Verificar se o usuário tem permissão para acessar o projeto
    if project.owner_id != current_user.id and not project.is_public and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    # Buscar jobs do projeto
    jobs = db.query(QuantumJob).filter(QuantumJob.project_id == project_id).all()
    
    return jobs

@app.get("/api/quantum-jobs/{job_id}", response_model=QuantumJobResponse)
def get_quantum_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Buscar job pelo ID
    job = db.query(QuantumJob).filter(QuantumJob.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    
    # Buscar projeto associado ao job
    project = db.query(Project).filter(Project.id == job.project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    
    # Verificar se o usuário tem permissão para acessar o job
    if project.owner_id != current_user.id and not project.is_public and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    return job

# Rota para servir arquivos estáticos (uploads)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Modelos Pydantic para IA Agêntica
class AgentCreateRequest(BaseModel):
    agent_type: str
    capabilities: List[str]

class AgentEnvironmentData(BaseModel):
    quantum_state: Optional[Dict[str, Any]] = None
    classical_data: Optional[Dict[str, Any]] = None
    problem_size: Optional[int] = 10
    historical_data: Optional[List[float]] = None
    system_size: Optional[int] = 5
    time_steps: Optional[int] = 10
    exploration_steps: Optional[int] = 20

class SimulationRequest(BaseModel):
    environment_data: AgentEnvironmentData
    duration: int = 10

# Rotas da IA Agêntica Quântica
@app.post("/api/quantum-ai/agents")
def create_quantum_agent(
    request: AgentCreateRequest,
    current_user: User = Depends(get_current_user)
):
    """Criar novo agente quântico"""
    try:
        # Validar tipo de agente
        agent_type = AgentType(request.agent_type)
        
        # Criar agente
        agent_id = quantum_agent_manager.create_agent(agent_type, request.capabilities)
        
        return {
            "success": True,
            "agent_id": agent_id,
            "message": f"Agente quântico {agent_id} criado com sucesso"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Tipo de agente inválido: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar agente: {e}")

@app.get("/api/quantum-ai/agents")
def list_quantum_agents(current_user: User = Depends(get_current_user)):
    """Listar todos os agentes quânticos"""
    try:
        agents = quantum_agent_manager.list_agents()
        return {
            "success": True,
            "agents": agents,
            "total": len(agents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar agentes: {e}")

@app.get("/api/quantum-ai/agents/{agent_id}")
def get_quantum_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um agente específico"""
    try:
        agent = quantum_agent_manager.get_agent(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        return {
            "success": True,
            "agent": agent.get_status()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter agente: {e}")

@app.post("/api/quantum-ai/agents/{agent_id}/run")
def run_quantum_agent(
    agent_id: str,
    environment_data: AgentEnvironmentData,
    current_user: User = Depends(get_current_user)
):
    """Executar ciclo de um agente quântico"""
    try:
        result = quantum_agent_manager.run_agent_cycle(
            agent_id, 
            environment_data.dict(exclude_none=True)
        )
        
        return {
            "success": True,
            "result": result
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao executar agente: {e}")

@app.post("/api/quantum-ai/simulation")
async def run_multi_agent_simulation(
    request: SimulationRequest,
    current_user: User = Depends(get_current_user)
):
    """Executar simulação com múltiplos agentes"""
    try:
        result = await quantum_agent_manager.run_multi_agent_simulation(
            request.environment_data.dict(exclude_none=True),
            request.duration
        )
        
        return {
            "success": True,
            "simulation": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na simulação: {e}")

@app.delete("/api/quantum-ai/agents/{agent_id}")
def delete_quantum_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user)
):
    """Deletar agente quântico"""
    try:
        success = quantum_agent_manager.delete_agent(agent_id)
        if not success:
            raise HTTPException(status_code=404, detail="Agente não encontrado")
        
        return {
            "success": True,
            "message": f"Agente {agent_id} deletado com sucesso"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar agente: {e}")

@app.get("/api/quantum-ai/stats")
def get_quantum_ai_stats(current_user: User = Depends(get_current_user)):
    """Obter estatísticas globais da IA quântica"""
    try:
        stats = quantum_agent_manager.get_global_stats()
        return {
            "success": True,
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter estatísticas: {e}")

@app.get("/api/quantum-ai/agent-types")
def get_agent_types(current_user: User = Depends(get_current_user)):
    """Obter tipos de agentes disponíveis"""
    return {
        "success": True,
        "agent_types": [
            {
                "value": "optimizer",
                "label": "Otimizador Quântico",
                "description": "Especializado em problemas de otimização usando algoritmos quânticos"
            },
            {
                "value": "analyzer",
                "label": "Analisador de Dados",
                "description": "Análise avançada de dados com processamento quântico"
            },
            {
                "value": "predictor",
                "label": "Preditor Quântico",
                "description": "Predições usando redes neurais quânticas"
            },
            {
                "value": "simulator",
                "label": "Simulador Quântico",
                "description": "Simulação de sistemas quânticos complexos"
            },
            {
                "value": "hybrid",
                "label": "Agente Híbrido",
                "description": "Combina todas as capacidades em um agente versátil"
            }
        ]
    }

# Rota de saúde
@app.get("/health")
def health():
    return {
        "status": "online",
        "version": app.version,
        "timestamp": datetime.utcnow().isoformat()
    }

# Rota raiz
@app.get("/", include_in_schema=False)
def root():
    return {
        "service": "QuantumOS API",
        "docs": "/api/docs",
        "health": "/health"
    }

# Função para criar usuário admin inicial
def create_admin_user():
    db = SessionLocal()
    
    # Verificar se já existe um usuário admin
    admin = db.query(User).filter(User.username == "admin").first()
    
    if not admin:
        # Criar usuário admin
        admin = User(
            username="admin",
            email="admin@aigronovatech.com.br",
            password_hash=hash_password("admin123"),
            full_name="Administrador",
            is_admin=True
        )
        
        db.add(admin)
        db.commit()
        logger.info("Usuário admin criado (senha: admin123)")
    
    db.close()

# Criar usuário admin ao iniciar a aplicação
create_admin_user()

# Iniciar servidor se executado diretamente
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )