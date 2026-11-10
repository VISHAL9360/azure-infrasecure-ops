output "loadbalancer_public_ip" {
  value = azurerm_public_ip.main.ip_address
}

output "loadbalancer_dns_name" {
  value = azurerm_public_ip.main.domain_name_label
}

output "vmss_id" {
  value = azurerm_linux_virtual_machine_scale_set.main.id
}
