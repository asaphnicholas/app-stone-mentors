# Página de Mentorias - Admin

Esta página permite ao administrador visualizar e gerenciar todas as mentorias do sistema.

## Funcionalidades

- ✅ Visualização de estatísticas gerais de mentorias
- ✅ Listagem paginada de todas as mentorias
- ✅ Filtros por status, tipo, período e busca
- ✅ Visualização de detalhes completos de cada mentoria
- ✅ Exportação de relatórios em CSV
- ✅ Visualização de NPS e avaliações

## APIs Necessárias

### APIs que Precisam ser Criadas no Backend

Atualmente, a página está usando dados mockados. As seguintes APIs precisam ser implementadas no backend:

#### 1. Estatísticas Gerais de Mentorias

```
GET /api/admin/mentorias/stats
```

**Query Parameters:**
- `data_inicio` (opcional): Data de início (YYYY-MM-DD)
- `data_fim` (opcional): Data de fim (YYYY-MM-DD)

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

#### 2. Listar Todas as Mentorias

```
GET /api/admin/mentorias
```

**Query Parameters:**
- `status` (opcional): DISPONIVEL, CONFIRMADA, EM_ANDAMENTO, FINALIZADA, CANCELADA
- `negocio_id` (opcional): Filtrar por negócio específico
- `mentor_id` (opcional): Filtrar por mentor específico
- `tipo` (opcional): PRIMEIRA, FOLLOWUP
- `data_inicio` (opcional): Data de início (YYYY-MM-DD)
- `data_fim` (opcional): Data de fim (YYYY-MM-DD)
- `skip` (opcional): Paginação - registros para pular (padrão: 0)
- `limit` (opcional): Paginação - máximo por página (padrão: 50, máx: 200)
- `search` (opcional): Buscar por nome do negócio, empreendedor ou mentor

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

#### 3. Detalhes de uma Mentoria Específica

```
GET /api/admin/mentorias/{mentoria_id}
```

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

### APIs Existentes que Podem ser Utilizadas

#### Exportar Relatórios CSV

```
GET /api/admin/relatorios/mentorias/exportar
```

**Query Parameters:**
- `periodo_inicio` (opcional): Data de início (YYYY-MM-DD)
- `periodo_fim` (opcional): Data de fim (YYYY-MM-DD)
- `status` (opcional): Filtrar por status
- `tipo` (opcional): Filtrar por tipo (PRIMEIRA, FOLLOWUP)

**Response:** Arquivo CSV

## Como Implementar as APIs no Backend

### 1. Criar Service para Estatísticas

Arquivo: `api/v1/services/mentoria_stats_service.py`

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
        pass
```

### 2. Criar Service para Listagem de Mentorias

Arquivo: `api/v1/services/mentoria_admin_service.py`

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
        limit: int = 50,
        search: Optional[str] = None
    ) -> Tuple[List[dict], int]:
        """
        Lista todas as mentorias com filtros e paginação
        """
        # Implementação aqui
        pass

    @staticmethod
    def get_mentoria_details_admin(
        db: Session,
        mentoria_id: str
    ) -> dict:
        """
        Retorna detalhes completos de uma mentoria para admin
        """
        # Implementação aqui
        pass
```

### 3. Adicionar Rotas no Controller

Arquivo: `api/v1/controllers/admin_controller.py`

```python
@router.get("/mentorias/stats")
async def get_mentoria_stats(
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Retorna estatísticas de mentorias"""
    pass

@router.get("/mentorias")
async def list_mentorias(
    status: Optional[str] = None,
    negocio_id: Optional[str] = None,
    mentor_id: Optional[str] = None,
    tipo: Optional[str] = None,
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Lista todas as mentorias com filtros"""
    pass

@router.get("/mentorias/{mentoria_id}")
async def get_mentoria_details(
    mentoria_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Retorna detalhes de uma mentoria"""
    pass
```

## Próximos Passos

1. ✅ Criar a estrutura frontend da página
2. ⏳ Implementar as APIs no backend conforme especificado
3. ⏳ Conectar o frontend com as APIs reais
4. ⏳ Implementar a funcionalidade de exportação CSV
5. ⏳ Adicionar testes unitários e de integração
6. ⏳ Adicionar gráficos e visualizações adicionais

## Referências

- Documento de especificação: `mentoriapage.md`
- Serviços de mentorias: `/lib/services/mentorias.ts`
- Página de exemplo: `/app/admin/mentores/page.tsx`

