output "endpoint" {
  description = "The endpoint of the Cognitive Services Account"
  value       = azurerm_cognitive_account.this.endpoint
}

output "primary_access_key" {
  description = "The primary access key for the Cognitive Services Account"
  value       = azurerm_cognitive_account.this.primary_access_key
  sensitive   = true
}
