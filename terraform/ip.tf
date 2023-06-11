resource "digitalocean_floating_ip" "public-ip" {
  region = var.region
}

resource "digitalocean_floating_ip_assignment" "public-ip" {
  ip_address = digitalocean_floating_ip.public-ip.ip_address
  droplet_id = digitalocean_droplet.minitwit-swarm-leader.id
}

output "public_ip" {
  value = digitalocean_floating_ip.public-ip.ip_address
}

output "manager_token" {
  value = file("/temp/manager_token")
}

output "worker_token" {
  value = file("/temp/worker_token")
}