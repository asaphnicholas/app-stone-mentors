# 📊 API - Painel de Administração de Mentorias

## 📋 Visão Geral

Este documento especifica todas as APIs necessárias para construir uma página completa de administração de mentorias no frontend, permitindo que o admin:

- ✅ Visualize todas as mentorias do sistema
- ✅ Acompanhe o status de cada mentoria
- ✅ Veja quantas mentorias foram realizadas por negócio
- ✅ Acesse dados de NPS e avaliações de checkout
- ✅ Exporte relatórios em CSV
- ✅ Visualize estatísticas consolidadas

---

## 🎯 Estrutura da Página Sugerida

### **Layout Sugerido:**

```
┌─────────────────────────────────────────────────────────┐
│  📊 Painel de Mentorias                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📈 Cards de Estatísticas Gerais                        │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │Total Men │Finaliza- │ NPS Médio│  Negócios│         │
│  │ torias   │  das     │   Geral  │ Atendidos│         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                         │
│  🔍 Filtros e Busca                                     │
│  [Status] [Negócio] [Mentor] [Período] [Buscar]        │
│                                                         │
│  📋 Tabela de Mentorias                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Negócio │ Mentor │ Data │ Status │ NPS │ Ações │   │
│  │ ABC Ltd │ Maria  │20/10 │Finaliz.│ 9.2 │ [Ver] │   │
│  │ XYZ Inc │ João   │19/10 │Pendente│  -  │ [Ver] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📥 Exportar Relatórios                                 │
│  [Exportar CSV] [Exportar Performance]                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 APIs Disponíveis

### **1. Dashboard - Visão Geral de Mentorias**

#### **Endpoint: Estatísticas Consolidadas**

```http
GET /api/v1/admin/mentorias/stats
Authorization: Bearer {admin_token}
```

**Descrição:**  
Retorna estatísticas gerais de todas as mentorias do sistema.

**Response:**
```json
{
  "total_mentorias": 245,
  "mentorias_finalizadas": 198,
  "mentorias_agendadas": 32,
  "mentorias_em_andamento": 15,
  "nps_medio_geral": 8.7,
  "total_negocios_atendidos": 87,
  "total_mentores_ativos": 24,
  "media_mentorias_por_negocio": 2.8,
  "taxa_conclusao": 80.8,
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-12-31"
  }
}
```

**⚠️ Nota:** Esta API precisa ser criada. Sugerimos criar em:
- Service: `api/v1/services/mentoria_stats_service.py`
- Controller: Adicionar em `api/v1/controllers/admin_controller.py`

---

### **2. Listar Todas as Mentorias (com Filtros)**

#### **Endpoint: Lista Paginada de Mentorias**

```http
GET /api/v1/admin/mentorias?status={status}&negocio_id={id}&mentor_id={id}&skip={0}&limit={50}
Authorization: Bearer {admin_token}
```

**Descrição:**  
Lista todas as mentorias do sistema com filtros e paginação.

**Query Parameters:**
- `status` (opcional): `DISPONIVEL`, `CONFIRMADA`, `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA`
- `negocio_id` (opcional): Filtrar por negócio específico
- `mentor_id` (opcional): Filtrar por mentor específico
- `tipo` (opcional): `PRIMEIRA`, `FOLLOWUP`
- `data_inicio` (opcional): Data de início (YYYY-MM-DD)
- `data_fim` (opcional): Data de fim (YYYY-MM-DD)
- `skip` (opcional): Paginação - registros para pular (padrão: 0)
- `limit` (opcional): Paginação - máximo por página (padrão: 50, máx: 200)

**Response:**
```json
{
  "mentorias": [
    {
      "id": "uuid-mentoria-1",
      "negocio": {
        "id": "uuid-negocio-1",
        "nome": "Tech Solutions LTDA",
        "nome_empreendedor": "João Silva",
        "area_atuacao": "Tecnologia e Engenharia"
      },
      "mentor": {
        "id": "uuid-mentor-1",
        "nome": "Maria Santos",
        "email": "maria@email.com"
      },
      "tipo": "PRIMEIRA",
      "status": "FINALIZADA",
      "data_agendada": "2024-10-20T14:00:00Z",
      "data_confirmada": "2024-10-18T10:30:00Z",
      "data_checkin": "2024-10-20T14:05:00Z",
      "data_finalizada": "2024-10-20T15:30:00Z",
      "duracao_minutos": 60,
      "tem_diagnostico": true,
      "tem_checkout": true,
      "nps": {
        "nota_mentoria": 9,
        "nota_mentor": 10,
        "nota_programa": 8,
        "nps_medio": 9.0
      },
      "created_at": "2024-10-15T09:00:00Z"
    },
    {
      "id": "uuid-mentoria-2",
      "negocio": {
        "id": "uuid-negocio-2",
        "nome": "Loja ABC",
        "nome_empreendedor": "Ana Paula",
        "area_atuacao": "Comercial em Polos"
      },
      "mentor": {
        "id": "uuid-mentor-2",
        "nome": "Carlos Oliveira",
        "email": "carlos@email.com"
      },
      "tipo": "FOLLOWUP",
      "status": "CONFIRMADA",
      "data_agendada": "2024-10-25T10:00:00Z",
      "data_confirmada": "2024-10-22T15:20:00Z",
      "data_checkin": null,
      "data_finalizada": null,
      "duracao_minutos": 45,
      "tem_diagnostico": false,
      "tem_checkout": false,
      "nps": null,
      "created_at": "2024-10-20T11:00:00Z"
    }
  ],
  "total": 245,
  "skip": 0,
  "limit": 50,
  "has_more": true,
  "filtros_aplicados": {
    "status": null,
    "negocio_id": null,
    "mentor_id": null,
    "tipo": null,
    "periodo": "todos"
  }
}
```

**⚠️ Nota:** Esta API precisa ser criada. Sugerimos criar em:
- Service: `api/v1/services/mentoria_admin_service.py`
- Controller: Adicionar rota em `api/v1/controllers/admin_controller.py`

---

### **3. Detalhes Completos de uma Mentoria**

#### **Endpoint: Ver Detalhes de Mentoria Específica**

```http
GET /api/v1/admin/mentorias/{mentoria_id}
Authorization: Bearer {admin_token}
```

**Descrição:**  
Retorna todos os detalhes de uma mentoria específica, incluindo diagnóstico e checkout.

**Response:**
```json
{
  "id": "uuid-mentoria-1",
  "negocio": {
    "id": "uuid-negocio-1",
    "nome": "Tech Solutions LTDA",
    "nome_empreendedor": "João Silva",
    "telefone": "+5548988312500",
    "email": "joao@techsolutions.com",
    "area_atuacao": "Tecnologia e Engenharia",
    "data_vinculacao_mentor": "2024-09-01T00:00:00Z"
  },
  "mentor": {
    "id": "uuid-mentor-1",
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "+5548999887766",
    "area_formacao": "Administração"
  },
  "tipo": "PRIMEIRA",
  "status": "FINALIZADA",
  "duracao_minutos": 60,
  "timestamps": {
    "created_at": "2024-10-15T09:00:00Z",
    "data_agendada": "2024-10-20T14:00:00Z",
    "confirmada_at": "2024-10-18T10:30:00Z",
    "checkin_at": "2024-10-20T14:05:00Z",
    "inicio_at": "2024-10-20T14:10:00Z",
    "finalizada_at": "2024-10-20T15:30:00Z"
  },
  "diagnostico": {
    "id": "uuid-diagnostico-1",
    "tempo_mercado": "1-2 anos",
    "faturamento_mensal": "R$ 10.000 - R$ 50.000",
    "num_funcionarios": "2-5 funcionários",
    "desafios": ["Marketing Digital", "Gestão Financeira", "Vendas"],
    "observacoes": "Empreendedor muito engajado, com visão clara do negócio",
    "criado_em": "2024-10-20T14:10:00Z",
    "atualizado_em": "2024-10-20T15:00:00Z"
  },
  "checkout": {
    "id": "uuid-checkout-1",
    "nota_mentoria": 9,
    "nota_mentor": 10,
    "nota_programa": 8,
    "nps_medio": 9.0,
    "nps_legado": 9,
    "feedback": "Mentoria muito produtiva, mentor excelente!",
    "proximos_passos": "nova_mentoria",
    "criado_em": "2024-10-20T15:30:00Z"
  }
}
```

**⚠️ Nota:** Esta API precisa ser criada ou adaptar a existente do mentor.

---

### **4. Histórico de Mentorias de um Negócio**

#### **Endpoint Existente:**

```http
GET /api/v1/admin/businesses/{business_id}/details
Authorization: Bearer {admin_token}
```

**Descrição:**  
Retorna informações completas do negócio incluindo todas as mentorias realizadas.

**Response (parcial - foco em mentorias):**
```json
{
  "negocio": {
    "id": "uuid-negocio-1",
    "nome": "Tech Solutions LTDA",
    "nome_empreendedor": "João Silva"
  },
  "estatisticas_mentorias": {
    "total_mentorias": 5,
    "mentorias_finalizadas": 4,
    "mentorias_pendentes": 1,
    "nps_medio": 8.8,
    "primeira_mentoria": "2024-08-15T14:00:00Z",
    "ultima_mentoria": "2024-10-20T15:30:00Z"
  },
  "mentorias": [
    {
      "id": "uuid-mentoria-5",
      "tipo": "PRIMEIRA",
      "status": "FINALIZADA",
      "data_agendada": "2024-08-15T14:00:00Z",
      "mentor_nome": "Maria Santos",
      "nps": 9,
      "tem_diagnostico": true,
      "tem_checkout": true
    },
    {
      "id": "uuid-mentoria-4",
      "tipo": "FOLLOWUP",
      "status": "FINALIZADA",
      "data_agendada": "2024-09-10T10:00:00Z",
      "mentor_nome": "Maria Santos",
      "nps": 8,
      "tem_diagnostico": false,
      "tem_checkout": true
    }
  ]
}
```

**✅ API já existe:** `/api/v1/admin/businesses/{business_id}/details`

---

### **5. Estatísticas de NPS e Avaliações**

#### **Endpoint: NPS Consolidado**

```http
GET /api/v1/admin/mentorias/nps/stats
Authorization: Bearer {admin_token}
```

**Descrição:**  
Retorna estatísticas consolidadas de NPS e avaliações.

**Query Parameters:**
- `periodo_inicio` (opcional): Data de início (YYYY-MM-DD)
- `periodo_fim` (opcional): Data de fim (YYYY-MM-DD)
- `mentor_id` (opcional): Filtrar por mentor específico

**Response:**
```json
{
  "periodo": {
    "inicio": "2024-01-01",
    "fim": "2024-12-31"
  },
  "nps_geral": {
    "nota_mentoria_media": 8.7,
    "nota_mentor_media": 9.1,
    "nota_programa_media": 8.3,
    "nps_medio_total": 8.7,
    "total_avaliacoes": 198
  },
  "distribuicao_notas": {
    "nota_mentoria": {
      "detratores": 12,
      "neutros": 35,
      "promotores": 151,
      "percentual_promotores": 76.3,
      "percentual_detratores": 6.1
    },
    "nota_mentor": {
      "detratores": 8,
      "neutros": 28,
      "promotores": 162,
      "percentual_promotores": 81.8,
      "percentual_detratores": 4.0
    },
    "nota_programa": {
      "detratores": 15,
      "neutros": 42,
      "promotores": 141,
      "percentual_promotores": 71.2,
      "percentual_detratores": 7.6
    }
  },
  "nps_score": {
    "mentoria": 70.2,
    "mentor": 77.8,
    "programa": 63.6
  },
  "evolucao_mensal": [
    {
      "mes": "2024-01",
      "nps_medio": 8.2,
      "total_avaliacoes": 15
    },
    {
      "mes": "2024-02",
      "nps_medio": 8.5,
      "total_avaliacoes": 18
    },
    {
      "mes": "2024-03",
      "nps_medio": 8.9,
      "total_avaliacoes": 22
    }
  ],
  "top_mentores_nps": [
    {
      "mentor_id": "uuid-mentor-1",
      "mentor_nome": "Maria Santos",
      "nps_medio": 9.5,
      "total_avaliacoes": 28
    },
    {
      "mentor_id": "uuid-mentor-2",
      "mentor_nome": "Carlos Oliveira",
      "nps_medio": 9.2,
      "total_avaliacoes": 22
    }
  ]
}
```

**⚠️ Nota:** Esta API precisa ser criada. Sugerimos criar em:
- Service: `api/v1/services/nps_stats_service.py`
- Controller: Adicionar em `api/v1/controllers/admin_controller.py`

---

### **6. Performance de Mentores**

#### **Endpoint Existente:**

```http
GET /api/v1/admin/mentors/{mentor_id}/performance
Authorization: Bearer {admin_token}
```

**Descrição:**  
Retorna estatísticas detalhadas de performance de um mentor específico.

**Response:**
```json
{
  "mentor": {
    "id": "uuid-mentor-1",
    "nome": "Maria Santos",
    "email": "maria@email.com"
  },
  "estatisticas": {
    "total_mentorias": 28,
    "mentorias_finalizadas": 25,
    "mentorias_em_andamento": 2,
    "mentorias_agendadas": 1,
    "taxa_conclusao": 89.3,
    "negocios_atendidos": 12
  },
  "nps": {
    "nota_mentoria_media": 9.3,
    "nota_mentor_media": 9.5,
    "nota_programa_media": 8.9,
    "nps_medio": 9.2,
    "total_avaliacoes": 25
  },
  "tempo_medio": {
    "duracao_media_mentoria": 58,
    "tempo_resposta_medio": "2.5 dias"
  },
  "periodo_analise": {
    "primeira_mentoria": "2024-03-15T14:00:00Z",
    "ultima_mentoria": "2024-10-20T15:30:00Z",
    "dias_ativos": 219
  }
}
```

**✅ API já existe:** `/api/v1/admin/mentors/{mentor_id}/performance`

---

### **7. Exportar Relatórios CSV**

#### **Endpoint Existente - Relatório de Mentorias:**

```http
GET /api/v1/admin/relatorios/mentorias/exportar
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `periodo_inicio` (opcional): Data de início (YYYY-MM-DD)
- `periodo_fim` (opcional): Data de fim (YYYY-MM-DD)
- `status` (opcional): Filtrar por status
- `tipo` (opcional): Filtrar por tipo (PRIMEIRA, FOLLOWUP)

**Response:**  
Arquivo CSV com as seguintes colunas:
```
ID Mentoria,Negócio,Empreendedor,Mentor,Tipo,Status,Data Agendada,Data Finalizada,Duração (min),Nota Mentoria,Nota Mentor,Nota Programa,NPS Médio,Feedback
```

**✅ API já existe:** `/api/v1/admin/relatorios/mentorias/exportar`

---

#### **Endpoint Existente - Relatório de Performance:**

```http
GET /api/v1/admin/relatorios/performance/exportar
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `periodo_inicio` (opcional): Data de início (YYYY-MM-DD)
- `periodo_fim` (opcional): Data de fim (YYYY-MM-DD)

**Response:**  
Arquivo CSV com performance consolidada de mentores:
```
ID Mentor,Nome,Email,Total Mentorias,Mentorias Finalizadas,Taxa Conclusão %,NPS Médio,Negócios Atendidos,Primeira Mentoria,Última Mentoria
```

**✅ API já existe:** `/api/v1/admin/relatorios/performance/exportar`

---

## 🛠️ APIs que Precisam Ser Criadas

### **API 1: Estatísticas Gerais de Mentorias**

**Arquivo:** `api/v1/services/mentoria_stats_service.py`

```python
class MentoriaStatsService:
    @staticmethod
    def get_mentoria_stats(
        db: Session,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None
    ) -> dict:
        """
        Retorna estatísticas consolidadas de mentorias
        """
        # Implementação aqui
```

**Rota:** `GET /api/v1/admin/mentorias/stats`

---

### **API 2: Listar Todas as Mentorias (Admin)**

**Arquivo:** `api/v1/services/mentoria_admin_service.py`

```python
class MentoriaAdminService:
    @staticmethod
    def list_all_mentorias(
        db: Session,
        status: Optional[str] = None,
        negocio_id: Optional[str] = None,
        mentor_id: Optional[str] = None,
        tipo: Optional[str] = None,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[dict], int]:
        """
        Lista todas as mentorias com filtros e paginação
        """
        # Implementação aqui
```

**Rota:** `GET /api/v1/admin/mentorias`

---

### **API 3: Detalhes de Mentoria (Admin)**

**Arquivo:** `api/v1/services/mentoria_admin_service.py`

```python
class MentoriaAdminService:
    @staticmethod
    def get_mentoria_details_admin(
        db: Session,
        mentoria_id: str
    ) -> dict:
        """
        Retorna detalhes completos de uma mentoria para admin
        """
        # Implementação aqui
```

**Rota:** `GET /api/v1/admin/mentorias/{mentoria_id}`

---

### **API 4: Estatísticas de NPS**

**Arquivo:** `api/v1/services/nps_stats_service.py`

```python
class NPSStatsService:
    @staticmethod
    def get_nps_stats(
        db: Session,
        periodo_inicio: Optional[str] = None,
        periodo_fim: Optional[str] = None,
        mentor_id: Optional[str] = None
    ) -> dict:
        """
        Retorna estatísticas consolidadas de NPS
        """
        # Implementação aqui
```

**Rota:** `GET /api/v1/admin/mentorias/nps/stats`

---

## 📊 Estrutura de Dados - Modelo Checkout

### **Campos Disponíveis no Checkout:**

```python
class Checkout(Base):
    id = Column(UNIQUEIDENTIFIER, primary_key=True)
    mentoria_id = Column(UNIQUEIDENTIFIER, ForeignKey("mentorias.id"))
    
    # Avaliações (1-10)
    nota_mentoria = Column(Integer, nullable=False)  # OBRIGATÓRIA
    nota_mentor = Column(Integer, nullable=True)     # OPCIONAL
    nota_programa = Column(Integer, nullable=True)   # OPCIONAL
    
    # Legado
    nps = Column(Integer, nullable=True)             # Campo legado
    
    # Feedback
    feedback = Column(Text)
    proximos_passos = Column(Enum(ProximosPassos))  # 'nova_mentoria' ou 'finalizar'
    
    created_at = Column(DateTime, default=func.now())
```

### **Cálculo do NPS:**

**Fórmula:**
```
NPS Médio = (nota_mentoria + nota_mentor + nota_programa) / 3
```

**Classificação:**
- **Promotores:** Nota 9-10
- **Neutros:** Nota 7-8
- **Detratores:** Nota 0-6

**NPS Score:**
```
NPS = % Promotores - % Detratores
```

---

## 🎨 Componentes Frontend Sugeridos

### **1. Cards de Estatísticas**
```jsx
<StatsCards>
  <StatCard 
    title="Total de Mentorias"
    value={245}
    icon={<MentoriaIcon />}
    trend="+12% este mês"
  />
  <StatCard 
    title="Mentorias Finalizadas"
    value={198}
    icon={<CheckIcon />}
    trend="80.8% taxa de conclusão"
  />
  <StatCard 
    title="NPS Médio Geral"
    value={8.7}
    icon={<StarIcon />}
    color="success"
  />
  <StatCard 
    title="Negócios Atendidos"
    value={87}
    icon={<BusinessIcon />}
  />
</StatsCards>
```

### **2. Filtros**
```jsx
<Filters>
  <SelectFilter 
    label="Status" 
    options={['Todas', 'Finalizada', 'Confirmada', 'Em Andamento']}
  />
  <SelectFilter 
    label="Tipo" 
    options={['Todas', 'Primeira', 'Follow-up']}
  />
  <DateRangeFilter 
    label="Período" 
  />
  <SearchInput 
    placeholder="Buscar por negócio ou mentor..."
  />
</Filters>
```

### **3. Tabela de Mentorias**
```jsx
<DataTable
  columns={[
    { field: 'negocio', header: 'Negócio' },
    { field: 'mentor', header: 'Mentor' },
    { field: 'data', header: 'Data' },
    { field: 'tipo', header: 'Tipo' },
    { field: 'status', header: 'Status', renderCell: (row) => <StatusBadge /> },
    { field: 'nps', header: 'NPS', renderCell: (row) => <NPSScore /> },
    { field: 'actions', header: 'Ações', renderCell: (row) => <ActionsMenu /> }
  ]}
  data={mentorias}
  pagination
  onPageChange={handlePageChange}
/>
```

### **4. Modal de Detalhes**
```jsx
<MentoriaDetailModal
  mentoriaId={selectedId}
  onClose={handleClose}
>
  <Section title="Informações Gerais">
    <Info label="Negócio" value={mentoria.negocio.nome} />
    <Info label="Mentor" value={mentoria.mentor.nome} />
    <Info label="Status" value={mentoria.status} />
  </Section>
  
  <Section title="Avaliações (NPS)">
    <NPSCard 
      notaMentoria={9}
      notaMentor={10}
      notaPrograma={8}
      media={9.0}
    />
  </Section>
  
  <Section title="Diagnóstico">
    <DiagnosticoCard data={mentoria.diagnostico} />
  </Section>
  
  <Section title="Checkout">
    <CheckoutCard data={mentoria.checkout} />
  </Section>
</MentoriaDetailModal>
```

---

## 📥 Exemplos de Integração Frontend

### **Exemplo 1: Carregar Estatísticas do Dashboard**

```javascript
// service/mentoriaService.js
export async function getMentoriaStats() {
  const response = await api.get('/admin/mentorias/stats', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
}

// components/Dashboard.jsx
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    getMentoriaStats().then(setStats);
  }, []);
  
  return (
    <div>
      <StatCard title="Total Mentorias" value={stats?.total_mentorias} />
      <StatCard title="NPS Médio" value={stats?.nps_medio_geral} />
    </div>
  );
};
```

### **Exemplo 2: Listar Mentorias com Filtros**

```javascript
// service/mentoriaService.js
export async function listMentorias(filters) {
  const params = new URLSearchParams({
    status: filters.status || '',
    skip: filters.page * filters.limit,
    limit: filters.limit || 50
  });
  
  const response = await api.get(`/admin/mentorias?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
}

// components/MentoriasList.jsx
const MentoriasList = () => {
  const [mentorias, setMentorias] = useState([]);
  const [filters, setFilters] = useState({ page: 0, limit: 50 });
  
  useEffect(() => {
    listMentorias(filters).then(data => {
      setMentorias(data.mentorias);
    });
  }, [filters]);
  
  return (
    <Table 
      data={mentorias}
      onFilterChange={setFilters}
    />
  );
};
```

### **Exemplo 3: Exportar CSV**

```javascript
// service/exportService.js
export async function exportMentoriasCSV(filters) {
  const params = new URLSearchParams({
    periodo_inicio: filters.dataInicio || '',
    periodo_fim: filters.dataFim || '',
    status: filters.status || ''
  });
  
  const response = await api.get(`/admin/relatorios/mentorias/exportar?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    responseType: 'blob'
  });
  
  // Download do arquivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `mentorias_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// components/ExportButton.jsx
const ExportButton = () => {
  const handleExport = () => {
    exportMentoriasCSV({ 
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31'
    });
  };
  
  return <Button onClick={handleExport}>Exportar CSV</Button>;
};
```

---

## 🔒 Autenticação

Todas as APIs requerem autenticação de **Admin**.

**Header obrigatório:**
```
Authorization: Bearer {admin_jwt_token}
```

**Obter token:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "senha123"
}
```

---

## 📈 Indicadores de Performance (KPIs)

### **KPIs Principais para Exibir:**

1. **Total de Mentorias** - Quantidade total de mentorias realizadas
2. **Taxa de Conclusão** - % de mentorias finalizadas vs agendadas
3. **NPS Médio Geral** - Média de todas as avaliações
4. **Negócios Atendidos** - Quantidade de negócios que receberam mentoria
5. **Média de Mentorias por Negócio** - Quantas mentorias cada negócio teve
6. **Top Mentores** - Mentores com melhor NPS
7. **Evolução Mensal** - Gráfico de mentorias ao longo do tempo

---

## 🎯 Resumo de Implementação

### **✅ APIs que Já Existem:**
1. `/api/v1/admin/businesses/{business_id}/details` - Detalhes do negócio com mentorias
2. `/api/v1/admin/mentors/{mentor_id}/performance` - Performance do mentor
3. `/api/v1/admin/relatorios/mentorias/exportar` - Exportar mentorias CSV
4. `/api/v1/admin/relatorios/performance/exportar` - Exportar performance CSV

### **⏳ APIs que Precisam Ser Criadas:**
1. `GET /api/v1/admin/mentorias/stats` - Estatísticas gerais
2. `GET /api/v1/admin/mentorias` - Listar todas as mentorias (com filtros)
3. `GET /api/v1/admin/mentorias/{id}` - Detalhes de mentoria específica
4. `GET /api/v1/admin/mentorias/nps/stats` - Estatísticas de NPS consolidadas

---

## 📞 Suporte Técnico

- **Documentação de Mentorias:** `docs/MENTORIA_SYSTEM_DOCUMENTATION.md`
- **Documentação de Checkout:** `docs/API_CHECKOUT_ATUALIZADA.md`
- **Banco de Dados:** `docs/contextDatabase.md`

---

**Documento criado em:** 21/10/2024  
**Versão:** 1.0  
**Última atualização:** 21/10/2024

