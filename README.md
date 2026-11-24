## Stokio — Sistema de Gestão e Controle de Estoque
Plataforma de gerenciamento de inventário, movimentações e controle de produtos.

# 1. Sobre o Projeto

O Stokio é um sistema de gestão e controle de estoque desenvolvido com o objetivo de proporcionar maior eficiência, organização e confiabilidade no gerenciamento de produtos e operações de armazenagem.

A plataforma tem como propósito centralizar as informações relacionadas ao inventário, permitindo o acompanhamento das quantidades disponíveis, o registro de entradas e saídas, o monitoramento das movimentações e a manutenção de dados consistentes sobre os produtos cadastrados.

O projeto será desenvolvido utilizando Java no backend e Angular no frontend, adotando uma arquitetura que favoreça a organização do código, a manutenibilidade, a escalabilidade e a evolução contínua da aplicação.

# 2. Objetivos
O Stokio tem como principais objetivos:
    Centralizar o gerenciamento de produtos e informações de estoque.
    Registrar e acompanhar movimentações de entrada e saída.
    Facilitar o controle de quantidades disponíveis.
    Melhorar a rastreabilidade das operações realizadas.
    Reduzir inconsistências e falhas decorrentes de controles manuais.
    Disponibilizar informações estruturadas para apoiar a tomada de decisões.

# 3. Tecnologias Utilizadas
Backend
    Typescript: linguagem de programação responsável pelas regras de negócio e pelo processamento das operações.
Frontend
    Angular: framework responsável pela construção da interface web e pela interação com os usuários.
    HTML5 e CSS3: tecnologias para estruturação e estilização das interfaces.
Banco de Dados
O banco de dados será definido conforme os requisitos técnicos do projeto, considerando critérios como integridade dos dados, consistência transacional e facilidade de manutenção.

# 4. Status do Projeto
Status atual: em desenvolvimento.
O Stokio encontra-se em fase de estruturação e planejamento técnico. As funcionalidades, tecnologias complementares e decisões arquiteturais serão consolidadas ao longo do desenvolvimento.

# 5. Considerações Finais
O Stokio tem como propósito oferecer uma solução organizada, confiável e evolutiva para o gerenciamento de estoque, contribuindo para a padronização dos processos operacionais e para a melhoria do controle de inventário.
A utilização de Java e Angular estabelece uma base tecnológica adequada para a construção de uma aplicação web modular, com responsabilidades bem definidas e potencial de expansão.

# 6. Frontend — Etapa 1: Manage Inventory

Funcionalidades implementadas:
- Layout com menu lateral de navegação (`routerLink`), barra superior com pesquisa e lista de cards.
- Criação de cards (**Add Product**) com nome do card, nome, descrição e ID gerado automaticamente.
- Edição dos cards (**Edit**).
- Pesquisa entre os cards pelo campo da barra superior (ID, nome do card, nome ou descrição).
- Página de detalhes do card (`/inventory/:id`).
- Dados simulados com mock objects (`src/app/mocks/mock-cards.ts`), sem API nem banco de dados.

## Como executar

Pré-requisito: Node.js 18.13 ou superior.

```bash
npm install
npm start
```

Acesse `http://localhost:4200/`.

## Rotas

| Rota             | Página                  |
| ---------------- | ----------------------- |
| `/inventory`     | Manage Inventory (Home) |
| `/inventory/:id` | Detalhes do card        |
| `/dashboard`     | Dashboard               |
| `/reports`       | Reports                 |
| `/orders`        | Orders                  |
| `/manage-store`  | Manage Store            |
| `/settings`      | Settings                |

## Estrutura

```
src/app/
├── app-routing.module.ts      # rotas da aplicação
├── app.module.ts
├── components/
│   ├── sidebar/               # menu de navegação lateral
│   └── topbar/                # barra superior com pesquisa
├── models/store-card.model.ts # interface do card
├── mocks/mock-cards.ts        # lista estática (mock)
├── services/card.service.ts   # listagem, criação, edição e pesquisa
└── pages/
    ├── inventory/             # Home: lista + formulário de criar/editar
    ├── card-detail/           # exibição das informações de um card
    └── dashboard, reports, orders, manage-store, settings
```

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stokio
Gestão eficiente. Controle inteligente.
