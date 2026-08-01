<p align="center">
  <img src="frontend/assets/branding/logo-true.svg" width="140" alt="Logo do My Habitica Pets">
</p>

<h1 align="center">My Habitica Pets</h1>

<p align="center">
  Um álbum digital inspirado em pixel art para exibir uma coleção de pets do Habitica.
</p>

<p align="center">
  <a href="README.md">English</a> · <strong>Português (Brasil)</strong>
</p>

<p align="center">
  <img alt="Java 17" src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
  <img alt="Spring Boot 3" src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="API do Habitica" src="https://img.shields.io/badge/Habitica-API_v3-432874?style=for-the-badge">
</p>

## Sobre o projeto

My Habitica Pets é uma aplicação full-stack que transforma os pets registrados em uma conta do Habitica em uma coleção de cards interativa e responsiva.

O backend Java se comunica com a API do Habitica, organiza os metadados dos pets e retorna um catálogo simplificado de cards. O frontend TypeScript apresenta esse catálogo com busca, filtros por categoria, ovos rotativos, modo pixelado e layouts responsivos para desktop e mobile.

> [!IMPORTANT]
> Este é um fan project independente e sem fins comerciais, criado para fins educacionais e de portfólio. O projeto não é afiliado, endossado ou mantido pelo Habitica. Os nomes, ilustrações e elementos do jogo pertencem aos seus respectivos proprietários.

## Funcionalidades

- Coleção de pets carregada diretamente de uma conta do Habitica.
- Metadados de pets, ovos e poções de eclosão obtidos pela API do Habitica.
- Imagens carregadas do repositório público de imagens do Habitica.
- Busca pelo nome do pet.
- Filtros no desktop para pets Standard, Magic Potion, Quest, Wacky e Special.
- Álbum responsivo com um layout mobile dedicado de três colunas.
- Fonte e logo pixelados opcionais, com a preferência salva localmente.
- Menu de navegação mobile e header fixo compacto durante a rolagem.
- Exibição rotativa de ovos e botão para voltar ao topo.
- Efeito 3D nos cards em dispositivos que suportam hover.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Frontend | HTML5, CSS3, TypeScript 6 |
| Backend | Java 17, Spring Boot 3.2.4, Maven |
| Dados externos | API v3 do Habitica |
| Imagens | Repositório público de imagens do Habitica |
| Suporte a deploy | Docker para o backend; build estático do frontend |

## Como funciona

```text
Navegador
   │
   │ GET /cards e GET /cards/eggs
   ▼
Backend Spring Boot
   │
   ├── GET autenticado em /api/v3/user
   ├── GET público em /api/v3/content
   └── Monta as URLs usando o repositório de imagens do Habitica
   │
   ▼
Cards formatados e renderizados pelo frontend TypeScript
```

O backend disponibiliza dois endpoints locais:

| Endpoint | Descrição |
| --- | --- |
| `GET /cards` | Retorna os pets da conta como objetos de card formatados e ordenados. |
| `GET /cards/eggs` | Retorna as URLs dos ovos usadas na exibição rotativa. |

## Estrutura do projeto

```text
my-habitica-pets/
├── backend/
│   ├── src/main/java/       # Aplicação Spring Boot e integração com o Habitica
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── assets/              # Identidade visual, background e assets da interface
│   ├── src/app.ts           # Comportamentos do frontend e renderização dos cards
│   ├── index.html           # Página para desenvolvimento local
│   ├── index-prod.html      # Página usada no build de produção
│   ├── style.css
│   └── package.json
├── README.md
└── README-PTBR.md
```

## Como executar localmente

### Pré-requisitos

Instale as seguintes ferramentas antes de começar:

- Java 17 ou mais recente;
- Maven;
- Node.js e npm;
- Python 3, ou outro servidor HTTP estático;
- uma conta no Habitica com seu User ID e token da API.

Suas credenciais do Habitica são sensíveis. Nunca as envie para o repositório, coloque no código do frontend ou compartilhe publicamente.

### 1. Clone o repositório

```bash
git clone https://github.com/fabioperettig/my-habitica-pets.git
cd my-habitica-pets
```

### 2. Inicie o backend

Abra um terminal na raiz do projeto:

```bash
cd backend
export HABITICA_USER_ID="SEU_USER_ID_DO_HABITICA"
export HABITICA_API_KEY="SEU_TOKEN_DA_API_DO_HABITICA"
mvn spring-boot:run
```

Mantenha esse terminal aberto. O backend estará disponível em:

```text
http://localhost:8080/cards
```

Caso o macOS selecione outra versão do Java, execute isto antes de iniciar o Spring Boot:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### 3. Compile e sirva o frontend

Abra um segundo terminal na raiz do projeto:

```bash
cd frontend
npm install
npm run build
python3 -m http.server 5500 --directory dist
```

Depois, acesse:

```text
http://localhost:5500
```

O frontend utiliza automaticamente `http://localhost:8080` como API quando é aberto em `localhost` ou `127.0.0.1`.

### Depois de alterar o código

- Alterações no backend: pare o backend com `Ctrl+C` e execute `mvn spring-boot:run` novamente.
- Alterações no frontend: execute `npm run build` novamente e atualize o navegador.
- Para encerrar qualquer servidor local, use `Ctrl+C` no terminal correspondente.

## Executar o backend com Docker

A partir da raiz do projeto:

```bash
docker build -t my-habitica-pets-backend ./backend
docker run --rm -p 8080:8080 \
  -e HABITICA_USER_ID="SEU_USER_ID_DO_HABITICA" \
  -e HABITICA_API_KEY="SEU_TOKEN_DA_API_DO_HABITICA" \
  my-habitica-pets-backend
```

O frontend ainda precisa ser compilado e servido separadamente.

## Segurança

- Mantenha `HABITICA_API_KEY` em segredo.
- Não coloque credenciais no `app.ts`, nos arquivos HTML ou em configurações enviadas ao Git.
- Arquivos de ambiente e `application.properties` são ignorados pelo Git neste repositório.
- Caso um token seja publicado acidentalmente, revogue-o no Habitica e gere um novo.

## Status e próximos passos

O projeto está funcional e continua evoluindo. Possíveis melhorias futuras incluem testes automatizados, estilos mais ricos por raridade, estados de erro aprimorados e documentação de deploy.

## Como contribuir

Sugestões, relatos de bugs e pull requests são bem-vindos. Ao contribuir, não inclua credenciais do Habitica, dados privados da conta ou assets protegidos copiados de fontes externas às já utilizadas pelo projeto.

## Agradecimentos

- [Habitica](https://habitica.com/) pelo jogo, pela API e pelas ilustrações originais dos pets.
- À comunidade e às pessoas que contribuem com os recursos públicos do Habitica.

Criado por [@fabioperettig](https://github.com/fabioperettig).
