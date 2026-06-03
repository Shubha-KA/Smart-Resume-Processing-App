resource "azurerm_service_plan" "asp" {
  name                = "${var.app_service_name}-asp"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"
  tags                = var.tags
}

resource "azurerm_linux_web_app" "app" {
  name                = var.app_service_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.asp.id
  tags                = var.tags

  site_config {
    always_on = false
    application_stack {
      node_version = "18-lts"
    }
  }

  app_settings = {
    "AZURE_STORAGE_CONNECTION_STRING" = var.storage_connection_string
    "AZURE_STORAGE_CONTAINER"         = "resumes"
    "PORT"                            = "8080"
    "WEBSITES_PORT"                   = "8080"
  }
}
