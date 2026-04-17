# AI Art Gallery Data Layer

This folder contains the Azure SQL Database and Azure Blob Storage related assets for the AI Art Gallery project.

## Included Content

- Azure SQL schema scripts
- Azure SQL seed data scripts
- Azure Blob Storage helper scripts
- setup guidance for the data layer

## Folder Structure

- `sql/001_create_schema.sql`
- `sql/002_seed_demo_data.sql`
- `storage/create-container.ps1`

## Intended Usage

- Run the SQL scripts against Azure SQL Database
- Create the Blob container in your Azure Storage Account
- Use the backend in `backend/` to read and write data
