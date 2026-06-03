variable "name" {
  description = "Name of the cognitive account"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Location for the cognitive account"
  type        = string
}

variable "tags" {
  description = "Tags for the cognitive account"
  type        = map(string)
  default     = {}
}
