# api token
# here it is exported in the environment like
# export TF_VAR_do_token=xxx
variable "do_token" {}

# make sure to generate a pair of ssh keys
variable "pub_key" {}
variable "pvt_key" {}

# do region
variable "region" {
  default = "fra1"
  description = "DigitalOcean region"
}

# make sure to generate a pair of ssh keys
#variable "pub_key" {}
#variable "pvt_key" {}

# setup the provider
terraform {
        required_providers {
                digitalocean = {
                        source = "digitalocean/digitalocean"
                        version = "~> 2.8.0"
                }
                null = {
                        source = "hashicorp/null"
                        version = "3.1.0"
                }
        }
}

provider "digitalocean" {
  token = var.do_token
}