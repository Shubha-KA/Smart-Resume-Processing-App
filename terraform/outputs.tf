output "resource_group_name" {
  description = "Name of the resource group"
  value       = module.resource_group.name
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = module.storage.name
}

output "storage_connection_string" {
  description = "Primary connection string for the storage account"
  value       = module.storage.primary_connection_string
  sensitive   = true
}

output "resumes_container_name" {
  description = "Blob container for uploaded resumes"
  value       = module.storage.resumes_container_name
}

output "processed_container_name" {
  description = "Blob container for processed metadata"
  value       = module.storage.processed_container_name
}

output "function_app_name" {
  description = "Name of the Azure Function App"
  value       = module.function_app.name
}

output "function_app_default_hostname" {
  description = "Default hostname of the Function App"
  value       = module.function_app.default_hostname
}

output "application_insights_name" {
  description = "Name of the Application Insights resource"
  value       = module.application_insights.name
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = module.application_insights.instrumentation_key
  sensitive   = true
}

output "function_app_managed_identity_principal_id" {
  description = "Principal ID of the Function App managed identity"
  value       = module.function_app.managed_identity_principal_id
}

output "app_service_url" {
  description = "The default hostname of the App Service"
  value       = module.app_service.app_service_default_hostname
}
