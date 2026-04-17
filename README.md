# AI Art Gallery

AI Art Gallery is a cloud-based AI image sharing web application prepared for deployment on Microsoft Azure.

The project follows a three-tier architecture:

- React frontend deployed with Azure Static Web Apps
- .NET Web API backend designed for Azure Virtual Machines
- Azure SQL Database and Azure Blob Storage for metadata and image files

## Project Structure

- `frontend/`: React application for gallery browsing, user center, and image upload flows
- `backend/`: ASP.NET Core Web API for authentication, image metadata, comments, and likes
- `database/`: Azure SQL schema scripts and Azure Blob Storage helper scripts
- `documents/`: project plans, deployment guides, and testing notes
- `demo/`: earlier static UI prototype kept for reference

## Deployment Focus

The first deployment target is the frontend on Azure Static Web Apps. The recommended build settings are:

- App location: `/frontend`
- API location: leave empty
- Output location: `dist`

Backend and data services are planned to be deployed separately on Azure VM, Azure SQL Database, and Azure Blob Storage.
