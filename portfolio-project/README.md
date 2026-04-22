# Video Editor Portfolio

A full-stack portfolio website for showcasing video editing work. The frontend presents projects and preview clips, while the backend handles contact form submissions through an email endpoint.

## Project Description

This project is designed as a personal portfolio for a video editor. It includes:

- A responsive landing page with portfolio cards and video previews
- Embedded links to external portfolio and social content
- A backend API endpoint for contact form and email handling
- A deployment-ready structure for frontend and backend hosting

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Backend

- Node.js
- Express.js
- Nodemailer
- dotenv
- CORS

## Project Structure

```text
portfolio-project/
  frontend/
    index.html
    assets/
      images/
      videos/
  backend/
    server.js
    package.json
    .env.example
  netlify.toml
```

## Local Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Create a `.env` file in `backend/` from `.env.example` and add your credentials.

### 3. Run backend

```bash
npm run dev
```

### 4. Run frontend

Open `frontend/index.html` with Live Server or any static file server.
