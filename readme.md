# Microservices Lab: E-commerce with RabbitMQ

Este projeto é um laboratório prático de microsserviços utilizando **Node.js**, **TypeScript**, **RabbitMQ** e **Docker**. Ele demonstra como diferentes serviços podem se comunicar de forma assíncrona através de mensageria.

## 📁 Estrutura do Projeto

```text
/
├── src/                        # Código fonte da aplicação
│   ├── order-service/          # Serviço de Pedidos (Produtor)
│   │   ├── index.ts            # Lógica do serviço
│   │   ├── Dockerfile          # Configuração Docker
│   │   └── package.json        # Dependências do serviço
│   ├── catalog-service/        # Serviço de Catálogo (Consumidor)
│   │   ├── index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── notification-service/   # Serviço de Notificação (Consumidor)
│   │   ├── index.ts
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── App.tsx                 # Interface Visual (React)
│   ├── main.tsx                # Ponto de entrada do React
│   └── index.css               # Estilos globais (Tailwind)
├── tests/                      # Suíte de testes automatizados
│   ├── order-service.test.ts   # Testes de integração do Order Service
│   ├── consistency.test.ts     # Testes de consistência eventual
│   ├── contract.test.ts        # Testes de contrato (Schema)
│   └── infrastructure.test.ts  # Testes de saúde da infraestrutura
├── docker-compose.yml          # Orquestração dos containers e RabbitMQ
├── jest.config.cjs             # Configuração do Jest (Testes)
├── tsconfig.json               # Configuração do TypeScript
├── package.json                # Dependências do projeto raiz
└── metadata.json               # Metadados da aplicação
```

## 🚀 Como Rodar

1. Certifique-se de ter o Docker instalado.
2. Execute o comando:
   ```bash
   docker-compose up --build
   ```
3. Acesse a interface visual no navegador.

## 🧪 Testes

Para rodar a suíte de testes completa com relatório de cobertura:
```bash
npm test
```

## 🛠️ Tecnologias
- **Frontend**: React, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Mensageria**: RabbitMQ (amqplib).
- **Testes**: Jest, Supertest.
- **Infra**: Docker, Docker Compose.
