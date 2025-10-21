# Rotas de Proxy - Admin Mentorias

Este diretório contém as rotas de proxy do Next.js que fazem a ponte entre o frontend e o backend Python (FastAPI).

## 📁 Estrutura de Arquivos

```
app/api/admin/mentorias/
├── route.ts              # GET - Lista todas as mentorias
├── stats/
│   └── route.ts          # GET - Estatísticas consolidadas
└── [id]/
    └── route.ts          # GET - Detalhes de uma mentoria
```

## 🔄 Fluxo de Requisições

### 1. Frontend → Proxy Next.js → Backend Python

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                  │
│  MentoriasContent.tsx                                           │
│  └─> adminMentoriasService.getMentoriaStats()                  │
│       └─> apiService.get('/admin/mentorias/stats')             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTP GET /api/admin/mentorias/stats
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    PROXY NEXT.JS (Node.js)                      │
│                                                                  │
│  app/api/admin/mentorias/stats/route.ts                        │
│  └─> Recebe requisição do frontend                             │
│  └─> Valida token de autenticação                              │
│  └─> Encaminha para backend Python                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTP GET /api/v1/admin/mentorias/stats
                               │ Authorization: Bearer {token}
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    BACKEND PYTHON (FastAPI)                     │
│                                                                  │
│  api/v1/controllers/admin_controller.py                        │
│  └─> @router.get("/mentorias/stats")                          │
│       └─> MentoriaStatsService.get_mentoria_stats()           │
│            └─> Consulta banco de dados                         │
│            └─> Calcula estatísticas                            │
│            └─> Retorna JSON                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📡 Endpoints Criados

### 1. **Estatísticas de Mentorias**

```
GET /api/admin/mentorias/stats
```

**Proxy:** `app/api/admin/mentorias/stats/route.ts`

**Backend:** `GET /api/v1/admin/mentorias/stats`

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

---

### 2. **Listar Mentorias**

```
GET /api/admin/mentorias
```

**Proxy:** `app/api/admin/mentorias/route.ts`

**Backend:** `GET /api/v1/admin/mentorias`

**Query Parameters:**
- `status` (opcional): DISPONIVEL, CONFIRMADA, EM_ANDAMENTO, FINALIZADA, CANCELADA
- `negocio_id` (opcional): Filtrar por negócio
- `mentor_id` (opcional): Filtrar por mentor
- `tipo` (opcional): PRIMEIRA, FOLLOWUP
- `data_inicio` (opcional): Data de início (YYYY-MM-DD)
- `data_fim` (opcional): Data de fim (YYYY-MM-DD)
- `skip` (opcional): Paginação (padrão: 0)
- `limit` (opcional): Itens por página (padrão: 50, máx: 200)
- `search` (opcional): Buscar por nome

**Response:**
```json
{
  "mentorias": [...],
  "total": 245,
  "skip": 0,
  "limit": 50,
  "has_more": true,
  "filtros_aplicados": {
    "status": null,
    "tipo": null,
    "periodo": "todos"
  }
}
```

---

### 3. **Detalhes de uma Mentoria**

```
GET /api/admin/mentorias/{id}
```

**Proxy:** `app/api/admin/mentorias/[id]/route.ts`

**Backend:** `GET /api/v1/admin/mentorias/{id}`

**Response:**
```json
{
  "id": "uuid",
  "negocio": {...},
  "mentor": {...},
  "tipo": "PRIMEIRA",
  "status": "FINALIZADA",
  "timestamps": {...},
  "diagnostico": {...},
  "checkout": {...}
}
```

---

### 4. **Exportar CSV (Já Existente)**

```
GET /api/admin/relatorios/mentorias/exportar
```

**Proxy:** `app/api/admin/relatorios/mentorias/exportar/route.ts`

**Backend:** `GET /api/v1/admin/relatorios/mentorias/exportar`

**Response:** Arquivo CSV

---

## 🔐 Autenticação

Todas as rotas requerem autenticação via token JWT:

```
Authorization: Bearer {token}
```

Se o token não for fornecido ou for inválido, retorna:
```json
{
  "message": "Token de autorização é obrigatório"
}
```
**Status:** 401 Unauthorized

---

## 🛡️ Segurança

### Validações Implementadas:

1. **Token obrigatório** em todas as rotas
2. **Validação de parâmetros** no proxy
3. **Tratamento de erros** robusto
4. **Logs detalhados** para debugging
5. **CORS** configurado via Next.js

### Headers de Segurança:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

---

## 📊 Logs

Cada rota de proxy inclui logs detalhados:

```
[Admin Mentorias Stats] Fazendo requisição para: http://127.0.0.1:8000/api/v1/admin/mentorias/stats
[Admin Mentorias Stats] Resposta bem-sucedida
```

---

## 🔧 Configuração

As rotas usam a variável de ambiente:

```env
BACKEND_URL=http://127.0.0.1:8000
```

**Desenvolvimento:**
- Frontend: `http://localhost:3000`
- Proxy Next.js: `http://localhost:3000/api`
- Backend Python: `http://127.0.0.1:8000`

**Produção:**
- Configurar `BACKEND_URL` com a URL do backend em produção

---

## 🧪 Testando as Rotas

### 1. Teste com curl:

```bash
# Estatísticas
curl -X GET "http://localhost:3000/api/admin/mentorias/stats" \
  -H "Authorization: Bearer SEU_TOKEN"

# Listar mentorias
curl -X GET "http://localhost:3000/api/admin/mentorias?limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"

# Detalhes de uma mentoria
curl -X GET "http://localhost:3000/api/admin/mentorias/UUID_MENTORIA" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 2. Teste via DevTools:

Abra o Console do navegador e observe:
- Network tab: Veja as requisições sendo feitas
- Console: Logs do `apiService`

---

## ✅ Status das Rotas

- [x] `/api/admin/mentorias/stats` - Criado ✨
- [x] `/api/admin/mentorias` - Criado ✨
- [x] `/api/admin/mentorias/[id]` - Criado ✨
- [x] `/api/admin/relatorios/mentorias/exportar` - Já existia ✅

---

## 🚀 Próximos Passos

### Backend (Python/FastAPI)

Agora que os proxies estão prontos, o backend precisa implementar:

1. **`GET /api/v1/admin/mentorias/stats`**
   - Service: `mentoria_stats_service.py`
   - Controller: `admin_controller.py`

2. **`GET /api/v1/admin/mentorias`**
   - Service: `mentoria_admin_service.py`
   - Controller: `admin_controller.py`

3. **`GET /api/v1/admin/mentorias/{id}`**
   - Service: `mentoria_admin_service.py`
   - Controller: `admin_controller.py`

Quando essas APIs forem implementadas no backend, o frontend funcionará automaticamente! 🎉

---

**Criado em:** 21/10/2024
**Versão:** 1.0

