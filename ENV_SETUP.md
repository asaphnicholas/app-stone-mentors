# Configuração de Variáveis de Ambiente

## Configuração do Ambiente

Para configurar o projeto, você precisa criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

### Arquivo `.env.local`

```bash
# Environment Configuration
NODE_ENV=development

# Frontend API Configuration (using internal proxy)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_API_BASE_URL=/api

# Backend Configuration (server-side only)
BACKEND_URL=http://127.0.0.1:8000

# Production URLs (uncomment when deploying)
# BACKEND_URL=https://your-production-api.com
```

## Variáveis de Ambiente

### Frontend (Client-side)
- `NEXT_PUBLIC_API_URL`: URL base da API (vazio para usar proxy interno)
- `NEXT_PUBLIC_API_BASE_URL`: URL base da API com versão (/api)

### Backend (Server-side only)
- `BACKEND_URL`: URL do backend real (http://127.0.0.1:8000)

### Production
- `BACKEND_URL`: URL do backend em produção

## Como Configurar

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` com suas configurações

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Endpoints da API

### Autenticação (via proxy interno)
- **Login**: `POST /api/auth/login`
- **Cadastro**: `POST /api/auth/register`
- **Dados do Usuário**: `GET /api/auth/me`
- **Refresh Token**: `POST /api/auth/refresh`
- **Logout**: `POST /api/auth/logout`

### Usuários (via proxy interno)
- **Listar**: `GET /api/users`
- **Detalhes**: `GET /api/users/{id}`
- **Atualizar**: `PUT /api/users/{id}`
- **Deletar**: `DELETE /api/users/{id}`

### Mentores (via proxy interno)
- **Listar**: `GET /api/mentors`

### Negócios (via proxy interno)
- **Listar**: `GET /api/business`
- **Criar**: `POST /api/business`

### Materiais Admin (via proxy interno)
- **Listar**: `GET /api/admin/materials`
- **Criar**: `POST /api/admin/materials`
- **Upload**: `POST /api/admin/materials/upload`

### Materiais Mentor (via proxy interno)
- **Listar**: `GET /api/mentor/materials`
- **Concluir**: `POST /api/mentor/materials/{id}/complete`
- **Status Qualificação**: `GET /api/mentor/qualification-status`

### Acesso a Arquivos (via proxy interno)
- **Visualizar**: `GET /api/files/material/{id}?expiry_hours=2`
- **Informações**: `GET /api/files/material/{id}/info`
- **Download**: `GET /api/files/material/{id}/download`

### Estrutura das Requisições

#### Login
```json
{
  "email": "user@example.com",
  "senha": "string"
}
```

#### Cadastro
```json
{
  "nome": "string",
  "email": "user@example.com",
  "senha": "string",
  "telefone": "string",
  "competencias": "string",
  "area_atuacao": "comunicacao_marketing"
}
```

**Áreas de Atuação Disponíveis:**
- `comunicacao_marketing` - Comunicação & Marketing
- `contabilidade_financas` - Contabilidade & Finanças
- `juridico` - Jurídico
- `tecnologia` - Tecnologia
- `recursos_humanos` - Recursos Humanos
- `comercial_vendas` - Comercial & Vendas
- `outras` - Outras

#### Dados do Usuário (GET /api/auth/me)
**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "id": "string",
  "nome": "string",
  "email": "string",
  "role": "admin",
  "status": "ativo",
  "telefone": "string",
  "competencias": "string",
  "area_atuacao": "tecnologia",
  "protocolo_concluido": true,
  "created_at": "2025-09-05T11:14:40.674Z",
  "last_login": "2025-09-05T11:14:40.674Z"
}
```

## Configuração do Backend

Certifique-se de que o backend está rodando na porta 8000:

```bash
# Exemplo de comando para iniciar o backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## Segurança

### Camada de Proxy
O sistema utiliza uma camada de proxy interno para proteger o backend:

- **Frontend** → **Next.js API Routes** → **Backend**
- URLs do backend não são expostas no navegador
- Headers de segurança adicionados automaticamente
- Validação de dados no proxy antes de enviar ao backend

### Benefícios
- ✅ Backend protegido e não exposto
- ✅ Headers de segurança automáticos
- ✅ Validação centralizada
- ✅ Logs centralizados
- ✅ Rate limiting (futuro)
- ✅ Cache (futuro)

## Troubleshooting

### Erro de CORS
Com o proxy interno, erros de CORS são eliminados. Se ainda ocorrerem, verifique:
1. Se o backend está configurado corretamente
2. Se as rotas de proxy estão funcionando

### Erro de Conexão
Verifique se:
1. O backend está rodando na porta 8000
2. As variáveis de ambiente estão configuradas corretamente
3. As rotas de proxy estão acessíveis
4. Não há firewall bloqueando a conexão

### Debug do Proxy
Para debugar problemas de proxy:
1. Verifique os logs do servidor Next.js
2. Teste as rotas de proxy diretamente
3. Verifique se o `BACKEND_URL` está correto
