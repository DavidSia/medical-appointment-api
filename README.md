# 🏥 Medical Appointment API

API REST para agendamento de consultas médicas, desenvolvida com Node.js, Fastify, Prisma e PostgreSQL.

## 📋 Sumário

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Regras de Negócio](#-regras-de-negócio)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web de alta performance
- **TypeScript** - Superset JavaScript com tipagem
- **Prisma** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas
- **Nodemailer** - Envio de emails
- **Swagger/Scalar** - Documentação da API

## 📦 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- Conta no [Mailtrap](https://mailtrap.io) (para testes de email)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/davidsia/medical-appointment-api.git
cd medical-appointment-api
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

1. Copie o arquivo de ambiente:
```bash
cp .env.example .env
```

2. Configure as variáveis no arquivo `.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medical_appointment?schema=public"

# Server
PORT=3333
HOST=0.0.0.0

# Mailtrap SMTP (crie uma conta gratuita em https://mailtrap.io)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=seu_usuario_mailtrap
MAIL_PASS=sua_senha_mailtrap
MAIL_FROM=noreply@clinica.com.br

# Clinic Info
CLINIC_NAME=Clínica Saúde Total
CLINIC_ADDRESS=Av. Barão do Rio branco, 1000 - Parnaíba, PI
```

3. Execute as migrations do banco:
```bash
npx prisma migrate dev
```

4. (Opcional) Popule o banco com dados de exemplo:
```bash
npm run db:seed
```

## ▶️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Visualizar banco de dados
```bash
npm run db:studio
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: http://localhost:3333/docs
- **Scalar Reference**: http://localhost:3333/reference

## 🔗 Endpoints

### Pacientes

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/patients` | Criar paciente |
| GET | `/api/patients` | Listar pacientes (paginado) |
| GET | `/api/patient/:patientId` | Buscar paciente com consultas |

### Médicos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/doctor` | Criar médico |
| GET | `/api/doctors` | Listar médicos (paginado) |

### Agenda

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/doctors/:doctorId/agenda` | Criar agenda do médico |
| GET | `/api/agendas` | Listar agendas (paginado) |

### Agendamentos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/appointments` | Criar agendamento |
| GET | `/api/appointments` | Listar agendamentos (paginado) |
| PATCH | `/api/appointments/:appointmentId/cancel` | Cancelar agendamento |

## 📄 Paginação

Todas as rotas de listagem suportam paginação via query parameters:

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | number | 1 | Número da página |
| `limit` | number | 10 | Itens por página (máx: 100) |

### Exemplo de requisição
```bash
GET /api/patients?page=1&limit=20
```

### Formato de resposta paginada
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

## 📝 Exemplos de Requisições

### Criar Paciente
```bash
curl -X POST http://localhost:3333/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-1111"
  }'
```

### Listar Pacientes
```bash
curl http://localhost:3333/api/patients?page=1&limit=10
```

### Criar Médico
```bash
curl -X POST http://localhost:3333/api/doctor \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Carlos Mendes",
    "specialty": "Cardiologia",
    "appointmentPrice": 250.00
  }'
```

### Listar Médicos
```bash
curl http://localhost:3333/api/doctors?page=1&limit=10
```

### Criar Agenda
```bash
curl -X POST http://localhost:3333/api/doctors/{doctorId}/agenda \
  -H "Content-Type: application/json" \
  -d '{
    "availableFromWeekDay": 1,
    "availableToWeekDay": 5,
    "availableFromTime": "08:00",
    "availableToTime": "17:00"
  }'
```

### Listar Agendas
```bash
curl http://localhost:3333/api/agendas?page=1&limit=10
```

### Criar Agendamento
```bash
curl -X POST http://localhost:3333/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "uuid-do-paciente",
    "doctorId": "uuid-do-medico",
    "appointmentAt": "2025-12-10T10:00:00.000Z"
  }'
```

### Listar Agendamentos
```bash
curl http://localhost:3333/api/appointments?page=1&limit=10
```

### Cancelar Agendamento
```bash
curl -X PATCH http://localhost:3333/api/appointments/{appointmentId}/cancel
```

## 📏 Regras de Negócio

### Pacientes
- Email deve ser único no sistema
- Campos obrigatórios: nome, email, telefone

### Médicos
- Pode ter múltiplas agendas
- Agendas não podem se sobrepor

### Agendamentos
- Não é permitido agendar no mesmo horário de outro paciente para o mesmo médico (retorna 409)
- Não é permitido agendar se o médico não tiver disponibilidade na agenda
- Um paciente não pode ter duas consultas no mesmo horário
- Email de confirmação é enviado ao criar agendamento

### Cancelamento
- Só é permitido cancelar com no mínimo 2 horas de antecedência
- Agendamento cancelado permanece no histórico
- Horário volta a ficar disponível após cancelamento

## 📁 Estrutura do Projeto

```
medical-appointment-api/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Script de seed
├── src/
│   ├── config/
│   │   ├── env.ts         # Variáveis de ambiente
│   │   └── prisma.ts      # Cliente Prisma
│   ├── modules/
│   │   ├── patient/       # Módulo de pacientes
│   │   ├── doctor/        # Módulo de médicos
│   │   ├── agenda/        # Módulo de agenda
│   │   └── appointment/   # Módulo de agendamentos
│   ├── shared/
│   │   ├── errors/        # Classes de erro
│   │   ├── utils/         # Utilitários
│   │   ├── email/         # Serviço de email
│   │   └── middlewares/   # Middlewares
│   ├── app.ts             # Configuração do Fastify
│   └── server.ts          # Ponto de entrada
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🗃️ Dados do Seed

O comando `npm run db:seed` cria:

- **2 Pacientes**
  - João Silva (joao.silva@email.com)
  - Maria Oliveira (maria.oliveira@email.com)

- **2 Médicos com agenda única**
  - Dr. Carlos Mendes - Cardiologia (Segunda a Sexta, 8h-17h)
  - Dra. Ana Paula Santos - Dermatologia (Terça a Sábado, 9h-18h)

- **2 Médicos com múltiplas agendas**
  - Dr. Roberto Fernandes - Ortopedia
    - Segunda a Quarta, 8h-14h
    - Quinta a Sábado, 8h-11h
  - Dra. Fernanda Lima - Pediatria
    - Segunda a Terça, 7h-12h
    - Quinta a Sexta, 14h-20h

- **2 Agendamentos de exemplo**

## 📊 Formatos de Retorno

### Data
```
9 de Set, 2025
```

### Hora
```
14h30
```

### Valor
```
R$ 250,00
```

## 🔑 Códigos de Erro

| Código | HTTP Status | Descrição |
|--------|-------------|-----------|
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `CONFLICT` | 409 | Conflito (duplicidade) |
| `VALIDATION_ERROR` | 422 | Erro de validação |
| `FORBIDDEN` | 403 | Operação não permitida |
| `INTERNAL_ERROR` | 500 | Erro interno |

### Formato padrão de erro
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Já existe uma consulta agendada para este médico neste horário"
  }
}
```

## 📧 Configuração do Mailtrap

1. Crie uma conta gratuita em [mailtrap.io](https://mailtrap.io)
2. Acesse **Email Testing** > **Inboxes**
3. Clique em **Show Credentials**
4. Copie os valores de `Host`, `Port`, `Username` e `Password`
5. Configure no seu `.env`

## 🧪 Testando a API

1. Execute o seed para ter dados de teste:
```bash
npm run db:seed
```

2. Use o Swagger UI ou Scalar para testar os endpoints interativamente

3. Ou use o arquivo de collection do Postman/Insomnia (se disponível)

## 📌 Observações

- Todos os IDs são UUIDv4
- Valores monetários são armazenados como DECIMAL(8,2)
- Os dias da semana seguem: 0=Domingo, 1=Segunda, ..., 6=Sábado
- Horários devem ser enviados no formato HH:MM ou HH:MM:SS
- Datas de agendamento devem ser enviadas no formato ISO 8601

## 👤 Autor

Desenvolvido por David para o desafio técnico ClickIP.

## 📜 Licença

Este projeto está sob a licença ISC.