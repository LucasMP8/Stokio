## Stokio — Sistema de Gestão e Controle de Estoque
Plataforma de gerenciamento de inventário, movimentações e controle de produtos.

# 1. Sobre o Projeto

O Stokio é um sistema de gestão e controle de estoque desenvolvido com o objetivo de proporcionar maior eficiência, organização e confiabilidade no gerenciamento de produtos e operações de armazenagem.

A plataforma centraliza as informações do inventário, permitindo acompanhar as quantidades disponíveis, registrar entradas e saídas e manter dados consistentes sobre os produtos e estoques cadastrados.

Projeto acadêmico da disciplina Desenvolvimento Web Front-End — Universidade FUMEC.

**Integrantes:** Lucas Alves e Lucas Marques.

# 2. Objetivos
- Centralizar o gerenciamento de produtos e informações de estoque.
- Registrar e acompanhar movimentações de entrada e saída.
- Facilitar o controle de quantidades disponíveis.
- Reduzir inconsistências e falhas decorrentes de controles manuais.

# 3. Tecnologias Utilizadas
- **Angular 22** (TypeScript, HTML5 e CSS3) — interface, rotas, services e formulários reativos.
- **HttpClient** — requisições HTTP para a Web API.
- **JSON-Server** — Web API e base de dados (arquivo `db.json`).
- **Vitest** — testes unitários.

# 4. Funcionalidades
- **Login e cadastro** com formulários reativos e validações.
- **Dashboard** com resumo do estoque.
- **Gerenciar inventário:** cadastro, edição, pesquisa e exclusão de estoques (um estoque com produtos não pode ser excluído).
- **Produtos:** cadastro, edição e exclusão, filtros por situação e por estoque, resumo do inventário e paginação.
- **Registro de movimentação:** adicionar ou retirar unidades, com o motivo da retirada (venda, perda ou uso interno) e bloqueio de retirada maior que o saldo.
- Todos os dados são lidos e gravados no JSON-Server por meio de services.

## Rotas

| Rota                  | Página                       |
| --------------------- | ---------------------------- |
| `/login`              | Login                        |
| `/cadastro`           | Cadastro de usuário          |
| `/dashboard`          | Dashboard                    |
| `/inventory`          | Gerenciar inventário         |
| `/inventory/:id`      | Detalhes do estoque          |
| `/produtos`           | Produtos                     |
| `/registro-movimento` | Registro de movimentação     |
| `/settings`           | Configurações                |

# 5. Como rodar em outro computador

Não é preciso instalar o Angular: ele e o JSON-Server são baixados pelo próprio projeto no `npm install`. Só é necessário o **Node.js**.

### Passo 1 — Instalar o Node.js
1. Acesse https://nodejs.org e baixe a versão **LTS** (24 ou superior).
2. Instale com as opções padrão.
3. Abra um terminal (no Windows: *Prompt de Comando* ou *PowerShell*) e confira:
   ```bash
   node -v
   npm -v
   ```
   Se aparecerem os números das versões, está pronto.

### Passo 2 — Obter o projeto
- **Pelo zip:** extraia o arquivo `Stokio.zip` em uma pasta.
- **Pelo Git:**
  ```bash
  git clone https://github.com/LucasMP8/Stokio.git
  ```

### Passo 3 — Instalar as dependências
No terminal, entre na pasta do projeto e rode (só na primeira vez, demora alguns minutos):
```bash
cd Stokio
npm install
```

### Passo 4 — Iniciar a API (terminal 1)
```bash
npm run api
```
Deixe este terminal aberto. A API fica em http://localhost:3000.

### Passo 5 — Iniciar o site (terminal 2)
Abra **outro** terminal na mesma pasta e rode:
```bash
npm start
```
Quando aparecer `Local: http://localhost:4200/`, abra esse endereço no navegador.

### Passo 6 — Entrar no sistema
Use o usuário de teste: **jasond@gmail.com** / senha **vicecity**, ou crie uma conta na tela de cadastro.

### Problemas comuns
- **"npm não é reconhecido":** feche e abra o terminal depois de instalar o Node.js.
- **Aviso "Não foi possível carregar...":** a API não está rodando — faça o Passo 4.
- **Porta em uso:** feche outros terminais que estejam rodando o projeto.
- Para parar os servidores, pressione `Ctrl + C` em cada terminal.

### Outros comandos
```bash
npm test        # roda os testes
npm run build   # gera a versão de produção
```

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Stokio
Gestão eficiente. Controle inteligente.

Feito por Lucas Alves, Lucas Marques — Projeto acadêmico — @Fumec
