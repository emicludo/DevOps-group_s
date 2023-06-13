variable "ssh_key" {}
variable "ssh_user" {}
variable "space_name" {}
variable aws_secret_access_key {}
variable aws_access_key_id {}
variable state_file {}

variable "manager_count" {
  default = 1
}
variable "worker_count" {
  default = 1
}

#  _                _
# | | ___  __ _  __| | ___ _ __
# | |/ _ \/ _` |/ _` |/ _ \ '__|
# | |  __/ (_| | (_| |  __/ |
# |_|\___|\__,_|\__,_|\___|_|

# create cloud vm
resource "digitalocean_droplet" "minitwit-swarm-leader" {
  image = "docker-22-04"
  name = "minitwit-swarm-leader"
  region = var.region
  size = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.minitwit.fingerprint]

  connection {
    user = "root"
    host = self.ipv4_address
    type = "ssh"
    private_key = file(var.pvt_key)
    timeout = "2m"
  }

  provisioner "file" {
    source      = "stack/minitwit_stack.yml"
    destination = "/root/minitwit_stack.yml"
  }

  provisioner "remote-exec" {
    inline = [
      "ufw allow 2377/tcp",
      "ufw allow 7946",
      "ufw allow 4789/udp",
      "ufw allow 80",
      "ufw allow 8080",
      "ufw allow 8888",
      "docker swarm init --advertise-addr ${self.ipv4_address}"
    ]
  }
}

#  _ __ ___   __ _ _ __   __ _  __ _  ___ _ __
# | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '__|
# | | | | | | (_| | | | | (_| | (_| |  __/ |
# |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_|
#                              |___/

# create cloud vm
resource "digitalocean_droplet" "minitwit-swarm-manager" {
  # create managers after the leader
  depends_on = [digitalocean_droplet.minitwit-swarm-leader]

  # number of vms to create
  count = var.manager_count

  image = "docker-22-04"
  name = "minitwit-swarm-manager-${count.index}"
  region = var.region
  size = "s-1vcpu-1gb"
  # add public ssh key so we can access the machine
  ssh_keys = [digitalocean_ssh_key.minitwit.fingerprint]

  # specify a ssh connection
  connection {
    user = "root"
    host = self.ipv4_address
    type = "ssh"
    private_key = file(var.pvt_key)
    timeout = "2m"
  }

    provisioner "file" {
    source      = "ssh_key/terraform"
    destination = "/root/terraform"
  }

  provisioner "remote-exec" {
    inline = [
      # allow ports for docker swarm
      "ufw allow 2377/tcp",
      "ufw allow 7946",
      "ufw allow 4789/udp",
      # ports for apps
      "ufw allow 80",
      "ufw allow 8080",
      "ufw allow 8888",

      "chmod 600 terraform",
      # ssh into the leader with self private key and retrieve the manager token from /temp/manager_token
      "ssh -o 'StrictHostKeyChecking no' -i terraform root@${digitalocean_droplet.minitwit-swarm-leader.ipv4_address} 'docker swarm join-token manager -q' > /root/manager_token",
      
      # join swarm cluster as managers
      "docker swarm join --token $(cat /root/manager_token) ${digitalocean_droplet.minitwit-swarm-leader.ipv4_address}"
    ]
  }
}

#                     _
# __      _____  _ __| | _____ _ __
# \ \ /\ / / _ \| '__| |/ / _ \ '__|
#  \ V  V / (_) | |  |   <  __/ |
#   \_/\_/ \___/|_|  |_|\_\___|_|
#
# create cloud vm
resource "digitalocean_droplet" "minitwit-swarm-worker" {
  # create workers after the leader
  depends_on = [digitalocean_droplet.minitwit-swarm-leader]

  # number of vms to create
  count = var.worker_count

  image = "docker-22-04"
  name = "minitwit-swarm-worker-${count.index}"
  region = var.region
  size = "s-1vcpu-1gb"
  # add public ssh key so we can access the machine
  ssh_keys = [digitalocean_ssh_key.minitwit.fingerprint]

  # specify a ssh connection
  connection {
    user = "root"
    host = self.ipv4_address
    type = "ssh"
    private_key = file(var.pvt_key)
    timeout = "2m"
  }

  provisioner "file" {
    source      = "ssh_key/terraform"
    destination = "/root/terraform"
  }

  provisioner "remote-exec" {
    inline = [
      # allow ports for docker swarm
      "ufw allow 2377/tcp",
      "ufw allow 7946",
      "ufw allow 4789/udp",
      # ports for apps
      "ufw allow 80",
      "ufw allow 8080",
      "ufw allow 8888",

       "chmod 600 terraform",
      # ssh into the leader with self private key and retrieve the manager token
      "ssh -o 'StrictHostKeyChecking no' -i terraform root@${digitalocean_droplet.minitwit-swarm-leader.ipv4_address} 'docker swarm join-token worker -q' > /root/worker_token",

      # join swarm cluster as workers
      "docker swarm join --token $(cat /root/worker_token) ${digitalocean_droplet.minitwit-swarm-leader.ipv4_address}"
    ]
  }
}

output "minitwit-swarm-leader-ip-address" {
  value = digitalocean_droplet.minitwit-swarm-leader.ipv4_address
}

output "minitwit-swarm-manager-ip-address" {
  value = digitalocean_droplet.minitwit-swarm-manager.*.ipv4_address
}

output "minitwit-swarm-worker-ip-address" {
  value = digitalocean_droplet.minitwit-swarm-worker.*.ipv4_address
}