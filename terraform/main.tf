terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

module "resource_group" {
  source = "./modules/resource_group"

  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

module "storage" {
  source = "./modules/storage"

  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  storage_account_name = "${var.storage_account_prefix}${random_string.suffix.result}"
  tags                = var.tags
}

module "application_insights" {
  source = "./modules/application_insights"

  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  name                = "${var.project_name}-insights"
  tags                = var.tags
}

module "function_app" {
  source = "./modules/function_app"

  resource_group_name          = module.resource_group.name
  location                     = module.resource_group.location
  function_app_name            = "${var.project_name}-func-${random_string.suffix.result}"
  storage_account_name         = module.storage.name
  storage_account_access_key   = module.storage.primary_access_key
  storage_connection_string    = module.storage.primary_connection_string
  application_insights_key     = module.application_insights.instrumentation_key
  application_insights_connection_string = module.application_insights.connection_string
  tags                         = var.tags
}

module "app_service" {
  source = "./modules/app_service"

  resource_group_name       = module.resource_group.name
  location                  = module.resource_group.location
  app_service_name          = "${var.project_name}-app-${random_string.suffix.result}"
  storage_connection_string = module.storage.primary_connection_string
  tags                      = var.tags
}

