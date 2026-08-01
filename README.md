<p align="center">
  <img src="frontend/assets/branding/logo-true.svg" width="140" alt="My Habitica Pets logo">
</p>

<h1 align="center">My Habitica Pets</h1>

<p align="center">
  A pixel-inspired digital album for displaying a Habitica pet collection.
</p>

<p align="center">
  <strong>English</strong> · <a href="README-PTBR.md">Português (Brasil)</a>
</p>

<p align="center">
  <img alt="Java 17" src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
  <img alt="Spring Boot 3" src="https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="Habitica API" src="https://img.shields.io/badge/Habitica-API_v3-432874?style=for-the-badge">
</p>

## About the project

My Habitica Pets is a full-stack application that turns the pets registered in a Habitica account into an interactive, responsive card collection.

The Java backend communicates with the Habitica API, organizes the pet metadata and returns a simplified card catalog. The TypeScript frontend displays that catalog with search, category filters, rotating eggs, a pixel mode and responsive layouts for desktop and mobile.

> [!IMPORTANT]
> This is an independent, non-commercial fan project created for educational and portfolio purposes. It is not affiliated with, endorsed by or maintained by Habitica. Habitica names, artwork and game assets belong to their respective owners.

## Features

- Live pet collection loaded from a Habitica account.
- Pet, egg and hatching potion metadata obtained from the Habitica API.
- Images loaded from Habitica's public image repository.
- Search by pet name.
- Desktop category filters for Standard, Magic Potion, Quest, Wacky and Special pets.
- Responsive card album with a dedicated three-column mobile layout.
- Optional pixel font and alternate pixel logo, with the preference saved locally.
- Mobile navigation menu and compact sticky header.
- Rotating egg display and a back-to-top button.
- 3D pointer effect on cards for devices that support hover.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, TypeScript 6 |
| Backend | Java 17, Spring Boot 3.2.4, Maven |
| External data | Habitica API v3 |
| Assets | Habitica public image repository |
| Deployment support | Docker for the backend; static frontend build |

## How it works

```text
Browser
   │
   │ GET /cards and GET /cards/eggs
   ▼
Spring Boot backend
   │
   ├── Authenticated GET /api/v3/user
   ├── Public GET /api/v3/content
   └── Builds image URLs from Habitica's image repository
   │
   ▼
Formatted pet cards rendered by the TypeScript frontend
```

The backend exposes two local endpoints:

| Endpoint | Description |
| --- | --- |
| `GET /cards` | Returns the account's pets as formatted and ordered card objects. |
| `GET /cards/eggs` | Returns the egg image URLs used by the rotating egg display. |

## Project structure

```text
my-habitica-pets/
├── backend/
│   ├── src/main/java/       # Spring Boot application and Habitica integration
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── assets/              # Branding, background and interface assets
│   ├── src/app.ts           # Frontend behavior and card rendering
│   ├── index.html           # Local development page
│   ├── index-prod.html      # Production build page
│   ├── style.css
│   └── package.json
├── README.md
└── README-PTBR.md
```

## Run locally

### Prerequisites

Install the following tools before starting:

- Java 17 or newer;
- Maven;
- Node.js and npm;
- Python 3, or another static HTTP server;
- a Habitica account with its User ID and API token.

Your Habitica credentials are sensitive. Never commit them to the repository, expose them in frontend code or share them publicly.

### 1. Clone the repository

```bash
git clone https://github.com/fabioperettig/my-habitica-pets.git
cd my-habitica-pets
```

### 2. Start the backend

Open a terminal in the project root:

```bash
cd backend
export HABITICA_USER_ID="YOUR_HABITICA_USER_ID"
export HABITICA_API_KEY="YOUR_HABITICA_API_TOKEN"
mvn spring-boot:run
```

Keep this terminal running. The backend will be available at:

```text
http://localhost:8080/cards
```

If macOS selects a different Java version, run this before starting Spring Boot:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### 3. Build and serve the frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run build
python3 -m http.server 5500 --directory dist
```

Then open:

```text
http://localhost:5500
```

The frontend automatically uses `http://localhost:8080` as its API when opened on `localhost` or `127.0.0.1`.

### After changing the code

- Backend changes: stop the backend with `Ctrl+C` and run `mvn spring-boot:run` again.
- Frontend changes: run `npm run build` again and refresh the browser.
- Stop either local server with `Ctrl+C` in its terminal.

## Run the backend with Docker

From the project root:

```bash
docker build -t my-habitica-pets-backend ./backend
docker run --rm -p 8080:8080 \
  -e HABITICA_USER_ID="YOUR_HABITICA_USER_ID" \
  -e HABITICA_API_KEY="YOUR_HABITICA_API_TOKEN" \
  my-habitica-pets-backend
```

The frontend must still be built and served separately.

## Security notes

- Keep `HABITICA_API_KEY` private.
- Do not place credentials in `app.ts`, HTML files or committed configuration files.
- Environment files and `application.properties` are ignored by Git in this repository.
- If a token is accidentally published, revoke it in Habitica and generate a new one.

## Status and possible next steps

The project is functional and actively evolving. Possible future improvements include automated tests, richer rarity styling, improved error states and deployment documentation.

## Contributing

Suggestions, bug reports and pull requests are welcome. When contributing, do not include Habitica credentials, private account data or copyrighted assets copied outside the sources already referenced by the project.

## Acknowledgements

- [Habitica](https://habitica.com/) for the game, API and original pet artwork.
- The Habitica community and contributors who maintain its public resources.

Created by [@fabioperettig](https://github.com/fabioperettig).
