# Architecture Documentation

## System Overview

The Smart Resume Processing System is an event-driven, serverless pipeline built on Azure. It demonstrates how blob storage events can trigger compute without manual orchestration.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite)                                    │   │
│  │  • File upload form (PDF only)                            │   │
│  │  • Drag-and-drop support                                  │   │
│  │  • Upload status feedback                                 │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP POST /api/upload
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Node.js Express API                                      │   │
│  │  • Multer file handling                                   │   │
│  │  • @azure/storage-blob SDK                                │   │
│  │  • Uploads to "resumes" container                         │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────┘
                            │ Put Blob
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Azure Storage                            │
│  ┌─────────────────────┐      ┌─────────────────────────────┐   │
│  │  Container: resumes │      │  Container: processed       │   │
│  │  (raw PDF uploads)  │      │  (metadata JSON output)     │   │
│  └──────────┬──────────┘      └──────────────▲──────────────┘   │
└─────────────┼───────────────────────────────┼───────────────────┘
              │ Blob Created Event            │ Put Blob
              ▼                               │
┌─────────────────────────────────────────────────────────────────┐
│                      Serverless Compute Layer                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Azure Function (Python 3.11)                             │   │
│  │  Trigger: Blob Trigger on resumes/{name}                  │   │
│  │  Actions:                                                 │   │
│  │    1. Read blob stream                                    │   │
│  │    2. Extract fileName, fileSize, uploadTimestamp         │   │
│  │    3. Build metadata JSON                                 │   │
│  │    4. Write to processed container                        │   │
│  │    5. Log to Application Insights                         │   │
│  │  Identity: System-Assigned Managed Identity               │   │
│  └────────────────────────┬─────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────┘
                            │ Telemetry
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Observability Layer                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Application Insights + Log Analytics Workspace           │   │
│  │  • Function execution traces                              │   │
│  │  • Custom log messages                                    │   │
│  │  • Performance metrics                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Azure Resources (Terraform)

| Resource | Purpose |
|----------|---------|
| `azurerm_resource_group` | Logical grouping of all resources |
| `azurerm_storage_account` | Blob storage for resumes and metadata |
| `azurerm_storage_container.resumes` | Incoming PDF uploads |
| `azurerm_storage_container.processed` | Processed metadata JSON files |
| `azurerm_log_analytics_workspace` | Log aggregation backend |
| `azurerm_application_insights` | Monitoring and tracing |
| `azurerm_service_plan` | Consumption (Y1) plan for serverless |
| `azurerm_linux_function_app` | Python function runtime |
| `azurerm_role_assignment` | Managed identity → Storage Blob Data Contributor |

## Security Considerations

- Storage containers are **private** (no public blob access)
- Function App uses **Managed Identity** with RBAC instead of embedding keys
- Backend uses connection string (for demo simplicity); production should use Managed Identity or SAS tokens
- TLS 1.2 minimum on storage account
- PDF-only validation on both frontend and backend

## Scalability

- **Consumption plan** scales to zero when idle — ideal for demo/education workloads
- Blob triggers scale out automatically with upload volume
- Each upload is processed independently (embarrassingly parallel)

## Future Enhancements

- Add Azure Cognitive Services for resume text extraction
- Queue-based retry for failed processing
- Azure Static Web Apps for frontend hosting
- Key Vault for secrets management
- Cosmos DB for queryable metadata storage
