variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "rg-smart-resume-v2"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "Central India"
}

variable "project_name" {
  description = "Project name prefix used for resource naming"
  type        = string
  default     = "smartresume"
}

variable "storage_account_prefix" {
  description = "Prefix for the storage account name (must be globally unique)"
  type        = string
  default     = "smartresume"
}

variable "tags" {
  description = "Tags applied to all resources"
  type        = map(string)
  default = {
    project     = "smart-resume-processing"
    environment = "demo"
    managed_by  = "terraform"
  }
}
