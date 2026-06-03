variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "app_service_name" {
  type = string
}

variable "storage_connection_string" {
  type      = string
  sensitive = true
}

variable "tags" {
  type    = map(string)
  default = {}
}
