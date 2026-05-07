# BPMN Flow Diagrams

This folder contains BPMN 2.0 process diagrams for the AI Art Gallery project.

The diagrams are designed for the current project architecture:

- React frontend on Azure Static Web Apps
- .NET Web API backend on Azure Virtual Machine
- Azure SQL Database for structured data
- Azure Blob Storage for image files
- GitHub as source control and CI/CD trigger

## Files

- `01-user-authentication.bpmn`: user registration and login flow
- `02-image-upload.bpmn`: image upload, Blob Storage, and metadata persistence flow
- `03-gallery-search-browse.bpmn`: gallery browsing and tag/search filtering flow
- `04-user-interaction.bpmn`: likes, comments, and user statistics flow
- `05-github-azure-static-web-apps-deployment.bpmn`: GitHub push and Azure Static Web Apps deployment flow

## How to Open

You can open these files with:

- Camunda Modeler
- bpmn.io
- draw.io / diagrams.net with BPMN support

## Current Scope

The BPMN files now only describe features that exist in the current project code:

- User registration and login with JWT response
- Protected React routes with local session storage
- Gallery image listing with keyword and tag filters
- Image detail page with prompt, likes, and comments
- Image upload through the React upload modal
- Backend upload to Azure Blob Storage and metadata save to Azure SQL Database
- User-specific uploaded image list
- User Center summary with uploaded image count, received likes, and received comments
- Like and comment interactions
- GitHub push triggered Azure Static Web Apps workflow

## Removed From Previous Draft

The following ideas were removed because they are not implemented in the current code:

- Email verification flow
- Account lockout or retry limit
- Content moderation or comment review
- Owner notification after likes or comments
- File safety scan
- Automatic gallery refresh timer
- SQL failure compensation that deletes an already uploaded Blob
- Deployment rollback workflow
- Build timeout handling beyond the normal GitHub Actions failure path

## BPMN Elements Used

The diagrams use more than simple step-by-step task chains. They include:

- Swimlanes for user, frontend, backend, Azure SQL Database, Azure Blob Storage, GitHub, and Azure Static Web Apps responsibilities
- Exclusive gateways for actual validation decisions such as login success, duplicate email, client form validation, authorization, file missing, empty search results, image not found, duplicate like, and deployment success
- Data objects for inputs and outputs such as login requests, registration forms, image files, metadata forms, Blob URLs, DTOs, build artifacts, and logs
- Data stores for persistent resources such as Users, Images, Likes, Comments, Azure Blob containers, GitHub repositories, and Azure Static Web Apps hosting
- Data associations that connect tasks to the documents, artifacts, and storage resources they read from or produce
- Orthogonal edge routing with bend points to reduce diagonal line crossing and make the diagrams easier to read in Camunda Modeler or bpmn.io

## Notes

These diagrams are current-code-focused. They intentionally avoid planned or optional features unless those features already appear in the frontend, backend, database scripts, or GitHub Actions workflow.

## Suggested Future Features Not Included

If the project needs more advanced BPMN diagrams later, the following features could be added to both code and diagrams:

- Email verification during registration
- Delete or edit uploaded images
- Real content moderation for comments and uploaded images
- Owner notifications for likes and comments
- Blob cleanup if SQL metadata saving fails after upload
- Runtime configuration file for changing API URL without rebuilding the frontend
- More detailed GitHub Actions error handling and deployment rollback documentation
