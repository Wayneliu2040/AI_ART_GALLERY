# AI Art Gallery Frontend

This is the React frontend for the `AI Art Gallery` project. It is structured for deployment to `Azure Static Web Apps` and includes:

- React + Vite application setup
- React Router single-page routing
- Authentication state management
- Login, register, gallery, upload, detail, and my uploads pages
- `staticwebapp.config.json` for Azure Static Web Apps routing support
- Local mock mode for UI testing before the backend is finished
- Docker support for running the frontend in an isolated local environment

## 1. Project Structure

Key files and folders:

- `public/staticwebapp.config.json`
- `src/App.jsx`
- `src/state/AuthContext.jsx`
- `src/services/api.js`
- `src/styles/app.css`
- `.env.example`
- `Dockerfile`
- `.dockerignore`

## 2. Run the Frontend Locally with Docker

This approach is designed to:

- avoid installing Node.js dependencies directly on Windows
- keep the local environment clean
- run the frontend inside Docker Desktop
- access the UI from a Windows browser

### 2.1 Recommended Hardware

Minimum:

- Windows 10 or Windows 11
- Dual-core CPU or better
- 8 GB RAM or more
- At least 5 GB available disk space

Recommended:

- 4-core CPU or better
- 16 GB RAM
- SSD storage

### 2.2 Software Requirements

- Docker Desktop
- Git
- A browser such as Edge or Chrome
- Optional: Azure CLI

Useful checks:

```powershell
docker --version
docker compose version
git --version
```

### 2.3 Environment Variables

Open the frontend directory:

```powershell
cd D:\workspace\jupyterdir\react\ai-image-share-frontend\frontend
Copy-Item .env.example .env
```

Default environment values:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENABLE_MOCKS=true
```

If you only want to preview the UI, keep:

```env
VITE_ENABLE_MOCKS=true
```

This allows the app to run without a local backend.

### 2.4 Build the Docker Image

```powershell
docker build -t ai-art-gallery-frontend .
```

### 2.5 Run the Container

```powershell
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

Open the app in your browser:

```text
http://localhost:5173
```

### 2.6 Demo Account

- Email: `demo@aiartgallery.app`
- Password: `Password123!`

### 2.7 Suggested Local UI Checks

1. Open the login page
2. Sign in with the demo account
3. Review the gallery page
4. Like an image
5. Open an image detail page
6. Post a comment
7. Test the upload form with a local image file

### 2.8 Stop the Container

If it is running in the foreground:

```text
Ctrl + C
```

Or stop it explicitly:

```powershell
docker stop ai-art-gallery-frontend
```

### 2.9 Rebuild When Code Changes

The current Docker setup is intended for clean local validation, not hot reload development.

If you change the frontend code, rebuild and run again:

```powershell
docker build -t ai-art-gallery-frontend .
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

If you want live reload later, a `docker-compose.yml` development setup can be added.

## 3. Switch to the Real Backend API

Update `.env`:

```env
VITE_API_BASE_URL=https://your-api-domain/api
VITE_ENABLE_MOCKS=false
```

Then rebuild and rerun the container:

```powershell
docker build -t ai-art-gallery-frontend .
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

Expected backend endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/images`
- `GET /api/images/{id}`
- `POST /api/images`
- `GET /api/images/{id}/comments`
- `POST /api/images/{id}/comments`
- `POST /api/images/{id}/like`

## 4. Deploy to Azure Static Web Apps

### 4.1 Prerequisites

- An Azure account
- A GitHub repository
- The frontend code pushed to GitHub
- The project repository containing the `frontend/` folder

Suggested repository layout:

```text
ai-image-share-frontend/
  demo/
  documents/
  frontend/
```

### 4.2 Recommended Deployment Method

Use:

- Azure Portal + GitHub integration

This is the clearest workflow for a student project and works well with automatic deployments.

### 4.3 Create the Static Web App

1. Sign in to [Azure Portal](https://portal.azure.com/)
2. Search for `Static Web Apps`
3. Select `Create`
4. Fill in the required details:
   - Subscription
   - Resource Group
   - Name, for example `ai-art-gallery-frontend`
   - Plan Type, usually `Free`
   - Region
5. Under deployment settings, connect GitHub:
   - choose the GitHub account
   - authorize Azure
   - select the repository
   - select the deployment branch, for example `main`

### 4.4 Build Configuration

Use these values:

- App location: `/frontend`
- Api location: leave empty
- Output location: `dist`

These values are important because:

- `frontend/` is the Vite app root
- `dist/` is the Vite build output
- this project does not host the backend API inside Static Web Apps

### 4.5 SPA Routing Support

This project already includes:

- `public/staticwebapp.config.json`

It is used to:

- support React Router SPA navigation fallback
- prevent 404 errors when refreshing client-side routes
- keep routes like `/gallery`, `/upload`, and `/images/123` working correctly

### 4.6 Deploy with Mock Data or Real API

For UI-only demo deployment:

```env
VITE_ENABLE_MOCKS=true
```

For a live backend deployment:

```env
VITE_API_BASE_URL=https://your-api-domain/api
VITE_ENABLE_MOCKS=false
```

If your backend is deployed on an Azure VM, make sure:

- the VM endpoint is reachable
- CORS is configured correctly
- the frontend points to the correct API base URL

### 4.7 Post-Deployment Checks

After deployment, verify:

1. the site opens successfully
2. `/login` works
3. `/gallery` loads correctly
4. refreshing `/gallery` does not return 404
5. routes like `/images/1` open directly
6. there are no CORS errors if using the real backend

### 4.8 Common Azure Issues

Common issues include:

- SPA routes returning 404
- incorrect `VITE_API_BASE_URL`
- backend not reachable from Azure Static Web Apps
- backend CORS misconfiguration
- wrong `app_location` or `output_location`

For this project, the correct build settings are:

- `app_location: /frontend`
- `output_location: dist`

## 5. Recommended Software Versions

- Docker Desktop: latest stable version
- Git: latest stable version
- Windows: Windows 10 or Windows 11
- Optional: latest Azure CLI

If you later want to run the frontend directly on the host, use:

- Node.js `20 LTS`

## 6. Recommended Workflow

1. Run the frontend locally in Docker using mock mode
2. Verify the UI and routing
3. Push the code to GitHub
4. Deploy to Azure Static Web Apps using `frontend + dist`
5. Switch to the real backend API when it is ready

## 7. Common Commands

Enter the frontend directory:

```powershell
cd D:\workspace\jupyterdir\react\ai-image-share-frontend\frontend
```

Copy the environment template:

```powershell
Copy-Item .env.example .env
```

Build the Docker image:

```powershell
docker build -t ai-art-gallery-frontend .
```

Run the container:

```powershell
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

Stop the container:

```powershell
docker stop ai-art-gallery-frontend
```

## 8. References

- Azure Static Web Apps Quickstart:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal)
- Azure Static Web Apps Build Configuration:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- Azure Static Web Apps Configuration:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)

The routing behavior for `staticwebapp.config.json` and the meaning of `app_location` and `output_location` follow the Microsoft documentation above.
