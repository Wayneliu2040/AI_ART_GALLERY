# AGENTS.md

## Project Overview
- Project name: `AI_ART_GALLERY`
- Current display name: `AI Art Gallery`
- Purpose: users register/login, browse AI-generated images, upload artwork with metadata, and interact with likes/comments.
- Main flow: login/register -> `Explore` gallery -> image detail -> like/comment -> `User Center` -> `Upload Image`.
- Stage: MVP. Frontend is already deployed to Azure Static Web Apps. Backend + Azure SQL + Blob code exists, but full live verification is still pending.

## Tech Stack
- Frontend: React 18 + Vite + React Router
- Backend: ASP.NET Core Web API (.NET 8)
- Database/storage: Azure SQL Database + Azure Blob Storage
- Styling: custom CSS in `frontend/src/styles/app.css`
- Package manager:
  - Frontend: `npm`
  - Backend: `.NET CLI`
- Deployment target:
  - Frontend: Azure Static Web Apps
  - Backend: intended for Azure VM

## Repository Structure
- `frontend/`: React app
- `frontend/src/pages/`: login, register, gallery, upload, image detail, user center
- `frontend/src/services/api.js`: API layer, mock/live switch, auth storage
- `backend/`: .NET API
- `backend/Controllers/`: `AuthController`, `ImagesController`, `UsersController`
- `database/sql/`: schema and seed scripts
- `database/storage/`: Blob/container setup helpers
- `demo/`: old demo/reference frontend
- `documents/`: planning and deployment notes
- `graph/`: BPMN files for current project flows
- `.github/workflows/azure-static-web-apps-thankful-ground-0e1386110.yml`: frontend auto-deploy workflow
- `TodoList.md`: Azure testing checklist

## Current Feature Status
- Site/app rename: `Done`
- Homepage/layout: `Done`
- Image gallery: `Done`
- Image upload: `Done`
- Image metadata form: `Done`
- Tags: `Partially done`
  - Upload form has 10 tags; gallery tag consistency still needs verification.
- Prompt field: `Done`
- Generation platform/environment field: `Done`
  - Current field name is `platform`.
- Prompt sale price: `Not started`
- Image detail page: `Done`
- Comments: `Done`
- Likes/favorites: `Partially done`
  - Likes exist; favorites/bookmarks do not.
- API endpoints: `Done`
- Database schema/models: `Done`
- Storage integration: `Partially done`
- Styling/UI polish: `Partially done`
- Deployment: `Partially done`
  - Frontend deploy is live; backend live integration still needs verification.

## Important Decisions Already Made
- Keep the product name as `AI Art Gallery`.
- Keep app UI text in English; Chinese docs are okay as parallel documentation.
- Keep frontend auth local storage key as `ai_art_gallery_user`.
- Keep current MVP scope aligned with implemented code; do not reintroduce speculative features into docs/graphs.
- Left navigation should remain `Explore`, `User Center`, `Upload Image`.
- `Explore` should focus on search/filter/gallery content, not the old upload banner layout.
- `Upload Image` uses a simplified CTA + modal form.
- Images are stored in Blob Storage; metadata and Blob URL belong in Azure SQL.
- API route groups:
  - `/api/auth/*`
  - `/api/images/*`
  - `/api/users/me/*`
- Frontend is deployed separately from backend; no SWA integrated API folder is in use.

## How to Run the Project

### Frontend
- Install: `cd frontend` then `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Docker:
  - `docker build -t ai-art-gallery-frontend .`
  - `docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend`

### Backend
- Restore: `cd backend` then `dotnet restore`
- Build: `dotnet build`
- Run: `dotnet run`
- Docker:
  - `docker build -t ai-art-gallery-api .`
  - `docker run --rm -p 8080:8080 --name ai-art-gallery-api ai-art-gallery-api`

### Test / Lint / Format
- Test: `Needs verification`
- Lint: `Needs verification`
- Format: `Needs verification`

## Environment Variables
- Frontend:
  - `VITE_API_BASE_URL`
  - `VITE_ENABLE_MOCKS`
- Backend config keys:
  - `ConnectionStrings:DefaultConnection`
  - `Jwt:Issuer`
  - `Jwt:Audience`
  - `Jwt:SecretKey`
  - `Jwt:ExpiryMinutes`
  - `AzureStorage:ConnectionString`
  - `AzureStorage:ContainerName`
  - `Cors:AllowedOrigins`

## Known Issues / Things to Verify
- Full Azure end-to-end verification is still pending.
- Confirm gallery filters match the 10-tag upload taxonomy.
- Confirm production frontend is not accidentally using mock mode.
- Responsive/browser verification is still needed after UI polish.
- `frontend/README.md` still contains an older example path and should be checked later.
- Current worktree has local changes outside normal app code:
  - `.gitignore` modified
  - `graph/` untracked

## Next Recommended Tasks
1. Verify backend config and live API connectivity.
   - Check `backend/appsettings*.json`, `backend/Program.cs`
2. Run a real Azure end-to-end test.
   - Check `frontend/.env`, `frontend/src/services/api.js`, `database/sql/001_create_schema.sql`, `database/storage/create-container.ps1`
3. Verify tag consistency between upload and gallery.
   - Check `frontend/src/pages/UploadPage.jsx`, `frontend/src/pages/GalleryPage.jsx`
4. Decide whether to commit BPMN assets and current `.gitignore` changes.
   - Check `graph/`, `.gitignore`
5. Clean up docs for current path/deployment reality.
   - Check `README.md`, `frontend/README.md`, `backend/README.md`

## Instructions for Future Codex Sessions
1. Read this file first.
2. Inspect current repo state before editing.
3. Prefer small, verifiable changes.
4. Do not introduce new frameworks or major architecture changes unless explicitly requested.
5. Preserve existing decisions unless there is a clear reason to change them.
6. Mark uncertain assumptions clearly.
7. After changes, report:
   - Files changed
   - What changed
   - Commands run
   - Verification results
   - Remaining issues
