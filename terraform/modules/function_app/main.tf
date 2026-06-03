variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "function_app_name" {
  type = string
}

variable "storage_account_name" {
  type = string
}

variable "storage_account_access_key" {
  type      = string
  sensitive = true
}

variable "storage_connection_string" {
  type      = string
  sensitive = true
}

variable "application_insights_key" {
  type      = string
  sensitive = true
}

variable "application_insights_connection_string" {
  type      = string
  sensitive = true
}

variable "tags" {
  type = map(string)
}

variable "document_intelligence_endpoint" {
  type = string
}

variable "document_intelligence_api_key" {
  type      = string
  sensitive = true
}

resource "azurerm_service_plan" "this" {
  name                = "${var.function_app_name}-plan"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"
  tags                = var.tags
}

resource "azurerm_linux_function_app" "this" {
  name                = var.function_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.this.id
  storage_account_name       = var.storage_account_name
  storage_account_access_key = var.storage_account_access_key

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      node_version = "18"
    }

    application_insights_key               = var.application_insights_key
    application_insights_connection_string = var.application_insights_connection_string
  }

  app_settings = {
    AzureWebJobsStorage                   = var.storage_connection_string
    FUNCTIONS_WORKER_RUNTIME              = "node"
    AzureWebJobsFeatureFlags              = "EnableWorkerIndexing"
    PROCESSED_CONTAINER                   = "processed"
    APPLICATIONINSIGHTS_CONNECTION_STRING = var.application_insights_connection_string
    DOCUMENT_INTELLIGENCE_ENDPOINT        = var.document_intelligence_endpoint
    DOCUMENT_INTELLIGENCE_API_KEY         = var.document_intelligence_api_key
  }

  tags = var.tags
}

resource "azurerm_role_assignment" "function_storage_blob_contributor" {
  scope                = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.Storage/storageAccounts/${var.storage_account_name}"
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_function_app.this.identity[0].principal_id
}

data "azurerm_client_config" "current" {}

output "name" {
  value = azurerm_linux_function_app.this.name
}

output "default_hostname" {
  value = azurerm_linux_function_app.this.default_hostname
}

output "managed_identity_principal_id" {
  value = azurerm_linux_function_app.this.identity[0].principal_id
}
